# Developer Resources

Comprehensive development resources for integrating with Rocket Learning Rewards, including SDKs, code examples, and implementation templates.

## Quick Start for Developers

### Integration Overview

Rocket Learning Rewards provides multiple integration paths:

1. **Webhook Integration** - Real-time event delivery from LMS platforms
2. **REST API** - Direct programmatic integration
3. **SDK Libraries** - Pre-built connectors for popular languages
4. **Batch Import** - CSV-based historical data import

## SDKs & Libraries

### Official SDKs

<div class="cedar-features-grid">
<div class="cedar-feature-card">
<div class="feature-icon-wrapper primary-icon">
:material-nodejs:{ .cedar-feature-icon }
</div>
<h3>Node.js SDK</h3>
<p>Full-featured SDK with TypeScript support for server-side integration</p>
<a href="#nodejs-sdk" class="feature-link">View Documentation →</a>
</div>

<div class="cedar-feature-card">
<div class="feature-icon-wrapper secondary-icon">
:material-language-python:{ .cedar-feature-icon }
</div>
<h3>Python SDK</h3>
<p>Comprehensive Python library with async support and data validation</p>
<a href="#python-sdk" class="feature-link">View Documentation →</a>
</div>

<div class="cedar-feature-card">
<div class="feature-icon-wrapper tertiary-icon">
:material-language-php:{ .cedar-feature-icon }
</div>
<h3>PHP SDK</h3>
<p>Lightweight PHP library for web application integration</p>
<a href="#php-sdk" class="feature-link">View Documentation →</a>
</div>

<div class="cedar-feature-card">
<div class="feature-icon-wrapper primary-icon">
:material-language-java:{ .cedar-feature-icon }
</div>
<h3>Java SDK</h3>
<p>Enterprise-ready Java library with Spring Boot integration support</p>
<a href="#java-sdk" class="feature-link">View Documentation →</a>
</div>
</div>

### Node.js SDK

**Installation:**
```bash
npm install @rocket-learning/sdk
```

**Basic Usage:**
```javascript
const RocketSDK = require('@rocket-learning/sdk');

const client = new RocketSDK({
  apiKey: process.env.ROCKET_API_KEY,
  environment: 'production', // or 'staging'
  baseURL: 'https://api.rocketlearningrewards.com'
});

// Track a learning event
await client.events.track({
  event: 'course.completed',
  userId: 'user-123',
  properties: {
    course_id: 'course-456',
    progress_pct: 100,
    time_on_task_sec: 3600
  }
});

// Award points directly
await client.points.award({
  userId: 'user-123',
  points: 50,
  reason: 'Course completion bonus'
});
```

**Advanced Configuration:**
```javascript
const client = new RocketSDK({
  apiKey: process.env.ROCKET_API_KEY,
  environment: 'production',
  retry: {
    enabled: true,
    maxRetries: 3,
    backoffMultiplier: 2
  },
  timeout: 30000,
  validateEvents: true
});

// Event validation
const eventSchema = {
  event: { type: 'string', required: true },
  userId: { type: 'string', required: true },
  properties: {
    course_id: { type: 'string', required: true },
    progress_pct: { type: 'number', min: 0, max: 100 }
  }
};

client.setEventSchema(eventSchema);
```

### Python SDK

**Installation:**
```bash
pip install rocket-learning-sdk
```

**Synchronous Usage:**
```python
from rocket_learning import RocketClient

client = RocketClient(
    api_key=os.environ['ROCKET_API_KEY'],
    environment='production'
)

# Track event
client.events.track(
    event='lesson.completed',
    user_id='user-123',
    properties={
        'course_id': 'course-456',
        'lesson_id': 'lesson-789',
        'progress_pct': 75
    }
)

# Get user points balance
balance = client.users.get_balance('user-123')
print(f"User balance: {balance['points']} points")
```

**Asynchronous Usage:**
```python
import asyncio
from rocket_learning import AsyncRocketClient

async def main():
    client = AsyncRocketClient(
        api_key=os.environ['ROCKET_API_KEY'],
        environment='production'
    )
    
    # Batch event tracking
    events = [
        {
            'event': 'lesson.completed',
            'user_id': f'user-{i}',
            'properties': {'lesson_id': 'lesson-123'}
        }
        for i in range(100)
    ]
    
    await client.events.track_batch(events)
    await client.close()

asyncio.run(main())
```

