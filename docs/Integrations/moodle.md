# Moodle Integration Guide

Comprehensive guide for integrating Rocket Learning Rewards with Moodle LMS using the Event Trigger plugin for real-time activity tracking and point allocation.

## Overview

The Moodle integration uses the **Event Trigger plugin** (tool_trigger) developed by Catalyst IT to capture learning activities and send them to Rocket Learning Rewards via webhooks. This approach provides real-time event processing with comprehensive activity tracking across 67 different event types.

## Integration Architecture

```
[Student Activity] ’ [Moodle Core Events] ’ [Event Trigger Plugin] ’ [Rocket Webhooks] ’ [Points & Rewards]
```

### Key Benefits

:material-flash: **Real-time Processing** - Events processed immediately as they occur
:material-shield-check: **Comprehensive Tracking** - 67 trackable activity types
:material-cog: **Configurable Rules** - Flexible point allocation and filtering
:material-security: **Secure Communication** - Encrypted webhook delivery with authentication

## Prerequisites

### Technical Requirements

**Moodle Version Compatibility:**
- Moodle 3.11 (LTS)
- Moodle 4.0
- Moodle 4.1 
- Moodle 4.4
- Moodle 4.5+

**Administrative Access Required:**
- Full Moodle administrator privileges
- Plugin installation permissions (via admin panel or CLI)
- Network configuration access for webhook endpoints
- SSL certificate management capability

**Infrastructure Requirements:**
- Stable internet connectivity for webhook delivery
- HTTPS endpoint capability for Rocket webhook receiver
- Firewall configuration for outbound HTTP/HTTPS requests
- IP allowlisting capability (recommended)

## Installation Process

### Step 1: Install Event Trigger Plugin

**Method A: Admin Panel Installation**

