# API Reference

Comprehensive technical reference for integrating with Rocket Learning Rewards, including event schemas, webhook implementations, and authentication patterns.

## Event Schema & Standards

### Canonical Event Schema

All events processed by Rocket Learning Rewards follow a standardized schema for consistent data handling and analytics integration.

```json
{
  "event": "course.completed",
  "source": "moodle",
  "occurred_at": "2025-08-21T10:15:30Z",
  "user": {
    "id": "12345",
    "email": "learner@example.edu",
    "external_ids": { "moodle": "8774" }
  },
  "context": {
    "course": { "id": "987", "title": "Health & Safety" },
    "section": { "id": "sec-3", "title": "Risk Basics" },
    "lesson": { "id": "l-12", "title": "PPE Basics" }
  },
  "metrics": {
    "progress_pct": 100,
    "time_on_task_sec": 1420
  },
  "trace": {
    "request_id": "c37c3e...",
    "lms_event_id": "9194694",
    "lms_eventname": "\\core\\event\\course_completed"
  }
}
```

### Event Naming Convention

**Pattern:** `domain.action` 

**Common Events:**
- `course.completed` - Course completion milestone
- `lesson.completed` - Individual lesson completion
- `user.logged_in` - User authentication events
- `assignment.submitted` - Assignment submission
- `quiz.completed` - Quiz completion
- `forum.posted` - Discussion participation

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | Event name following `domain.action` pattern |
| `source` | string | Source system: `moodle`, `openlms`, `learnworlds`, `thinkific`, `valamis`, `custom` |
| `occurred_at` | ISO 8601 | Timestamp when event occurred |
| `user.id` | string | Unique user identifier |
| `trace.lms_event_id` | string | Source system event ID for deduplication |

### Optional Context Fields

| Field | Type | Description |
|-------|------|-------------|
| `user.email` | string | User email address |
| `user.external_ids` | object | External system user mappings |
| `context.course` | object | Course information (id, title) |
| `context.section` | object | Section/module information |
| `context.lesson` | object | Lesson/activity information |
| `metrics.progress_pct` | integer | Completion percentage (0-100) |
| `metrics.time_on_task_sec` | integer | Time spent in seconds |

## Platform-Specific Payloads

### Moodle / OpenLMS Integration

**Event Trigger Plugin Payload:**

```json
{
  "id": 9194694,
  "eventname": "\\core\\event\\course_completed",
  "component": "core",
  "action": "completed",
  "target": "course",
  "objectid": 987,
  "userid": 8774,
  "courseid": 987,
  "timecreated": 1662013333,
  "other": { "completiontime": 1662013333 }
}
```

**Webhook Endpoint Configuration:**
- **URL:** `https://your-rlr-domain/api/public/hook/moodle/event`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Method:** POST
- **Event Mapping:** Configure specific Moodle events to track

### LearnWorlds Integration

**Webhook Payload:**

```json
{
  "topic": "course.completed",
  "occurred_at": "2025-08-21T10:15:30Z",
  "data": {
    "user_id": "U-123",
    "course_id": "C-987",
    "progress": 100
  },
  "signature": "sha256=..."
}
```

**Configuration:**
- **Webhook Topics:** `course.completed`, `lesson.completed`, `enrollment.created`
- **Verification:** HMAC SHA-256 signature validation
- **Rate Limits:** Standard API rate limiting applies

### Thinkific Integration

**Webhook Payload:**

```json
{
  "topic": "lesson.completed",
  "created_at": "2025-08-21T10:15:30Z",
  "payload": {
    "user": { "id": 123, "email": "learner@example.com" },
    "course_id": 987,
    "lesson_id": 456
  },
  "hmac": "..."
}
```

**Webhook Topics:**
- `order.created` - Purchase events
- `enrollment.progress` - Progress updates
- `lesson.completed` - Lesson completions
- `course.completed` - Course completions
- `user.updated` - Profile changes

## Authentication & Security

### Webhook Authentication

**Bearer Token Authentication:**

```http
POST /api/public/hook/moodle/event
Authorization: Bearer your-secure-token-here
Content-Type: application/json
```

