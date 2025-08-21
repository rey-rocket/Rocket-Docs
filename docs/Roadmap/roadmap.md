
---

# Points & Rewards System (Technical Overview)

Rocket translates learning effort into tangible incentives through a modular and secure points engine. This page details how point attribution, management, and redemption are handled.

---

## 1. Points Engine

Each learner action is evaluated against a **ruleset** defined by the institution. Rules include:

- Event name and conditions
- Point value
- Frequency limits
- Cooldowns or reset intervals

Points are granted only when all rule conditions are satisfied.

---

## 2. Points Ledger Architecture

Rocket maintains a real-time, write-once ledger for all point transactions. Each entry includes:

- User ID
- Action performed
- Points awarded
- Rule ID
- Timestamp
- Source system (e.g., LMS name)

!!! note ""
This enables full traceability and export to BI tools.

---

## 3. Reward Tiers and Categories

Institutions can define reward tiers:

| Tier Name     | Points Required | Example Rewards                 |
|---------------|------------------|---------------------------------|
| Starter       | 50               | £5 gift card, app badge         |
| Committed     | 200              | £20 voucher, early access       |
| Influencer    | 500              | Large discount, premium perks   |

Categories can be filtered by brand type (tech, food, retail), engagement type, or budget.

---

## 4. Redemption Controls

Redemption workflows include:

- Verification of points balance
- Rule-based availability (e.g., badge gated rewards)
- Institution-funded vs. self-funded separation
- Token or voucher generation via secure partner API

---

## 5. Funding Model Support

Rocket supports:

- **Institution-funded rewards** (via monthly budgets)
- **Learner-purchased rewards** (discounts for effort)
- **Hybrid models** (e.g., earn tokens → get discounts)

---

## 6. Abuse Prevention & Anti-Gaming

Built-in controls include:

- Reward cooldowns
- Rate limiting (per day/week/month)
- Rule chaining to detect hollow activity
- AI-powered fraud pattern detection (e.g., rapid post/delete loops)

---

## 7. Export & Reporting

Points data can be exported via:

- CSV (manual or scheduled)
- API endpoints (`/api/user/points`)
- Integration with Power BI, Mixpanel, or other analytics tools
