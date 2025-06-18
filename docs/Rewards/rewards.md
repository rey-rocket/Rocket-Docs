# 🎁 Points & Rewards System

The Rocket platform uses a rules-based points engine to track learner engagement and convert it into meaningful rewards. This system is flexible, tamper-resistant, and institution-configurable.

---

## ⚙️ 1. How the Points Engine Works

Rocket listens for events triggered by user activity in your LMS or corporate learning platform. When a configured event occurs, Rocket checks it against institution-defined rules and awards points accordingly.

### 🧩 Rule Structure Example

```yaml
- id: submit_quiz
  event: core\event\quiz_attempt_submitted
  conditions:
    score: ">=80"
  points: 10
  frequency: 1
  cooldown: 7d
```

Each rule includes:
- **Event name** from the LMS
- **Condition(s)** (e.g., score thresholds)
- **Point value**
- **Rate limits**, cooldowns, or caps

---

## 📒 2. Points Ledger

Every points-related action is stored in an immutable ledger.

| Field         | Description                            |
|---------------|----------------------------------------|
| `user_id`     | Learner identifier                     |
| `event_id`    | LMS event or custom system event       |
| `points`      | Number of points awarded               |
| `rule_id`     | Identifier for the triggered rule      |
| `timestamp`   | UTC time of transaction                |
| `source`      | LMS or platform origin                 |

### 🔐 Ledger Characteristics
- Write-once, append-only structure
- Fully auditable for compliance
- Available via API and CSV export

---

## 🏷️ 3. Reward Categories and Tiers

Institutions can define their own reward tiers to align incentives with effort and engagement.

### 🧱 Tier Examples

| Tier         | Points Required | Example Rewards                          |
|--------------|------------------|------------------------------------------|
| Bronze       | 50               | £5 gift card, digital badge              |
| Silver       | 200              | £20 voucher, course material access      |
| Gold         | 500              | Premium discount, physical merchandise   |

Tiers can:
- Be tied to learner badges, achievements, or completion rates
- Be shown conditionally in the learner interface

---

## 🛒 4. Reward Redemption Workflow

When a learner chooses to redeem:

1. The system validates that:
   - The user has enough points
   - The reward is active and institution-approved
2. Points are deducted from the ledger
3. A secure one-time-use token is generated
4. Rocket sends the token to the redemption partner API or displays it in-app

---

## 💰 5. Funding Models

Rocket supports multiple reward funding strategies:

| Model                  | Description                                          |
|------------------------|------------------------------------------------------|
| Institution-Funded     | Rewards fully covered by the organisation            |
| Discount-Only Access   | Learners purchase gift cards at discounted rates     |
| Hybrid                 | Earned tokens unlock greater savings                 |

Administrators can configure monthly budgets or limit reward types to funded-only options.

---

## 🔐 6. Abuse Prevention & Anti-Gaming Measures

To ensure fair play and value-based recognition, Rocket includes:

- ✅ Cooldown timers per rule (e.g. only 1 rewardable forum post per day)
- ✅ Spam and abuse pattern detection (e.g. empty submissions)
- ✅ AI-aided flagging of suspicious reward activity
- ✅ Institution-defined blacklists for non-qualifying behaviours

---

## 📊 7. Reporting & Auditing

Admins can export or review reward activity via:

- Rocket dashboard insights
- API endpoints: `/api/user/points`, `/api/rewards/ledger`
- CSV export with filters by date, user, or rule

Integrations with Power BI, Mixpanel, and Google Data Studio are also supported.

---

## 🧩 8. Optional Enhancements

- **Badge Gating**: Require a digital badge to unlock higher reward tiers
- **Time Windows**: Allow rewards only during specific dates/times
- **Conditional Unlocks**: Require multiple achievements before rewards show up

For detailed configuration assistance, see the [Admin Onboarding Guide](../onboarding/admin.md).