### PHP SDK

**Installation via Composer:**
```bash
composer require rocket-learning/php-sdk
```

**Basic Usage:**
```php
<?php
require_once 'vendor/autoload.php';

use RocketLearning\Client;

$client = new Client([
    'api_key' => $_ENV['ROCKET_API_KEY'],
    'environment' => 'production'
]);

// Track event
$client->events->track([
    'event' => 'quiz.completed',
    'user_id' => 'user-123',
    'properties' => [
        'quiz_id' => 'quiz-456',
        'score' => 85,
        'time_taken_sec' => 1200
    ]
]);

// Award badge
$client->badges->award([
    'user_id' => 'user-123',
    'badge_id' => 'quiz_master',
    'metadata' => [
        'quiz_score' => 85,
        'attempts' => 1
    ]
]);
?>
```

### Java SDK

**Maven Dependency:**
```xml
<dependency>
    <groupId>com.rocketlearning</groupId>
    <artifactId>rocket-learning-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

**Spring Boot Integration:**
```java
@Configuration
public class RocketConfig {
    
    @Bean
    public RocketClient rocketClient() {
        return RocketClient.builder()
            .apiKey(environment.getProperty("rocket.api.key"))
            .environment(Environment.PRODUCTION)
            .retryPolicy(RetryPolicy.exponentialBackoff(3, Duration.ofSeconds(1)))
            .build();
    }
}

@Service
public class LearningEventService {
    
    @Autowired
    private RocketClient rocketClient;
    
    public void trackCourseCompletion(String userId, String courseId) {
        rocketClient.events().track(
            Event.builder()
                .event("course.completed")
                .userId(userId)
                .property("course_id", courseId)
                .property("completion_time", Instant.now())
                .build()
        );
    }
}
```

## Webhook Implementation Examples

### Express.js Webhook Receiver

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

// Middleware for raw body parsing (needed for signature verification)
app.use('/webhooks', express.raw({ type: 'application/json' }));

// HMAC signature verification middleware
function verifySignature(req, res, next) {
  const signature = req.headers['x-signature'];
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!signature) {
    return res.status(401).send('Missing signature');
  }
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(req.body);
  const calculatedSignature = 'sha256=' + hmac.digest('hex');
  
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature))) {
    return res.status(401).send('Invalid signature');
  }
  
  // Parse JSON after signature verification
  req.body = JSON.parse(req.body);
  next();
}

// Webhook endpoint with duplicate prevention
const processedEvents = new Set();

app.post('/webhooks/rocket', verifySignature, async (req, res) => {
  try {
    const event = req.body;
    
    // Prevent duplicate processing
    const eventId = event.id || `${event.user_id}-${event.event}-${event.timestamp}`;
    if (processedEvents.has(eventId)) {
      return res.status(200).send('Duplicate event ignored');
    }
    
    processedEvents.add(eventId);
    
    // Process event based on type
    switch (event.event) {
      case 'course.completed':
        await handleCourseCompletion(event);
        break;
      case 'lesson.completed':
        await handleLessonCompletion(event);
        break;
      default:
        console.log(`Unknown event type: ${event.event}`);
    }
    
    res.status(200).send('Event processed');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Processing error');
  }
});

async function handleCourseCompletion(event) {
  // Award completion points
  await rocketClient.points.award({
    userId: event.user_id,
    points: 50,
    reason: 'Course completion',
    metadata: {
      course_id: event.properties.course_id,
      completion_time: event.timestamp
    }
  });
  
  // Check for badges
  await checkCompletionBadges(event.user_id, event.properties.course_id);
}
```

### Django Webhook Handler