1. **Download Plugin**
   - Visit the [Moodle Plugin Directory](https://moodle.org/plugins/tool_trigger)
   - Download the latest version compatible with your Moodle release
   - Verify plugin integrity and digital signatures

2. **Install via Admin Interface**
   - Navigate to **Site Administration ’ Plugins ’ Install plugins**
   - Upload the plugin ZIP file
   - Follow the installation wizard prompts
   - Complete any required database updates

**Method B: CLI Installation (Advanced)**

```bash
# Extract plugin to correct directory
cd /path/to/moodle
unzip tool_trigger.zip -d admin/tool/

# Run CLI upgrade to install
sudo -u www-data php admin/cli/upgrade.php --non-interactive
```

**Method C: Git Installation (Development)**

```bash
cd /path/to/moodle/admin/tool
git clone https://github.com/catalyst/moodle-tool_trigger.git trigger
cd /path/to/moodle
sudo -u www-data php admin/cli/upgrade.php
```

### Step 2: Verify Installation

1. Navigate to **Site Administration ’ Plugins ’ Admin tools**
2. Confirm **Event Trigger** appears in the list
3. Check plugin version and compatibility status
4. Review any installation warnings or recommendations

## Configuration Workflow

### Step 3: Create Webhook Workflows

**Access Event Trigger Configuration:**
1. Navigate to **Site Administration ’ Plugins ’ Admin tools ’ Event Trigger**
2. Click **"Add new workflow"** to create your first integration

### Step 4: Configure Course Completion Workflow

**Basic Workflow Setup:**

**Trigger Configuration:**
- **Event:** `\core\event\course_completed`
- **Description:** "Course completion events for Rocket Learning Rewards"
- **Active:**  Enabled

**Filter Configuration (Optional):**
```json
{
  "courseid": ["123", "456", "789"],
  "category": ["learning-programs"]
}
```

**HTTP POST Action Configuration:**
- **URL:** `https://your-rocket-domain/api/public/hook/moodle/event`
- **Method:** POST
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_SECURE_TOKEN_HERE
  ```

**Body Template:**
```json
{
  "id": "{id}",
  "eventname": "{eventname}",
  "component": "{component}",
  "action": "{action}",
  "target": "{target}",
  "objectid": "{objectid}",
  "userid": "{userid}",
  "courseid": "{courseid}",
  "timecreated": "{timecreated}",
  "other": "{other}"
}
```

### Step 5: Additional Event Workflows

**Common Events to Track:**

**User Login Tracking:**
- **Event:** `\core\event\user_loggedin`
- **Points:** 5 points (daily cap)
- **Purpose:** Encourage regular platform engagement

**Assignment Submission:**
- **Event:** `\mod_assign\event\assessable_submitted`
- **Points:** 15 points per submission
- **Filters:** Limit to specific courses or assignment types

**Quiz Completion:**
- **Event:** `\mod_quiz\event\attempt_submitted`
- **Points:** 10-25 points based on quiz complexity
- **Constraints:** One-time per quiz per user

**Forum Participation:**
- **Event:** `\mod_forum\event\post_created`
- **Points:** 5 points per quality post
- **Rate Limits:** Maximum 3 posts per day counted

**Resource Access:**
- **Event:** `\core\event\course_module_viewed`
- **Points:** 2 points per unique resource
- **Deduplication:** Same resource viewed multiple times = 1 point

## Advanced Configuration

### Custom Event Mapping

**Activity Module Events:**

| Moodle Event | Rocket Event | Default Points | Constraints |
|--------------|--------------|----------------|-------------|
| `course_completed` | `course.completed` | 50 | Once per course |
| `course_module_completion_updated` | `lesson.completed` | 10 | Once per module |
| `user_loggedin` | `user.logged_in` | 5 | Daily cap |
| `assessable_submitted` | `assignment.submitted` | 15 | Per submission |
| `attempt_submitted` | `quiz.completed` | 20 | Per attempt |
| `post_created` | `forum.posted` | 5 | 3 per day max |

### Event Filtering Strategies

**Course-Specific Tracking:**
```json
{
  "courseid": ["101", "102", "103"],
  "contextlevel": 50
}
```

**Category-Based Filtering:**
```json
{
  "category": "professional-development",
  "visible": 1
}
```

**User Role Filtering:**
```json
{
  "roleid": [5],  // Student role only
  "suspended": 0
}
```

### Security Configuration

**Authentication Setup:**

1. **Generate Secure Token**
   ```bash
   # Generate a secure random token
   openssl rand -hex 32
   ```

2. **Configure Webhook Authentication**
   - Add `Authorization: Bearer <token>` header to all workflows
   - Store token securely in Moodle configuration
   - Rotate tokens periodically (recommended: quarterly)

**IP Allowlisting (Recommended):**
- Configure Rocket to accept webhooks only from your Moodle server IP
- Use CIDR notation for server clusters: `192.168.1.0/24`
- Monitor webhook delivery logs for unauthorized attempts

## Testing & Validation

### Step 6: Test Event Delivery

**Manual Testing Process:**

1. **Create Test Course**
   - Set up a dedicated test course for validation
   - Enroll test users with appropriate permissions
   - Configure course completion criteria

2. **Trigger Test Events**
   - Complete course modules as test user
   - Submit assignments and quizzes
   - Participate in forum discussions
   - Monitor Event Trigger logs for successful delivery

3. **Verify Rocket Reception**
   - Check Rocket webhook logs for received events
   - Validate event schema matches expectations
   - Confirm point allocation occurs correctly

**Event Trigger Debugging:**

1. **Access Workflow Logs**
   - Navigate to **Site Administration ’ Event Trigger ’ Logs**
   - Review recent workflow executions
   - Check for HTTP response codes and error messages

2. **Common Issues:**
   - **404 Not Found:** Verify Rocket webhook endpoint URL
   - **401 Unauthorized:** Check bearer token configuration
   - **500 Server Error:** Review payload format and required fields
   - **Timeout:** Verify network connectivity and endpoint availability

## Monitoring & Maintenance

### Operational Monitoring

**Daily Health Checks:**
- Review Event Trigger execution logs
- Monitor webhook delivery success rates
- Check for unusual event volume patterns
- Validate point allocation accuracy

**Weekly Maintenance:**
- Review and archive old logs
- Update event filters based on new courses
- Monitor storage usage for event data
- Test backup and recovery procedures

### Performance Optimization

**Event Processing Efficiency:**
- Use specific event filters to reduce unnecessary processing
- Batch similar events where possible
- Implement proper indexing on event tables
- Monitor Moodle cron job performance

**Network Optimization:**
- Use persistent HTTP connections where supported
- Implement compression for large payloads
- Configure appropriate timeout values
- Monitor bandwidth usage patterns

## Advanced Features

### Custom Event Creation

**Creating Custom Events:**
```php
// In your custom Moodle plugin
$event = \your_plugin\event\custom_achievement_earned::create(array(
    'objectid' => $achievement->id,
    'userid' => $user->id,
    'courseid' => $course->id,
    'other' => array(
        'achievement_type' => 'mastery_badge',
        'points_earned' => 25
    )
));
$event->trigger();
```

### Batch Processing

**Historical Event Import:**
- Export historical completion data from Moodle
- Format as CSV with required fields
- Import via Rocket bulk import API
- Reconcile with existing user points

### Integration with Moodle Badges

**Badge-to-Points Mapping:**
```json
{
  "trigger": "badge_awarded",
  "conditions": {
    "badge_id": "course_master_badge"
  },
  "actions": {
    "award_points": 100,
    "issue_rocket_badge": "course_completion_expert"
  }
}
```

## Troubleshooting Guide

### Common Issues & Solutions

**Problem: Events not being triggered**

*Symptoms:*
- No entries in Event Trigger logs
- Course completions not generating webhooks
- Workflow appears inactive

*Solutions:*
1. Check workflow status is "Active"
2. Verify event name matches exactly (case-sensitive)
3. Confirm course completion criteria are met
4. Review user permissions and enrollment status

**Problem: Webhook delivery failures**

*Symptoms:*
- HTTP error codes in Event Trigger logs
- Events triggered but not received by Rocket
- Intermittent delivery issues

*Solutions:*
1. Verify webhook endpoint URL accessibility
2. Check SSL certificate validity
3. Confirm bearer token is correct
4. Review firewall and network configurations

**Problem: Duplicate events**

*Symptoms:*
- Same event triggered multiple times
- Points awarded incorrectly
- Event ID collisions

*Solutions:*
1. Implement event deduplication in workflow filters
2. Use unique event identifiers
3. Configure appropriate rate limiting
4. Review event trigger conditions

### Event Validation

**Required Event Fields:**
- `id` - Unique Moodle event identifier
- `eventname` - Full event class name
- `userid` - Moodle user ID
- `courseid` - Moodle course ID (if applicable)
- `timecreated` - Unix timestamp

**Event Schema Validation:**
```php
// Validate required fields before webhook delivery
function validate_event_data($event_data) {
    $required = ['id', 'eventname', 'userid', 'timecreated'];
    foreach ($required as $field) {
        if (!isset($event_data[$field])) {
            throw new Exception("Missing required field: {$field}");
        }
    }
    return true;
}
```

## Best Practices

### Configuration Management

1. **Version Control** - Store workflow configurations in version control
2. **Environment Separation** - Use separate webhooks for development/production
3. **Documentation** - Document all custom event mappings and filters
4. **Testing** - Test all workflows in staging before production deployment

### Security Guidelines

1. **Token Management** - Rotate authentication tokens regularly
2. **Access Control** - Use least-privilege principles for plugin permissions
3. **Monitoring** - Implement alerting for failed webhook deliveries
4. **Audit Logging** - Maintain comprehensive logs for compliance

### Performance Considerations

1. **Event Filtering** - Use precise filters to minimize unnecessary processing
2. **Rate Limiting** - Implement appropriate rate limits to prevent abuse
3. **Monitoring** - Track webhook performance and response times
4. **Scaling** - Plan for increased event volume as usage grows

## Support Resources

### Documentation
- **Event Trigger Plugin:** [Official Documentation](https://github.com/catalyst/moodle-tool_trigger)
- **Moodle Events:** [Core Events Reference](https://docs.moodle.org/dev/Event_2)
- **Rocket API:** [Webhook Documentation](../reference/webhooks/)

### Community Support
- **Moodle Forums:** Event Trigger plugin discussions
- **GitHub Issues:** Plugin-specific technical issues
- **Rocket Support:** Integration assistance and troubleshooting

### Professional Services
- **Implementation Support** - Dedicated setup assistance
- **Custom Development** - Specialized event handling requirements
- **Training Services** - Staff education and best practices workshops

Ready to integrate Moodle? **[Start Installation ’](#installation-process)** or **[Contact Support ’](../support/contact/)**