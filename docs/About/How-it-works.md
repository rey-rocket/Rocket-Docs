# 🔧 How Rocket Works (Technical Overview)

Rocket integrates directly with your LMS or learning system to track defined engagement behaviours and automate reward distribution through a secure, data-driven pipeline.

---

## 1. Event-Driven Architecture

Rocket uses **event listeners** or webhook triggers from your LMS to monitor learner activity. These include:

- Assignment submissions
- Quiz completions
- Forum activity
- Video/watch time tracking
- Module completions

Each event is processed and filtered against **custom rule logic** defined by your institution or company.

---

## 2. Behaviour-to-Reward Mapping

Using a configurable logic engine, Rocket maps LMS events to engagement behaviours, which are then translated into point values.

Example logic:

```yaml
rules:
  - event: core\event\assignment_submitted
    condition: score > 75
    points: 10
    cooldown: 1 per week
  - event: mod\forum\event\post_created
    condition: length > 250
    points: 5
    limit: 3 per week
```