```python
import json
import hashlib
import hmac
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings

@csrf_exempt
@require_http_methods(["POST"])
def rocket_webhook(request):
    # Verify signature
    signature = request.headers.get('X-Signature')
    if not signature:
        return HttpResponseBadRequest('Missing signature')
    
    expected_signature = 'sha256=' + hmac.new(
        settings.WEBHOOK_SECRET.encode(),
        request.body,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        return HttpResponseBadRequest('Invalid signature')
    
    try:
        event = json.loads(request.body)
        process_learning_event(event)
        return HttpResponse('OK')
    except Exception as e:
        logger.error(f'Webhook processing error: {e}')
        return HttpResponseBadRequest('Processing error')

def process_learning_event(event):
    event_type = event.get('event')
    user_id = event.get('user_id')
    
    if event_type == 'course.completed':
        # Update user progress in database
        UserProgress.objects.update_or_create(
            user_id=user_id,
            course_id=event['properties']['course_id'],
            defaults={
                'completed': True,
                'completion_date': timezone.now(),
                'points_awarded': event.get('points_awarded', 0)
            }
        )
```

## Event Schema Validation

### JSON Schema Definition

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["event", "user_id", "timestamp"],
  "properties": {
    "event": {
      "type": "string",
      "pattern": "^[a-z]+\\.[a-z_]+$",
      "examples": ["course.completed", "lesson.completed"]
    },
    "user_id": {
      "type": "string",
      "minLength": 1
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "properties": {
      "type": "object",
      "properties": {
        "course_id": { "type": "string" },
        "lesson_id": { "type": "string" },
        "progress_pct": { 
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "time_on_task_sec": {
          "type": "integer",
          "minimum": 0
        }
      }
    }
  }
}
```

### Validation Implementation

**JavaScript (ajv):**
```javascript
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

const eventSchema = { /* schema from above */ };
const validateEvent = ajv.compile(eventSchema);

function processEvent(eventData) {
  if (!validateEvent(eventData)) {
    throw new Error(`Invalid event: ${JSON.stringify(validateEvent.errors)}`);
  }
  
  // Process validated event
  return handleValidatedEvent(eventData);
}
```

**Python (jsonschema):**
```python
from jsonschema import validate, ValidationError

EVENT_SCHEMA = {
    # schema definition from above
}

def process_event(event_data):
    try:
        validate(instance=event_data, schema=EVENT_SCHEMA)
        return handle_validated_event(event_data)
    except ValidationError as e:
        raise ValueError(f"Invalid event schema: {e.message}")
```

## CSV Import Templates

### Event Import CSV Format

**Required Columns:**
```csv
event,user_id,timestamp,course_id,lesson_id,progress_pct,time_on_task_sec,event_id,source
course.completed,user-123,1692614400,course-456,,100,3600,evt-789,moodle
lesson.completed,user-123,1692614350,course-456,lesson-101,50,1200,evt-790,moodle
quiz.completed,user-124,1692614500,course-456,quiz-201,85,900,evt-791,moodle
```

**Python Import Script:**
```python
import csv
import requests
from datetime import datetime

def import_events_from_csv(filepath, api_key):
    events = []
    
    with open(filepath, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Convert timestamp if needed
            if row['timestamp'].isdigit():
                row['timestamp'] = datetime.fromtimestamp(int(row['timestamp'])).isoformat()
            
            # Build event object
            event = {
                'event': row['event'],
                'user_id': row['user_id'],
                'timestamp': row['timestamp'],
                'properties': {
                    'course_id': row.get('course_id'),
                    'lesson_id': row.get('lesson_id'),
                    'progress_pct': int(row['progress_pct']) if row.get('progress_pct') else None
                },
                'metadata': {
                    'event_id': row.get('event_id'),
                    'source': row.get('source', 'csv_import')
                }
            }
            
            events.append(event)
    
    # Batch import events
    response = requests.post(
        'https://api.rocketlearningrewards.com/v1/events/batch',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        json={'events': events}
    )
    
    return response.json()

# Usage
result = import_events_from_csv('learning_events.csv', 'your-api-key')
print(f"Imported {result['processed']} events")
```

## Testing & Debugging Tools

### Event Testing Utility

```javascript
class RocketEventTester {
  constructor(apiKey, baseURL = 'https://api.rocketlearningrewards.com') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }
  
  async validateEvent(event) {
    const response = await fetch(`${this.baseURL}/v1/events/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });
    
    return response.json();
  }
  
  async sendTestEvent(event) {
    const validation = await this.validateEvent(event);
    if (!validation.valid) {
      throw new Error(`Invalid event: ${JSON.stringify(validation.errors)}`);
    }
    
    const response = await fetch(`${this.baseURL}/v1/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });
    
    return response.json();
  }
  
  generateTestEvents(userId, count = 10) {
    const events = [];
    const eventTypes = ['lesson.completed', 'quiz.completed', 'assignment.submitted'];
    
    for (let i = 0; i < count; i++) {
      events.push({
        event: eventTypes[i % eventTypes.length],
        user_id: userId,
        timestamp: new Date().toISOString(),
        properties: {
          course_id: `course-${Math.floor(i / 3) + 1}`,
          lesson_id: `lesson-${i + 1}`,
          progress_pct: Math.floor(Math.random() * 100)
        }
      });
    }
    
    return events;
  }
}

