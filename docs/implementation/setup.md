# Installation & Setup

This guide covers the technical installation and initial configuration of Rocket Learning Rewards for your institution.

## Prerequisites

Before beginning installation, ensure you have:

<div class="implementation-checklist">
  <div class="checklist-header">
    <div class="checklist-icon">🔧</div>
    <h3 class="checklist-title">Technical Prerequisites</h3>
  </div>
  
  <div class="checklist-item">
    <div class="checklist-checkbox" tabindex="0"></div>
    <div class="checklist-text">LMS (Moodle 3.8+ or LearnWorlds) with admin access</div>
  </div>
  
  <div class="checklist-item">
    <div class="checklist-checkbox" tabindex="0"></div>
    <div class="checklist-text">Node.js 14+ installed on your server</div>
  </div>
  
  <div class="checklist-item">
    <div class="checklist-checkbox" tabindex="0"></div>
    <div class="checklist-text">API credentials for your LMS platform</div>
  </div>
  
  <div class="checklist-item">
    <div class="checklist-checkbox" tabindex="0"></div>
    <div class="checklist-text">Domain access for DNS configuration</div>
  </div>
  
  <div class="checklist-item">
    <div class="checklist-checkbox" tabindex="0"></div>
    <div class="checklist-text">AWS account credentials (provided by Rocket team)</div>
  </div>
</div>

## Installation Steps

### Step 1: Repository Setup

Clone the Rocket Rewards repository to your server:

```bash
# Clone the repository
git clone https://github.com/rocket-education/rocket-rewards.git
cd rocket-rewards

# Install dependencies
npm install

# Verify installation
npm run verify
```

<div class="alert alert-info">
  <h4>💡 Pro Tip</h4>
  <p>Use a bot user token for API access. This helps you track events separately from human users and provides better security isolation.</p>
</div>

### Step 2: Environment Configuration

Configure your environment variables by creating a `.env` file:

```yaml
# LMS Configuration
LMS_URL=https://yourlms.example.com
LMS_TYPE=moodle  # or 'canvas', 'learnworlds'
API_TOKEN=your_api_token_here

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/rocket_rewards
REDIS_URL=redis://localhost:6379

# Rocket Configuration
ROCKET_API_KEY=provided_by_rocket_team
ROCKET_ENVIRONMENT=production  # or 'staging', 'development'

# Security
JWT_SECRET