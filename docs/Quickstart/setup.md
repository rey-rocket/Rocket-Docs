# Installation & Setup

## Prerequisites
- LMS (Moodle 3.8+ or LearnWorlds)
- Node.js 14+
- API credentials for your LMS

## Steps
1. Clone the repo:
   ```bash
git clone https://github.com/your-org/rocket-rewards.git
cd rocket-rewards
```  
2. Install dependencies:
   ```bash
npm install
```  
3. Configure your `.env`:
   ```yaml
LMS_URL=https://yourlms.example.com
API_TOKEN=abcd1234
```  
!!! tip "Use a bot user token"
    It helps you track events separately from human users.
