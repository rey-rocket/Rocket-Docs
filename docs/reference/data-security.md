# 🤖 AI-Powered Engagement Insights

Rocket uses machine learning to uncover patterns in learner behaviour, optimise reward strategies, and predict dropout risk or engagement dips before they happen.

---

## 1. What Rocket Tracks

Rocket collects metadata from learning systems via:

- Event timestamps
- Activity types
- Sequence patterns
- Engagement frequency and depth

No content data or PII is used for training models.

---

## 2. Predictive Models Used

Rocket applies the following models:

| Model Type         | Purpose                               |
|--------------------|----------------------------------------|
| Classification     | Predicts likelihood of dropout or disengagement |
| Clustering         | Segments learners by engagement pattern |
| Regression         | Forecasts optimal reward intervals     |

---

## 3. Intelligent Reward Suggestions

Rocket's engine analyses individual and group behaviours to:

- Suggest new high-impact behaviours to incentivise
- Detect and reduce reward abuse (e.g. spam posts, gaming completions)
- Adapt reward values based on effort rarity or consistency

---

## 4. Visual Dashboards

Admins and instructors receive:

- Weekly engagement heatmaps
- Risk cohort alerts (e.g. “Low activity over 5 days”)
- Comparative success rates across different reward rules

---

## 5. Institutional Configuration

AI insights are entirely **opt-in** and can be configured at the institution level:

```yaml
ai_insights:
  enabled: true
  exclude_behaviours: [forum_post_viewed]
  report_frequency: weekly
  send_to: [admin@example.edu]