**HMAC Signature Verification (Thinkific/LearnWorlds):**

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const calculatedSignature = 'sha256=' + hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
}
```

### Security Best Practices

1. **IP Allowlisting:** Restrict webhook endpoints to known source IPs
2. **Token Rotation:** Rotate bearer tokens periodically
3. **Signature Verification:** Always verify HMAC signatures when provided
4. **Rate Limiting:** Implement appropriate rate limits on webhook endpoints
5. **Request Validation:** Validate all incoming payload structures
6. **Secret Management:** Store secrets securely, never in code or documentation

## Webhook Implementation

### Minimal Webhook Receiver

**Express.js Implementation:**

```javascript
app.post('/api/public/hook/:source/event', verifySignature, async (req, res) => {
  try {
    // Transform platform-specific payload to canonical format
    const canonical = mapToCanonical(req.params.source, req.body);
    
    // Check for duplicate events
    if (await isDuplicate(canonical.trace.lms_event_id)) {
      return res.status(200).send('duplicate');
    }
    
    // Process event and award points
    await awardPoints(canonical);
    
    // Send to analytics pipeline
    await enqueueAnalytics(canonical);
    
    res.status(202).send('ok');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('error');
  }
});
```

### Error Handling

**HTTP Response Codes:**
- `200` - Event processed successfully (including duplicates)
- `202` - Event accepted for processing
- `400` - Invalid payload or authentication
- `401` - Authentication failed
- `500` - Internal processing error

**Retry Logic:**
- Source systems should implement exponential backoff
- Maximum retry attempts: 3
- Retry interval: 1s, 5s, 15s

## Points & Rules Engine

### Rule Configuration Structure

```json
{
  "rule_id": "course_completion",
  "trigger": {
    "event": "course.completed",
    "conditions": {
      "progress_pct": { "gte": 80 }
    }
  },
  "actions": {
    "award_points": 50,
    "issue_badge": "course_master"
  },
  "constraints": {
    "max_per_day": 1,
    "max_per_course": 1,
    "cooldown_minutes": 60
  }
}
```

### Default Point Values

| Activity Type | Points | Constraints |
|---------------|--------|-------------|
| Lesson completion | 10 | Max 3/day |
| Section mastery | 10 | 1 per section |
| Time-boxed completion | 15 | Within recommended window |
| Weekly streak | 20 | Anti-gaming checks |
| Forum post (quality) | 5 | Rate-limited |
| Course completion | 50 | One-time per course |
| Programme completion | 100 | Once per user |

### Anti-Gaming Measures

1. **Deduplication:** Events with same `lms_event_id` are ignored
2. **Rate Limits:** Per-user daily/hourly caps on point earning
3. **Cooldown Periods:** Minimum time between similar events
4. **Validation:** Business logic validation on event data
5. **Audit Trail:** Complete logging for fraud detection

## Analytics Integration

### Mixpanel Event Format

**Server-side Import:**

```json
POST https://api.mixpanel.com/import
Authorization: Basic <base64-encoded-credentials>

[
  {
    "event": "lesson.completed",
    "properties": {
      "time": 1724230530,
      "distinct_id": "U-123",
      "course_id": "C-987",
      "lesson_id": "L-456",
      "source": "thinkific",
      "event_id": "thinkific-evt-123",
      "progress_pct": 100,
      "time_on_task_sec": 1420
    }
  }
]
```

### Required Analytics Properties

- `distinct_id` - Unique user identifier
- `time` - Unix timestamp (seconds)
- `event_id` - Unique event identifier for deduplication
- `source` - Source system identifier

## Rate Limits & Quotas

### API Endpoints

| Endpoint | Rate Limit | Burst Limit |
|----------|------------|-------------|
| Webhook ingestion | 1000/min | 2000/min |
| Analytics export | 100/min | 200/min |
| User management | 500/min | 1000/min |

### Event Processing

- **Maximum events per user per day:** 1000
- **Maximum duplicate event tolerance:** 24 hours
- **Event processing SLA:** 99.9% within 5 seconds

## Error Codes & Troubleshooting

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "invalid_payload",
  "message": "Required field 'user.id' is missing",
  "details": {
    "field": "user.id",
    "expected": "string"
  }
}
```

**401 Unauthorized:**
```json
{
  "error": "authentication_failed",
  "message": "Invalid or expired bearer token"
}
```

**429 Rate Limited:**
```json
{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded",
  "retry_after": 60
}
```

### Debugging Checklist

1. **Webhook not receiving events:**
   - Check source system webhook configuration
   - Verify DNS/SSL for endpoint URL
   - Confirm authentication headers
   - Check IP allowlist settings

2. **Events not awarding points:**
   - Verify event schema matches requirements
   - Check for duplicate event IDs
   - Confirm user exists in system
   - Review rule configuration and constraints

3. **Analytics data missing:**
   - Verify Mixpanel project configuration
   - Check event property formatting
   - Ensure `distinct_id` and `time` are present
   - Review event naming conventions

## SDK & Libraries

### Official SDKs

**Node.js SDK:**
```bash
npm install @rocket-learning/sdk
```

```javascript
const RocketSDK = require('@rocket-learning/sdk');

const client = new RocketSDK({
  apiKey: 'your-api-key',
  environment: 'production' // or 'staging'
});

await client.events.track({
  event: 'course.completed',
  userId: 'user-123',
  properties: {
    course_id: 'course-456',
    progress_pct: 100
  }
});
```

**Python SDK:**
```bash
pip install rocket-learning-sdk
```

```python
from rocket_learning import RocketClient

client = RocketClient(
    api_key='your-api-key',
    environment='production'
)

client.events.track(
    event='course.completed',
    user_id='user-123',
    properties={
        'course_id': 'course-456',
        'progress_pct': 100
    }
)
```

### Custom Integration Support

For custom integrations or unsupported platforms:

1. **REST API Documentation:** Complete OpenAPI specification available
2. **Webhook Templates:** Reference implementations in multiple languages  
3. **Integration Support:** Dedicated technical assistance
4. **Certification Program:** Validation and certification for custom integrations

Ready to integrate? **[Start with Webhooks Setup ’](webhooks/)** or **[Contact Technical Support ’](../support/contact/)**