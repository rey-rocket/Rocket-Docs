# System Requirements

Before implementing Rocket Learning Rewards, ensure your environment meets these requirements for optimal performance.

## LMS Compatibility

### Supported Platforms

Rocket integrates with 15+ learning management systems:

- **Moodle** (3.0+)
- **Canvas** (2018+)
- **Blackboard** (9.1+)
- **LearnWorlds** (All versions)
- **Schoology** (2019+)
- **Brightspace/D2L** (10.5+)
- **Google Classroom** (All versions)
- **Microsoft Teams for Education** (2020+)

[View complete integration guide →](../integrations/index.md)

## Technical Requirements

### Minimum System Requirements

- **Internet Connection**: Stable broadband (10+ Mbps recommended)
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Storage**: 1GB available space for data sync
- **Memory**: 4GB RAM minimum, 8GB recommended

### Administrator Access Required

- LMS administrator permissions
- Ability to install LMS plugins/add-ons (if applicable)
- Access to student/user data for CSV export
- SMTP settings for email notifications (optional)

## Data Requirements

### Student Information

For successful implementation, you'll need:

- Student roster with unique IDs
- Email addresses (for reward delivery)
- Course enrollment data
- Grade/progress tracking data

### File Formats

- **CSV imports**: UTF-8 encoded, specific column headers
- **Grade sync**: Standard gradebook export formats
- **User data**: Compatible with LMS user export formats

[Download CSV template →](../support/downloads.md)

## Security & Compliance

### Data Protection

- **GDPR Compliant**: Full data protection compliance
- **FERPA Compliant**: Educational privacy standards
- **SOC 2 Type II**: Security framework certification
- **SSL/TLS**: End-to-end encryption for all data

### Privacy Requirements

- Student consent for reward delivery (where required)
- Data retention policy agreement
- Regional compliance verification

## Network Configuration

### Firewall Settings

Ensure these domains are whitelisted:

- `*.rocketeducationrewards.com`
- `api.rocket-rewards.com`
- `cdn.rocket-assets.com`

### Port Requirements

- **HTTPS**: Port 443 (outbound)
- **API Calls**: Standard HTTPS traffic
- **Webhooks**: Port 443 (inbound, optional)

## Getting Help

Having trouble with requirements? Our team can help:

- **Technical Assessment**: Free compatibility check
- **Implementation Support**: Dedicated onboarding specialist
- **Custom Integration**: Enterprise-level customization

[Contact Support →](../support/contact.md) | [Schedule Assessment](../support/contact.md)

---

**Next Step**: Once requirements are confirmed, proceed to [First Steps](first-steps.md) for initial setup.