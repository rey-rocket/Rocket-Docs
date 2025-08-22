# Troubleshooting Guide

Comprehensive troubleshooting guide for common issues with Rocket Learning Rewards, including diagnostic procedures, solutions, and prevention strategies.

## Quick Diagnostic Checklist

Before diving into specific issues, run through this quick diagnostic checklist:

### System Health Check

1. **Webhook Connectivity**
   ```bash
   curl -X POST https://your-rocket-domain/api/public/hook/test/event \
     -H "Authorization: Bearer your-token" \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

2. **API Accessibility**
   ```bash
   curl -X GET https://api.rocketlearningrewards.com/v1/health \
     -H "Authorization: Bearer your-api-key"
   ```

3. **Event Processing Status**
   - Check recent event logs in your admin dashboard
   - Verify point allocation is occurring
   - Confirm analytics data is being captured

## Common Issues & Solutions

### Webhook Integration Issues

#### Problem: No Events Arriving

**Symptoms:**
- No entries in webhook delivery logs
- Course completions not triggering point awards
- Event activity dashboard shows no recent events

**Diagnostic Steps:**

1. **Check Source System Configuration**
   ```bash
   # Test webhook endpoint accessibility
   curl -I https://your-rocket-domain/api/public/hook/moodle/event
   
   # Expected response: HTTP/1.1 405 Method Not Allowed (GET not allowed)
   # This confirms endpoint exists and is accessible
   ```

2. **Verify Authentication**
   ```bash
   # Test with correct token
   curl -X POST https://your-rocket-domain/api/public/hook/moodle/event \
     -H "Authorization: Bearer correct-token" \
     -H "Content-Type: application/json" \
     -d '{"test": "event"}'
   
   # Expected: 200 OK or 202 Accepted
   ```

3. **Check Network Connectivity**
   ```bash
   # From your LMS server
   nslookup your-rocket-domain
   ping your-rocket-domain
   curl -I https://your-rocket-domain/
   ```

**Solutions:**

| Issue | Solution |
|-------|----------|
| DNS resolution fails | Update DNS settings or use IP address |
| SSL certificate errors | Verify certificate validity, update if expired |
| Authentication failures | Regenerate and update bearer tokens |
| Network timeouts | Check firewall rules and network connectivity |
| Wrong endpoint URL | Verify webhook configuration in source system |

#### Problem: Events Triggering But Not Processing

**Symptoms:**
- Webhook delivery logs show successful sends (200/202 responses)
- Events appear in Rocket logs but no points awarded
- User completes activities but balance unchanged

**Diagnostic Procedures:**

1. **Validate Event Schema**
   ```javascript
   // Test event validation
   const testEvent = {
     "id": "12345",
     "eventname": "\\core\\event\\course_completed",
     "userid": "8774",
     "courseid": "987",
     "timecreated": Math.floor(Date.now() / 1000)
   };
   
   // Send to validation endpoint
   fetch('https://your-rocket-domain/api/validate/event', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer your-token',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(testEvent)
   });
   ```

2. **Check User Existence**
   - Verify user exists in Rocket system
   - Confirm user ID mapping between LMS and Rocket
   - Check user account status (active/suspended)

3. **Review Rule Configuration**
   - Confirm point allocation rules are active
   - Check rule conditions and filters
   - Verify event type matches configured rules

**Common Causes & Solutions:**

| Cause | Symptoms | Solution |
|-------|----------|-----------|
| User ID mismatch | Events received but no points awarded | Update user ID mapping in integration |
| Duplicate events | Points awarded once then stopped | Check event deduplication logic |
| Rule conditions not met | Selective events not processing | Review and adjust rule filters |
| Daily/weekly limits reached | Points stopped after certain amount | Check and adjust rate limits |
| Invalid event format | Events rejected during processing | Validate payload against required schema |

### Point Allocation Issues

#### Problem: Points Not Being Awarded

**Symptoms:**
- Events successfully processed
- User activities completed
- Point balance remains unchanged

**Step-by-Step Diagnosis:**

1. **Check Event Processing Logs**
   ```bash
   # View recent event processing logs
   curl -X GET "https://api.rocketlearningrewards.com/v1/events?user_id=USER_ID&limit=10" \
     -H "Authorization: Bearer your-api-key"
   ```

2. **Verify Rule Matching**
   ```json
   // Check rule configuration matches event type
   {
     "event": "course.completed",
     "rule_conditions": {
       "event_name": "\\core\\event\\course_completed",
       "course_filter": ["specific-course-id"],
       "user_status": "active"
     }
   }
   ```

3. **Check Rate Limits and Constraints**
   ```bash
   # Check user's daily point earning status
   curl -X GET "https://api.rocketlearningrewards.com/v1/users/USER_ID/limits" \
     -H "Authorization: Bearer your-api-key"
   ```

**Resolution Strategies:**

**Daily/Weekly Limits Exceeded:**
```javascript
// Check current usage against limits
const userLimits = await rocketAPI.users.getLimits(userId);
console.log(`Daily usage: ${userLimits.daily_usage}/${userLimits.daily_limit}`);

