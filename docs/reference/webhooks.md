# Webhooks Reference

Technical reference for implementing and managing webhooks with Rocket Learning Rewards, including security patterns, payload formats, and debugging procedures.

## Webhook Architecture

Webhooks provide real-time event delivery from learning management systems to Rocket Learning Rewards, enabling immediate point allocation and analytics tracking.

### Event Flow

```
[LMS Event] ’ [Webhook Trigger] ’ [HTTP POST] ’ [Rocket Ingestion] ’ [Points Allocation] ’ [Analytics]
```

### Supported Sources

- **Moodle** - Event Trigger plugin integration
- **OpenLMS** - Enhanced Moodle with enterprise features  
- **LearnWorlds** - Native webhook support
- **Thinkific** - Webhooks API integration
- **Valamis** - xAPI/LRS proxy webhooks
- **Custom** - Direct API integration

## Webhook Endpoints

### Base URL Structure
```
https://your-rocket-domain/api/public/hook/{source}/event
```

### Source-Specific Endpoints

| Source | Endpoint | Authentication |
|--------|----------|----------------|
| Moodle | `/api/public/hook/moodle/event` | Bearer Token |
| OpenLMS | `/api/public/hook/openlms/event` | Bearer Token |
| LearnWorlds | `/api/public/hook/learnworlds/event` | HMAC Signature |
| Thinkific | `/api/public/hook/thinkific/event` | HMAC Signature |
| Valamis | `/api/public/hook/valamis/event` | Bearer Token |
| Custom | `/api/public/hook/custom/event` | Bearer Token |

## Authentication Methods

### Bearer Token Authentication

**Header Format:**
```http
Authorization: Bearer your-secure-token-here
```

**Token Generation:**
```bash
# Generate secure token
openssl rand -hex 32

# Example output
a1b2c3d4e5f6789...
```

**Implementation Example:**
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.ROCKET_WEBHOOK_TOKEN}`
};
```

### HMAC Signature Verification

**Required for:** LearnWorlds, Thinkific

**Header Format:**
```http
X-Signature: sha256=calculated-hmac-signature
```

**Verification Implementation:**
```javascript
const crypto = require('crypto');

function verifyHMACSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload, 'utf8');
  const calculatedSignature = 'sha256=' + hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
}
```

**Security Notes:**
- Always use `crypto.timingSafeEqual()` to prevent timing attacks
- Verify signature before processing payload
- Use raw request body for signature calculation
- Store webhook secrets securely (environment variables)

## Webhook Payload Formats

### Standard Request Format

**HTTP Method:** POST
**Content-Type:** application/json

### Moodle Event Trigger Format

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
  "other": {
    "completiontime": 1662013333
  }
}
```

### LearnWorlds Webhook Format

```json
{
  "topic": "course.completed",
  "occurred_at": "2025-08-21T10:15:30Z",
  "data": {
    "user_id": "U-123",
    "course_id": "C-987", 
    "progress": 100,
    "completion_time": "2025-08-21T10:15:30Z"
  },
  "signature": "sha256=..."
}
```

### Thinkific Webhook Format

```json
{
  "topic": "lesson.completed",
  "created_at": "2025-08-21T10:15:30Z",
  "payload": {
    "user": {
      "id": 123,
      "email": "learner@example.com"
    },
    "course_id": 987,
    "lesson_id": 456,
    "progress_percentage": 100
  },
  "hmac": "sha256-calculated-signature"
}
```

## Response Handling

### Expected Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Event processed successfully |
| 202 | Accepted | Event queued for processing |
| 400 | Bad Request | Invalid payload format |
| 401 | Unauthorized | Authentication failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal processing error |

### Response Body Format

**Success Response:**
```json
{
  "status": "success",
  "event_id": "evt_123456789",
  "processed_at": "2025-08-21T10:15:30Z",
  "points_awarded": 50
}
```

**Error Response:**
```json
{
  "status": "error",
  "error_code": "INVALID_PAYLOAD",
  "message": "Required field 'user_id' is missing",
  "details": {
    "field": "user_id",
    "expected": "string"
  }
}
```

## Rate Limits & Quotas

### Default Limits

| Endpoint | Rate Limit | Burst Limit | Window |
|----------|------------|-------------|---------|
| All webhook endpoints | 1000/min | 2000/min | 60 seconds |
| Per-source endpoint | 500/min | 1000/min | 60 seconds |
| Per-IP address | 100/min | 200/min | 60 seconds |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1692614400
```

### Handling Rate Limits

**Exponential Backoff Strategy:**
```javascript
async function sendWebhook(payload, retryCount = 0) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: webhookHeaders,
      body: JSON.stringify(payload)
    });
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return sendWebhook(payload, retryCount + 1);
    }
    
    return response;
  } catch (error) {
    if (retryCount < 3) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      return sendWebhook(payload, retryCount + 1);
    }
    throw error;
  }
}
```

## Error Handling & Debugging

### Common Error Scenarios

