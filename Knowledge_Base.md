# Rocket Education Rewards — Master Documentation

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [User Guides](#user-guides)
- [Administrator Guide](#administrator-guide)
- [Technical Integration](#technical-integration)
- [Analytics](#analytics)
- [Financial Management](#financial-management)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)
- [Appendices](#appendices)

---

## Overview

### What is Rocket Education Rewards?

Rocket is an educational rewards system designed to incentivise positive student engagement in learning management systems (LMS). The platform provides points-based rewards for academic activities and allows students to redeem points for real-world rewards and discounts.

### Key Features

- **Points System:** Students earn points for completing academic activities.
- **Streak Tracking:** Consecutive weeks of achievement unlock higher ranks.
- **Rank System:** Three tiers (Explorer, Pilot, Commander) with increasing benefits.
- **Rewards Marketplace:** Integration with Tillo for gift cards and discounts.
- **Rocket Launch Game:** Gamified lottery system for prize entries.
- **Multi-tenancy:** Support for multiple educational institutions.
- **LMS Integration:** Works with industry-standard LMSs like Moodle, OpenLMS, and other platforms.

### Target Users

- **Students:** Primary users earning and redeeming points.
- **Educators:** Monitor student engagement and progress through analytics dashboards.
- **Administrators:** Manage organisation settings and financial controls.
- **Institutions:** Universities, colleges, and educational organisations.

### Why Choose Rocket?

Academic foundations.

### First Steps

We follow a few simple steps to activate your reward campaign for your specific learning platform.

#### Prerequisites

Before launching, ensure these steps are complete.

#### Setup Checklist

- Your LMS or platform integration is up and running.
- Student accounts have been created in Rocket.
- Tillo integration active with reward catalogue.
- Organisation float funded.
- Point allocation values configured.

#### Launch Process

**Step 1: Configure Point Values**

Points are automatically awarded based on engagement with learning activities. Example values:

_To modify point values:_ Contact Rocket support.

**Step 2: Import Students**

Student profiles are created inside Rocket and mapped to your learning platform.

**Step 3: Fund Organisation Float**

**Financial Setup:**

- Contact Rocket team to add funds to organisation float.
- Conversion rate: 100 points = 1 currency unit.
- Set daily/weekly spending limits per student.
- Configure stop-loss limits for fraud prevention.

**Step 4: Activate Your Learning Platform Integration**

**Webhook Configuration:**

- Install Event Trigger plugin in Moodle.
- Import JSON workflow files (provided by Rocket team).
- Configure webhook endpoints for your environment.
- Test with sample activities to verify point awards.

#### Monitoring Your Program Through Analytics Dashboards

**Key Metrics to Track**

**Student Engagement:**

- Weekly active users
- Points earned per student
- Activity completion rates
- Streak maintenance rates

**Financial Performance:**

- Total points awarded
- Redemption rates
- Budget utilisation
- Cost per engaged student

**Analytics Access**

Monitor through:

- **Rocket Dashboard:** Mixpanel set up for your organisation.
- **Monthly Reports:** Automated financial reconciliation.
- **Google Sheets:** Exported data available for custom analysis.

#### Common Issues and Solutions

**Points Not Awarded**

- Verify student exists in Rocket system.
- Check Moodle ID mapping is correct.
- Confirm daily point limits not exceeded.
- Review webhook delivery logs.

**Low Student Engagement**

- Increase point values for key activities.
- Add more trackable activity types.
- Improve communication about available rewards.
- Consider rank-based bonus multipliers.

**Budget Management**

- Set appropriate daily/weekly limits.
- Monitor redemption patterns.
- Adjust point values if spending too high.
- Use stop-loss limits to prevent overspend.

#### Next Steps

**Week 1: Monitor Launch**

- Track initial student registrations.
- Verify points are being awarded correctly.
- Address any technical issues quickly.

**Week 2: Optimise**

- Analyse which activities drive most engagement.
- Adjust point values based on participation data.
- Gather student feedback on reward selection.

**Week 3: Scale**

- Expand to additional courses if successful.
- Add more reward categories.
- Plan advanced features like leaderboards.

### Case Studies

- **Universities:**  
- **Corporate Training:**  
- **Schools:**  

---

## System Architecture

### Technical Stack

- **Frontend:** React with Tailwind CSS
- **Backend:** Node.js with Seneca microservices
- **Database:** 
- **Cloud Platform:** AWS (Lambda, S3, CloudFront)
- **Authentication:** Email-based with password reset functionality
- **Payment Processing:** Tillo integration for gift cards
- **Analytics:** Mixpanel for event tracking

### Key Integrations

- **Tillo:** Reward fulfilment and gift card management
- **Moodle/OpenLMS:** Activity tracking via Event Trigger plugin
- **HeyForm:** Survey integration for additional points
- **AWS SES:** Email notifications and password resets
- **Mixpanel:** Analytics and user behaviour tracking

---

## User Guides

### Getting Started

#### Student Account Setup

**Receiving Your Account**

- Students receive a one-time setup email.
- Click the link to set your password.
- Complete the orientation process.

**Orientation Process**

- Welcome screen introduction
- Study goals selection
- Time commitment preferences
- Rank system explanation
- First activity completion

#### Understanding the Points System

**Example of metrics that earn points**

**Weekly Goals**

- Students set weekly point targets during orientation.
- Achieving weekly goals contributes to streak maintenance.
- Missed weeks reset the streak counter.

#### Rank System

- **Explorer (0–3 week streak)**
  - Basic point earning rates
  - Access to standard surveys
  - Limited discount selection
- **Pilot (4–6 week streak)**
  - Increased point multipliers
  - Additional survey opportunities
  - Enhanced discount rates
  - Progress tracking features
- **Commander (7+ week streak)**
  - Maximum point earning potential
  - Exclusive high-value discounts
  - Priority customer support
  - Advanced analytics dashboard

### Using the App

#### Home Screen Features

- **Points Balance:** Current available points with gauge visualisation
- **Weekly Progress:** Points earned toward weekly goal
- **Rank Status:** Current rank with weeks to next promotion
- **Rocket Launches:** Available lottery entries
- **Quick Actions:** Access to activities and rewards

#### Earning Points

**Learning Activities**

- Points automatically awarded for Moodle activities.
- Real-time updates when activities are completed.
- Activity history visible in **Progress** tab.

**Surveys**

- Access surveys through **My Rocket Activities**.
- Complete surveys within the app (embedded).
- 100 points per survey, weekly limit applies.

**Weekly Challenges**

- Special point-earning opportunities.
- Bonus multipliers for consistent engagement.
- Community leaderboards and rankings.

#### Redeeming Rewards

**Browse Rewards Center**

- Filter by category and point value.
- View available gift cards and discounts.
- Check minimum point requirements.

**Redemption Process**

1. Select desired reward.
2. Confirm redemption (points deducted immediately).
3. Receive Tillo redemption link.
4. Follow link to claim actual gift card.

**Rank-Based Discounts**

- Access discounts based on current rank.
- Higher ranks unlock better discount rates.
- Discount percentage applied at redemption.

#### Rocket Launch Game

**Earning Entries**

- Maintain weekly streaks to earn entries.
- Each successful week = 1 entry.
- Entries accumulate over time.

**Playing the Game**

- Access through **Progress** screen.
- Interactive space-themed lottery.
- Select planets to reveal prizes.
- Win entries to grand prize drawings.

### Profile Management in the Rocket App

#### Editing Profile Information

- **Personal Details:** Preferred name, profile photo
- **Study Goals:** Modify weekly point targets
- **Time Commitments:** Update available study hours
- **Privacy Settings:** Control information sharing

#### Viewing Progress

- **Streak History:** Track consecutive successful weeks
- **Activity Log:** Detailed breakdown of point-earning activities
- **Rank Progress:** Visualisation of advancement toward next rank
- **Prize Entries:** Total accumulated entries for drawings

---

## Administrator Guide

### Organisation Setup

#### Initial Configuration

**Organisation Registration**

- Contact Rocket team for new organisation setup.
- Provide organisation details and domain information.
- Configure initial financial float allocation.

**Domain Configuration**

- Set up custom subdomain (optional).
- Configure email authentication.
- Establish admin user accounts.

#### Student Onboarding

**Bulk User Import Process**

- **Prepare CSV File**  
  Required columns: `Name, Email, LMS_ID, Student_ID, Organisation`

- **Upload Process**
  - We create the user profiles in Rocket.
  - System processes file and creates accounts.
  - Automatic email invitations sent to students.
  - Error report generated for failed entries.

**Common CSV Errors**

- Invalid email formats
- Duplicate entries
- Missing required fields
- Special characters in names
- Incorrect Moodle ID format

#### User Management

**Account Administration**

- View all organisation users
- Reset individual user progress (demo purposes)
- Suspend or deactivate accounts
- Export user activity reports

**Permission Levels**

- **Super Admin:** Full organisation control
- **Standard Admin:** User management and reporting
- **Demo User:** Special testing privileges

### Financial Management

#### Float Management

**Adding Funds**

- Organisation maintains central float balance.
- Funds distributed to users as they earn points.
- Conversion rate: 100 points = 1 currency unit (configurable).

**Monitoring Usage**

- Daily, weekly, monthly reconciliation reports.
- Automatic alerts for low float balances.
- Transaction history and audit trails.

**Safety Measures**

- Daily spending limits per user.
- Weekly redemption caps.
- Stop-loss limits to prevent fraud.
- Automated suspension triggers.

#### Reporting

**Automated Reports**

- Monthly financial reconciliation
- Student engagement analytics
- Reward redemption patterns
- ROI analysis and insights

**Export Options**

- Excel/CSV downloads
- Google Sheets integration
- Real-time Mixpanel dashboards
- Custom report generation

### LMS Integration

#### Moodle Integration

**Install Event Trigger Plugin**

- Download from Moodle plugin directory.
- Install via admin panel or CLI (administrator access needed).
- Compatible with Moodle 3.11, 4.0, 4.1, 4.4, 4.5.

**Configure Webhooks**

- Rocket will set up the required webhooks.
- Rocket will map Moodle events to Rocket point allocations.

**Event Mapping**

- 67 trackable activities configured.
- Point values range from 10–200 based on activity importance.
- Frequency limits prevent gaming the system.

#### OpenLMS Integration

- Similar webhook configuration to Moodle.
- Enhanced security and monitoring.
- Simplified admin interface for non-technical users.

#### Thinkific Integration

_(Details to be provided.)_

#### LearnWorlds Integration

_(Details to be provided.)_

### Security and Compliance

#### Data Protection

- User data anonymisation for deletions
- GDPR compliance measures
- Secure financial transaction handling
- Regular security audits and updates

#### Access Control

- Role-based permissions
- Multi-factor authentication (planned)
- IP whitelisting for API access
- Session management and timeouts

---

## Technical Integration

### API Documentation

_(If needed.)_

### LMS Integration Details

#### Moodle Event Trigger Configuration

**Key Events Tracked**

- Course module completion
- Quiz attempts and completion
- Assignment submissions
- Discussion forum posts
- Resource views
- Grade updates

**Point Allocation Matrix**

_(Details to be provided.)_

### Third-Party Integrations

#### Tillo Integration

**Sandbox Environment**

- URL: https://sandbox.tillo.io/
- Used for testing and development
- Some brands may not function in sandbox

**Production Environment**

- Full brand catalog available
- Real money transactions
- IP whitelisting required
- Float balance monitoring

**Supported Operations**

- List available brands
- Create gift card orders
- Check redemption status
- Apply rank-based discounts

#### HeyForm Survey Integration

**Webhook Configuration**

- Real-time completion notifications
- Points awarded automatically
- Survey response data captured
- Weekly completion limits enforced

#### Mixpanel Analytics

**Event Tracking**

- User registration and onboarding
- Point earning activities
- Reward redemptions
- Engagement patterns
- Financial transactions

**Custom Metrics**

- Student retention rates
- Average points per user
- Redemption conversion rates
- Streak maintenance statistics

---

## Analytics

### Analytics Dashboard (Mixpanel)

_(Details to be provided.)_

### Financial Reporting (Mixpanel)

_(Details to be provided.)_

---

## Financial Management

### Float System Overview

The Rocket platform uses a multi-tenant float system where each organisation maintains its own reward budget while the system handles individual user point balances and transactions.

#### Float Architecture

**Organisation Float**

- Central pool of funds for each institution
- Managed by organisation administrators
- Tracks actual monetary value (not points)
- Supports multiple currencies (planned)

**User Point Balances**

- Display layer for students (points)
- Backed by organisation float allocation
- Conversion rate: 100 points = 1 currency unit
- Real-time balance updates

#### Transaction Types

**Credit Transactions**

- Organisation funding float
- Student earning points
- Promotional bonus allocations
- Returned/expired point recovery

**Debit Transactions**

- Student reward redemptions
- Administrative adjustments
- Fraud prevention reversals
- System maintenance fees

#### Financial Controls

**Daily Limits**

- Maximum points earnable per user per day
- Maximum redemptions per user per day
- Organisation spending caps
- Emergency stop-loss triggers

**Weekly Limits**

- Survey completion restrictions
- Activity type frequency caps
- Rank advancement requirements
- Float replenishment schedules

**Monthly Controls**

- Comprehensive reconciliation reports
- Budget variance analysis
- Fraud pattern detection
- Performance metric reviews

### Reporting and Reconciliation

#### Automated Reports

**Daily Reports**

- Transaction summaries
- Balance updates
- Error notifications
- Security alerts

**Weekly Reports**

- User engagement metrics
- Redemption patterns
- Float utilisation rates
- Performance trending

**Monthly Reports**

- Complete financial reconciliation
- ROI analysis and insights
- User retention statistics
- Platform usage analytics

#### Export and Integration

**Google Sheets Integration**

- Automatic report generation
- Real-time data synchronisation
- Custom dashboard creation
- Stakeholder access management

**Excel Export Options**

- Detailed transaction logs
- User activity reports
- Financial summaries
- Audit trail documentation

### Fraud Prevention

#### Detection Mechanisms

**Pattern Recognition**

- Unusual point accumulation rates
- Bulk redemption activities
- Cross-user correlation analysis
- Time-based anomaly detection

**Automated Responses**

- Account suspension triggers
- Transaction reversal capabilities
- Administrator notification systems
- Evidence collection and logging

#### Recovery Procedures

**Transaction Reversals**

- Point balance adjustments
- Float balance corrections
- User notification processes
- Audit trail maintenance

**Account Management**

- Temporary suspension capabilities
- Progressive penalty systems
- Appeal and review processes
- Permanent account closure options

---

## API Documentation

In case there is information we need to provide.

---

## Troubleshooting

### Common Issues

#### Login Problems

**Issue:** Users cannot log in to the app

**Symptoms:**

- Login page loads but authentication fails
- “Invalid credentials” error with correct details
- Page loads to 50% then stops

**Solutions:**

- Check network connectivity
- Verify user account is active
- Try password reset if credentials are uncertain
- Clear browser cache and cookies
- Contact admin if organisation account is suspended

**Technical Details:**

- Recent performance improvements resolved multi-attempt login issues
- Session timeout set to 24 hours
- Password requirements: minimum 8 characters

#### Points Not Awarded

**Issue:** Student completed activity but points not appearing

**Symptoms:**

- Moodle activity completed successfully
- Points balance unchanged after delay
- Activity not showing in progress log

**Troubleshooting Steps:**

**Check Activity Mapping**

- Verify activity type is configured for points
- Confirm daily/weekly limits not exceeded
- Review organisation-specific point allocations

**Validate User Account**

- Ensure user exists in Rocket system
- Verify Moodle ID mapping is correct
- Check account suspension status

**Technical Validation**

- Review webhook delivery logs
- Confirm Event Trigger plugin is active
- Validate network connectivity between systems

**Common Causes:**

- Moodle user ID mismatch
- Daily point earning limits reached
- Activity type not configured for points
- Network connectivity issues

#### Reward Redemption Issues

**Issue:** Cannot redeem rewards or redemption fails

**Symptoms:**

- Insufficient points error with adequate balance
- Redemption process starts but doesn’t complete
- Error messages during checkout

**Resolution Steps:**

**Check Eligibility**

- Verify sufficient point balance
- Confirm rank requirements met
- Review daily redemption limits

**Technical Issues**

- Clear browser cache
- Try different browser/device
- Check internet connectivity
- Contact support if Tillo integration fails

**Account Issues**

- Verify account in good standing
- Check for pending administrative actions
- Confirm organisation float has sufficient funds

#### Slow App Performance

**Issue:** App loading slowly or timing out

**Recent Improvements:**

- Login performance optimised
- Database query optimisation completed
- Cold start issues addressed

**Current Solutions:**

- Refresh the page
- Clear browser cache
- Use staging environment for demos
- Report persistent issues to development team

### Error Codes

#### Authentication Errors

- `AUTH_001`: Invalid credentials
- `AUTH_002`: Account suspended
- `AUTH_003`: Token expired
- `AUTH_004`: Organisation inactive

#### Points System Errors

- `POINTS_001`: Daily limit exceeded
- `POINTS_002`: Invalid activity type
- `POINTS_003`: User not found
- `POINTS_004`: Insufficient balance

#### Redemption Errors

- `REDEEM_001`: Insufficient points
- `REDEEM_002`: Rank requirement not met
- `REDEEM_003`: Reward unavailable
- `REDEEM_004`: Daily limit reached
- `REDEEM_005`: Tillo integration error

#### System Errors

- `SYS_001`: Database connectivity issue
- `SYS_002`: External service unavailable
- `SYS_003`: Configuration error
- `SYS_004`: Rate limit exceeded

### Support Contacts

#### Technical Support

- Development Team: support@rocketeducationrewards.com
- Platform Support: support@rocketeducationrewards.com
- Emergency Contact: [Emergency contact details]

#### Business Support

- Account Management: accounts@rocketeducationrewards.com
- Financial Queries: finance@rocketeducationrewards.com
- Integration Support: integrations@rocketeducationrewards.com

### Maintenance Windows

#### Scheduled Maintenance

- **Frequency:** Monthly, first Sunday 2:00–4:00 AM UTC
- **Notification:** 48 hours advance notice
- **Backup Access:** Previous version available during maintenance

#### Emergency Maintenance

- **Notification:** Via email and system status page
- **Duration:** Typically under 2 hours
- **Rollback Plan:** Available for critical issues

---

## Development Notes

### Project History

#### Phase 1: Initial Development (Oct 2024 – Apr 2025)

- Core platform development
- Basic LMS integration
- Tillo rewards integration
- Multi-tenancy implementation
- Financial float system

#### Phase 2: Enhancement Phase (May 2025 – Jun 2025)

- Advanced financial controls
- Improved reporting systems
- Enhanced security measures
- Performance optimisations
- Extended LMS support

#### Current Status

- MVP complete and deployed
- Production environment stable
- Multiple organisations onboarded
- Continuous improvement based on user feedback

### Technical Debt and Future Improvements

#### Known Limitations

- Single currency support (multi-currency planned)
- Basic fraud detection (ML enhancement planned)
- Limited customisation options (white-labelling in development)
- Manual organisation onboarding (automation planned)

#### Planned Enhancements

- **AI Integration:** Intelligent student support and analytics
- **Advanced Gamification:** Enhanced reward mechanisms
- **Mobile App:** Native iOS and Android applications
- **Advanced Analytics:** Predictive engagement modelling
- **API Expansion:** Comprehensive third-party integration support

### Testing Strategy

#### Test Environments

- **Unit Tests:** Jest framework, 85% code coverage
- **Integration Tests:** Automated API testing
- **Load Testing:** Checkly monitoring for performance
- **User Acceptance Testing:** Staged environment validation

#### Quality Assurance

- Code review requirements for all changes
- Automated security scanning
- Performance monitoring and alerting
- User feedback integration and tracking

---

## Appendices

### Appendix A: CSV Import Templates

#### Student Import Template

```csv
Name,Email,Moodle_ID,Student_ID,University
Alice Johnson,alice.johnson@university3.org,6965,S0001,university3
Bob Smith,bob.smith@university4.org,8973,S0002,university4
```

#### Common CSV Errors Template

```csv
Name,Email,Moodle_ID,Student_ID,University,Error_Reason
Invalid User,invalid-email,1234,S9999,university1,Invalid email format
,john.doe@university.edu,5678,S0002,university1,Missing name field
```

### Appendix B: Moodle Event Mapping

#### High-Value Activities (100+ points)

- Assignment submissions
- Quiz completions with high scores
- Course completions
- Milestone achievements

#### Medium-Value Activities (25–75 points)

- Discussion forum participation
- Resource downloads
- Video completions
- Survey participation

#### Low-Value Activities (10–25 points)

- Page views
- Login events
- Basic resource access
- Profile updates

### Appendix C: Tillo Integration Details

#### Supported Gift Card Brands

- Amazon
- Apple
- Google Play
- Starbucks
- Nike
- Adidas
- ASOS
- And 50+ additional brands

#### Brand Selection Criteria

- UK market recognition
- Student demographic appeal
- Reliable redemption processes
- Competitive discount rates

### Appendix D: Security Measures

#### Data Protection

- Encryption at rest and in transit
- PCI DSS compliance for financial data
- GDPR compliance for EU users
- Regular security audits and penetration testing

#### Access Controls

- Role-based permission system
- Multi-factor authentication (planned)
- IP whitelisting for administrative access
- Session management and timeout controls

---

**Document End**

This document serves as the master source for all Rocket Education Rewards documentation. Contributors should add information to relevant sections and mark changes with their initials and date. Content will be regularly extracted into individual MKDocs pages.

| Activity              | Points | Frequency            |
| ---                   | ---    | ---                  |
| View course module    | 10     | Once per module      |
| Complete quiz         | 50     | Once per quiz        |
| Discussion post       | 25     | Daily limit: 3       |
| Assignment submission | 100    | Once per assignment  |
| Survey completion     | 100    | Once per week        |

| Activity Type         | Points | Frequency Limit      |
| ---                   | ---    | ---                  |
| View course module    | 10     | Once per module      |
| Complete quiz         | 50     | Once per quiz        |
| Discussion post       | 25     | Unlimited            |
| Assignment submission | 100    | Once per assignment  |
| Survey completion     | 100    | Once per week        |
| Forum participation   | 15     | Daily limit: 3 posts |

| Event Category | Base Points | Frequency Limit | Multiplier Rules   |
| ---            | ---         | ---             | ---                |
| Content View   | 10–25       | Once per item   | First-time bonus   |
| Assessment     | 50–200      | Once per attempt| Performance-based  |
| Collaboration  | 15–50       | Daily/Weekly    | Engagement quality |
| Achievement    | 100–300     | Once per milestone | Streak bonuses  |