// Reset limits if needed (admin only)
await rocketAPI.admin.resetUserLimits(userId, 'daily');
```

**Rule Condition Mismatches:**
- Update rule filters to match actual event properties
- Add debugging to rule evaluation
- Test rules with sample events

**Duplicate Event Prevention:**
- Check event ID uniqueness
- Verify timestamp-based deduplication
- Review event processing windows

#### Problem: Incorrect Point Values

**Symptoms:**
- Points being awarded but wrong amounts
- Inconsistent point allocation across similar events
- Point values not matching configuration

**Diagnosis:**

1. **Review Rule Configuration**
   ```json
   {
     "rule_id": "course_completion",
     "conditions": {
       "event": "course.completed",
       "course_category": "certification"
     },
     "actions": {
       "award_points": 100,
       "bonus_multiplier": 1.5
     },
     "constraints": {
       "max_per_course": 1,
       "requires_min_score": 80
     }
   }
   ```

2. **Check Bonus Multipliers and Conditions**
   - Verify streak bonuses are calculating correctly
   - Check rank-based multipliers
   - Confirm conditional bonus logic

3. **Validate Point Calculation Logic**
   ```javascript
   // Test point calculation
   const event = {
     event: 'course.completed',
     user_id: 'user-123',
     properties: {
       course_id: 'course-456',
       score: 95,
       completion_time: 3600
     }
   };
   
   const pointCalculation = await rocketAPI.rules.calculatePoints(event);
   console.log(`Base points: ${pointCalculation.base}`);
   console.log(`Bonuses: ${pointCalculation.bonuses}`);
   console.log(`Total: ${pointCalculation.total}`);
   ```

### LMS Integration Specific Issues

#### Moodle Integration Problems

**Problem: Course Completion Events Not Firing**

**In some Moodle versions, course completion events are cron/task-driven:**

1. **Check Completion Settings**
   ```sql
   -- Check course completion criteria
   SELECT c.id, c.fullname, cc.id as criteria_id, cc.criteriatype 
   FROM mdl_course c
   LEFT JOIN mdl_course_completions cc ON c.id = cc.course
   WHERE c.id = YOUR_COURSE_ID;
   ```

2. **Verify Cron Tasks**
   ```bash
   # Check if completion cron tasks are running
   php admin/cli/cron.php --verbose
   
   # Or check specific task
   php admin/tool/task/cli/schedule_task.php --execute=\\core\\task\\completion_regular_task
   ```

3. **Test with Manual Trigger**
   ```php
   // Force completion check in Moodle
   $completion = new completion_completion(['userid' => $userid, 'course' => $courseid]);
   $completion->mark_complete();
   ```

**Problem: Event Trigger Plugin Not Working**

1. **Check Plugin Installation**
   ```bash
   # Verify plugin is installed and enabled
   SELECT * FROM mdl_config_plugins WHERE plugin = 'tool_trigger';
   ```

2. **Review Workflow Configuration**
   - Confirm workflow is active
   - Check event name matches exactly (case-sensitive)
   - Verify filters are not too restrictive

3. **Test Workflow Manually**
   ```php
   // Trigger test event in Moodle
   $event = \core\event\course_completed::create([
       'objectid' => $courseid,
       'userid' => $userid,
       'courseid' => $courseid,
       'context' => context_course::instance($courseid)
   ]);
   $event->trigger();
   ```

#### LearnWorlds Integration Issues

**Problem: Webhook Signature Verification Failing**

1. **Check HMAC Calculation**
   ```javascript
   const crypto = require('crypto');
   
   function calculateLearnWorldsSignature(payload, secret) {
     return 'sha256=' + crypto
       .createHmac('sha256', secret)
       .update(payload, 'utf8')
       .digest('hex');
   }
   
   // Verify signature matches
   const calculatedSig = calculateLearnWorldsSignature(rawBody, webhookSecret);
   const receivedSig = req.headers['x-signature'];
   console.log(`Calculated: ${calculatedSig}`);
   console.log(`Received: ${receivedSig}`);
   ```

2. **Check Raw Body Handling**
   ```javascript
   // Ensure raw body is preserved for signature verification
   app.use('/webhooks/learnworlds', express.raw({type: 'application/json'}));
   
   app.post('/webhooks/learnworlds', (req, res) => {
     // Use raw body for signature verification
     const signature = req.headers['x-signature'];
     if (!verifySignature(req.body, signature, secret)) {
       return res.status(401).send('Invalid signature');
     }
     
     // Parse JSON after verification
     const event = JSON.parse(req.body);
     // Process event...
   });
   ```

### User Account Issues

#### Problem: User Not Found or Access Denied

**Symptoms:**
- Events processed but attributed to unknown user
- User cannot access rewards interface
- Point balance not visible to user

**Investigation Steps:**

1. **Verify User Existence**
   ```bash
   curl -X GET "https://api.rocketlearningrewards.com/v1/users/search?email=user@example.com" \
     -H "Authorization: Bearer your-api-key"
   ```

2. **Check User ID Mapping**
   ```json
   {
     "user_id": "rocket-user-123",
     "external_ids": {
       "moodle": "moodle-8774",
       "learnworlds": "lw-user-456"
     },
     "email": "user@example.com",
     "status": "active"
   }
   ```

3. **Validate Account Status**
   - Check if user account is suspended
   - Verify organization membership
   - Confirm required permissions are granted

**Solutions:**

| Issue | Resolution |
|-------|------------|
| User doesn't exist | Create user account via API or CSV import |
| ID mapping incorrect | Update external ID mapping |
| Account suspended | Reactivate account with proper justification |
| Permission issues | Update user role and organization membership |

### Analytics and Reporting Issues

#### Problem: Mixpanel Data Not Appearing

**Symptoms:**
- Events processing in Rocket but not visible in Mixpanel
- Analytics dashboard showing no data
- Mixpanel Live View not receiving events

**Diagnostic Steps:**

1. **Check Mixpanel Configuration**
   ```javascript
   // Test Mixpanel connection
   const mixpanel = require('mixpanel').init('your-project-token');
   
   mixpanel.track('test_event', {
     distinct_id: 'test-user',
     time: Math.floor(Date.now() / 1000)
   });
   
   // Check if test event appears in Mixpanel Live View
   ```

2. **Verify Event Schema**
   ```json
   {
     "event": "course.completed",
     "properties": {
       "time": 1692614400,
       "distinct_id": "user-123",
       "course_id": "course-456",
       "source": "moodle",
       "$insert_id": "unique-event-id-for-dedup"
     }
   }
   ```

3. **Check Property Naming and Types**
   - Ensure `distinct_id` and `time` properties are present
   - Verify timestamp is in seconds (not milliseconds)
   - Check for reserved property name conflicts

**Common Issues and Fixes:**

| Problem | Symptoms | Solution |
|---------|----------|----------|
| Wrong project token | No events in any project | Verify and update project token |
| Missing distinct_id | Events not attributable to users | Add distinct_id to all events |
| Timestamp issues | Events appear at wrong times | Convert timestamp to seconds |
| Property type errors | Events rejected | Ensure properties match expected types |
| Rate limiting | Some events missing | Implement retry logic with exponential backoff |

#### Problem: Incorrect Timezone in Reports

**Google Sheets Timestamp Conversion:**
```javascript
// Convert Unix timestamp to Google Sheets date
function convertTimestamp(unixTimestamp) {
  return new Date(unixTimestamp * 1000);
}