**Authentication Failures:**
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "AUTHENTICATION_FAILED",
  "message": "Invalid or expired bearer token"
}
```

**Payload Validation Errors:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "VALIDATION_ERROR",
  "message": "Invalid event format",
  "details": {
    "missing_fields": ["user_id", "event_name"],
    "invalid_fields": ["timestamp"]
  }
}
```

### Debugging Checklist

1. **Network Connectivity**
   - Verify webhook endpoint URL is accessible
   - Check SSL certificate validity
   - Confirm DNS resolution

2. **Authentication**
   - Validate bearer token format and expiration
   - Verify HMAC signature calculation
   - Check header format and spelling

3. **Payload Format**
   - Validate JSON syntax
   - Confirm required fields are present
   - Check data types match expected schema

4. **Rate Limits**
   - Monitor request frequency
   - Implement appropriate retry logic
   - Check rate limit headers in responses

## Webhook Testing

### Test Endpoint

**Development Testing:**
```
https://your-rocket-domain/api/public/hook/test/event
```

### Webhook Testing Tools

**cURL Example:**
```bash
curl -X POST https://your-rocket-domain/api/public/hook/moodle/event \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-test-token" \
  -d '{
    "id": 12345,
    "eventname": "\\core\\event\\course_completed",
    "userid": 8774,
    "courseid": 987,
    "timecreated": 1692614400
  }'
```

**Node.js Test Script:**
```javascript
const axios = require('axios');

async function testWebhook() {
  const payload = {
    id: 12345,
    eventname: '\\core\\event\\course_completed',
    userid: 8774,
    courseid: 987,
    timecreated: Math.floor(Date.now() / 1000)
  };

  try {
    const response = await axios.post(
      'https://your-rocket-domain/api/public/hook/moodle/event',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-test-token'
        }
      }
    );
    
    console.log('Webhook successful:', response.data);
  } catch (error) {
    console.error('Webhook failed:', error.response?.data || error.message);
  }
}

testWebhook();
```

### Validation Testing

**Schema Validation Service:**
```bash
curl -X POST https://your-rocket-domain/api/public/validate/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-test-token" \
  -d @test-payload.json
```

## Security Best Practices

### Webhook Security

1. **Use HTTPS Only**
   - Always use HTTPS for webhook endpoints
   - Verify SSL certificates
   - Implement HSTS headers

2. **Authentication**
   - Use strong, unique tokens for each source
   - Rotate tokens regularly (recommended: quarterly)
   - Store tokens securely (environment variables, key vaults)

3. **Signature Verification**
   - Always verify HMAC signatures when provided
   - Use constant-time comparison functions
   - Validate signatures before processing payload

4. **IP Allowlisting**
   - Restrict webhook endpoints to known source IPs
   - Use CIDR notation for IP ranges
   - Monitor for unauthorized access attempts

### Payload Security

1. **Input Validation**
   - Validate all input fields
   - Sanitize user-provided data
   - Check data types and ranges

2. **Rate Limiting**
   - Implement per-source rate limits
   - Use sliding window or token bucket algorithms
   - Apply different limits for different event types

3. **Logging & Monitoring**
   - Log all webhook requests and responses
   - Monitor for unusual patterns or anomalies
   - Set up alerts for failed deliveries or security issues

## Monitoring & Alerting

### Health Monitoring

**Key Metrics:**
- Webhook delivery success rate
- Average response time
- Error rate by status code
- Event processing volume

**Monitoring Implementation:**
```javascript
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  errorRequests: 0,
  averageResponseTime: 0
};

function updateMetrics(success, responseTime) {
  metrics.totalRequests++;
  if (success) {
    metrics.successfulRequests++;
  } else {
    metrics.errorRequests++;
  }
  
  // Calculate rolling average
  metrics.averageResponseTime = (
    (metrics.averageResponseTime * (metrics.totalRequests - 1)) + 
    responseTime
  ) / metrics.totalRequests;
}
```

### Alerting Rules

**Critical Alerts:**
- Webhook success rate < 95% over 5 minutes
- Average response time > 5 seconds
- Authentication failure rate > 1%

**Warning Alerts:**
- Webhook success rate < 99% over 15 minutes
- Unusual event volume (>2x normal rate)
- High rate limit utilization (>80%)

## Troubleshooting Guide

### Webhook Not Receiving Events

**Check List:**
1. Verify webhook URL configuration in source system
2. Confirm endpoint is accessible from source IP
3. Check authentication headers and tokens
4. Review firewall and network security settings

### Events Received But Not Processing

**Debug Steps:**
1. Check webhook payload format against schema
2. Verify required fields are present and valid
3. Review rate limiting and quota usage
4. Check internal processing logs for errors

### Intermittent Failures

**Investigation Areas:**
1. Network connectivity issues
2. SSL certificate problems
3. Rate limiting or quota exceeded
4. Internal server resource constraints

Ready to implement webhooks? **[View Integration Guides ’](../integrations/)** or **[Contact Support ’](../support/contact/)**