// Usage
const tester = new RocketEventTester('your-api-key');
const testEvents = tester.generateTestEvents('test-user-123', 5);

for (const event of testEvents) {
  try {
    const result = await tester.sendTestEvent(event);
    console.log('Event sent successfully:', result);
  } catch (error) {
    console.error('Event failed:', error.message);
  }
}
```

### Debug Webhook Receiver

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Debug endpoint that logs all incoming webhooks
app.post('/debug/webhook', (req, res) => {
  console.log('=== Webhook Received ===');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('========================');
  
  // Always return success for debugging
  res.status(200).json({
    status: 'received',
    timestamp: new Date().toISOString(),
    event_id: req.body?.id || 'unknown'
  });
});

app.listen(3000, () => {
  console.log('Debug webhook receiver listening on port 3000');
});
```

## Performance Optimization

### Batch Processing

**Event Batching Strategy:**
```javascript
class EventBuffer {
  constructor(maxSize = 100, flushInterval = 5000) {
    this.events = [];
    this.maxSize = maxSize;
    this.flushInterval = flushInterval;
    this.timer = null;
    this.startTimer();
  }
  
  add(event) {
    this.events.push(event);
    
    if (this.events.length >= this.maxSize) {
      this.flush();
    }
  }
  
  async flush() {
    if (this.events.length === 0) return;
    
    const batch = this.events.splice(0);
    this.resetTimer();
    
    try {
      await this.sendBatch(batch);
    } catch (error) {
      console.error('Batch send failed:', error);
      // Implement retry logic or dead letter queue
    }
  }
  
  async sendBatch(events) {
    const response = await fetch('/api/events/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events })
    });
    
    if (!response.ok) {
      throw new Error(`Batch failed: ${response.status}`);
    }
    
    return response.json();
  }
  
  startTimer() {
    this.timer = setInterval(() => this.flush(), this.flushInterval);
  }
  
  resetTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.startTimer();
    }
  }
}

// Usage
const eventBuffer = new EventBuffer(50, 3000);
eventBuffer.add({ event: 'lesson.completed', user_id: 'user-123' });
```

## Error Handling Patterns

### Retry Logic with Exponential Backoff

```javascript
class RetryableRequest {
  constructor(maxRetries = 3, baseDelay = 1000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }
  
  async execute(requestFn, retryCount = 0) {
    try {
      return await requestFn();
    } catch (error) {
      if (retryCount >= this.maxRetries) {
        throw error;
      }
      
      if (this.shouldRetry(error)) {
        const delay = this.calculateDelay(retryCount);
        await this.sleep(delay);
        return this.execute(requestFn, retryCount + 1);
      }
      
      throw error;
    }
  }
  
  shouldRetry(error) {
    // Retry on network errors or 5xx responses
    return error.code === 'ECONNRESET' || 
           error.code === 'ETIMEDOUT' ||
           (error.response && error.response.status >= 500);
  }
  
  calculateDelay(retryCount) {
    return this.baseDelay * Math.pow(2, retryCount);
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const retryable = new RetryableRequest(3, 1000);

await retryable.execute(async () => {
  return await rocketClient.events.track({
    event: 'course.completed',
    user_id: 'user-123'
  });
});
```

## Integration Patterns

### Circuit Breaker Pattern

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

Ready to start developing? **[Choose your SDK →](#sdks--libraries)** or **[View API Reference →](api-reference/)**