// Apply timezone offset for South African Standard Time (SAST)
function applyTimezone(date) {
  return new Date(date.getTime() + (2 * 60 * 60 * 1000)); // +2 hours
}
```

**Apps Script for Timezone Handling:**
```javascript
function convertTimestampWithTimezone(timestamp) {
  const date = new Date(timestamp * 1000);
  return Utilities.formatDate(date, 'Africa/Johannesburg', 'yyyy-MM-dd HH:mm:ss');
}
```

### Performance Issues

#### Problem: Slow Webhook Response Times

**Symptoms:**
- LMS webhook timeouts
- Delayed event processing
- High latency in point allocation

**Performance Optimization:**

1. **Implement Async Processing**
   ```javascript
   app.post('/webhook', async (req, res) => {
     // Respond immediately
     res.status(202).send('Accepted');
     
     // Process asynchronously
     setImmediate(async () => {
       try {
         await processEvent(req.body);
       } catch (error) {
         console.error('Async processing failed:', error);
         // Handle error (retry queue, dead letter, etc.)
       }
     });
   });
   ```

2. **Use Event Queues**
   ```javascript
   const Queue = require('bull');
   const eventQueue = new Queue('event processing');
   
   app.post('/webhook', (req, res) => {
     eventQueue.add('process', req.body);
     res.status(202).send('Queued');
   });
   
   eventQueue.process('process', async (job) => {
     await processEvent(job.data);
   });
   ```

3. **Optimize Database Queries**
   ```sql
   -- Add indexes for common queries
   CREATE INDEX idx_user_events ON events (user_id, created_at);
   CREATE INDEX idx_event_type ON events (event_type);
   CREATE INDEX idx_processing_status ON events (status, created_at);
   ```

### CSV Import Issues

#### Problem: Import Validation Failures

**Common Validation Errors:**

1. **Email Format Issues**
   ```javascript
   function validateEmail(email) {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
   }
   
   // Check for common issues
   const issues = [];
   if (email.includes(' ')) issues.push('Contains spaces');
   if (email.split('@').length !== 2) issues.push('Multiple or missing @ symbols');
   if (email.toLowerCase() !== email) issues.push('Not lowercase');
   ```

2. **Name Validation**
   ```javascript
   function validateName(name) {
     if (!name || name.trim().length === 0) return 'Empty name';
     if (name === name.toUpperCase()) return 'All caps';
     if (/\d/.test(name)) return 'Contains numbers';
     if (/[^\w\s\-\']/.test(name)) return 'Contains special characters';
     return null;
   }
   ```

3. **User ID Format Issues**
   ```javascript
   function validateUserId(userId) {
     if (typeof userId !== 'string') return 'Not a string';
     if (userId.startsWith('0')) return 'Leading zeros detected';
     if (userId.trim() !== userId) return 'Contains whitespace';
     return null;
   }
   ```

4. **Timestamp Validation**
   ```javascript
   function validateTimestamp(timestamp) {
     const ts = parseInt(timestamp);
     if (isNaN(ts)) return 'Not a number';
     if (ts < 946684800) return 'Before year 2000'; // Basic sanity check
     if (ts > Date.now() / 1000) return 'In the future';
     return null;
   }
   ```

**CSV Processing Script with Validation:**
```python
import csv
import re
from datetime import datetime

def validate_csv_row(row):
    errors = []
    
    # Email validation
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', row.get('email', '')):
        errors.append('Invalid email format')
    
    # Name validation
    name = row.get('name', '').strip()
    if not name:
        errors.append('Empty name')
    elif name.isupper():
        errors.append('Name is all caps')
    elif any(char.isdigit() for char in name):
        errors.append('Name contains numbers')
    
    # User ID validation
    user_id = row.get('user_id', '')
    if not user_id:
        errors.append('Missing user ID')
    elif user_id.startswith('0'):
        errors.append('User ID has leading zeros')
    
    # Timestamp validation
    try:
        ts = int(row.get('timestamp', 0))
        if ts < 946684800:  # Year 2000
            errors.append('Timestamp too old')
        elif ts > int(datetime.now().timestamp()):
            errors.append('Timestamp in future')
    except ValueError:
        errors.append('Invalid timestamp format')
    
    return errors

# Process CSV with validation
def process_csv_with_validation(filename):
    valid_rows = []
    errors = []
    
    with open(filename, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for i, row in enumerate(reader, 1):
            row_errors = validate_csv_row(row)
            if row_errors:
                errors.append(f"Row {i}: {', '.join(row_errors)}")
            else:
                valid_rows.append(row)
    
    return valid_rows, errors
```

## Monitoring and Alerting

### Health Check Endpoints

**System Health Monitoring:**
```bash
# Check overall system health
curl -X GET https://api.rocketlearningrewards.com/health

# Check webhook endpoint health
curl -X GET https://your-rocket-domain/health/webhooks

# Check database connectivity
curl -X GET https://api.rocketlearningrewards.com/health/database
```

### Setting Up Alerts

**Critical Alert Conditions:**
- Webhook success rate < 95% over 5 minutes
- Event processing latency > 30 seconds
- Point allocation failures > 1% of events
- User authentication failures > 5% of requests

**Monitoring Script Example:**
```javascript
const alerting = {
  checkWebhookHealth: async () => {
    const response = await fetch('/api/webhooks/health');
    const health = await response.json();
    
    if (health.success_rate < 0.95) {
      await sendAlert('CRITICAL', 'Webhook success rate below 95%');
    }
  },
  
  checkEventProcessing: async () => {
    const metrics = await getEventProcessingMetrics();
    
    if (metrics.avg_latency > 30000) { // 30 seconds
      await sendAlert('WARNING', 'High event processing latency');
    }
  }
};
```

## When to Contact Support

### Tier 1 Issues (Self-Serviceable)
- Configuration changes
- Rule updates
- CSV import formatting
- Basic troubleshooting using this guide

### Tier 2 Issues (Contact Support)
- Integration setup assistance
- Complex webhook debugging
- Performance optimization
- Custom rule configuration

### Tier 3 Issues (Escalate to Engineering)
- Platform bugs or outages
- Data corruption or loss
- Security incidents
- Architecture or scaling concerns

### Support Contact Information

**Technical Support:**
- Email: support@rocketlearningrewards.com
- Response Time: 24 hours for standard, 2 hours for critical
- Include: Error logs, webhook payloads, and steps to reproduce

**Emergency Support:**
- For production outages only
- Include: Impact assessment and business justification

Ready to resolve your issue? **[Start with the diagnostic checklist ’](#quick-diagnostic-checklist)** or **[Contact Support ’](contact/)**