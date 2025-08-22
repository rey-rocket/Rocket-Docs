# Rocket Learning Rewards – Knowledge Base

_Last updated: 21 Aug 2025 (Africa/Johannesburg)_

**Rocket Learning Rewards (RLR)** is a behavioural-change and engagement layer for learning. It listens to events from your LMS or training platform, awards points for positive learning behaviours, and lets learners redeem points for real-world rewards.

---

## Table of Contents

- [TL;DR / Quick Start](#tldr--quick-start)
- [What RLR Does](#what-rlr-does)
- [Core Concepts](#core-concepts)
- [Roles & Access](#roles--access)
- [How It Works (Architecture)](#how-it-works-architecture)
- [Points & Rewards Model](#points--rewards-model)
- [Integrations](#integrations)
  - [Moodle / Open LMS](#moodle--open-lms)
  - [LearnWorlds](#learnworlds)
  - [Thinkific](#thinkific)
  - [Valamis (xAPI / LRS-first)](#valamis-xapi--lrs-first)
  - [Canvas (pilot/optional)](#canvas-pilotoptional)
- [Events & Webhooks](#events--webhooks)
  - [Event Naming & Schema](#event-naming--schema)
  - [Example Payloads](#example-payloads)
  - [Security (Secrets, Auth, IP allowlist)](#security-secrets-auth-ip-allowlist)
- [Analytics & Insights](#analytics--insights)
  - [Mixpanel Setup (Sheets → Mixpanel, HTTP API)](#mixpanel-setup-sheets--mixpanel-http-api)
  - [Power BI Prototype](#power-bi-prototype)
- [CSV Imports & Validation](#csv-imports--validation)
- [Onboarding & Customer Success Playbook](#onboarding--customer-success-playbook)
- [Admin Guide](#admin-guide)
- [Troubleshooting](#troubleshooting)
- [Accessibility & UX](#accessibility--ux)
- [Security & Compliance](#security--compliance)
- [Docs & Contribution Guide](#docs--contribution-guide)
- [Release Notes Template](#release-notes-template)
- [Glossary](#glossary)
- [Appendix: Templates](#appendix-templates)

---

## TL;DR / Quick Start

1. **Choose your integration path**
   - LMS webhooks (Moodle/OpenLMS Event Trigger, LearnWorlds webhooks, Thinkific webhooks)
   - xAPI → LRS (Valamis or other LRS) → RLR ingestion
2. **Send events** (Course/lesson completion, activity views, progress, time-on-task, sign-ins).
3. **Define points rules** in RLR (e.g., completion, momentum, spaced learning, quality engagement).
4. **Verify analytics** (Mixpanel test project, event schema checks).
5. **Go live** with rewards catalogue and redemption.

---

## What RLR Does

- **Motivates engagement** by rewarding specific learning behaviours (completion, consistency, positive discussion, timely submissions).
- **Ingests events** from LMSs and related platforms via webhooks or xAPI/LRS.
- **Awards points** based on configurable rules and anti-gaming safeguards.
- **Supports badges** (per-module, all-training complete) and **redemption** via a global rewards catalogue (3,000+ brands in 35+ countries).
- **Surfaces insights** via Mixpanel (and optional Power BI) for programme effectiveness.

---

## Core Concepts

- **Event**: A fact from a source system (e.g., `course.completed`, `lesson.completed`, `user.logged_in`).
- **Rule**: Mapping from event(s) + conditions → points/badges.
- **Wallet**: Per-user balance of points.
- **Reward**: Redeemable item (gift card/voucher/benefit).
- **Badge**: Threshold-based recognition tied to assessments or aggregated achievements.
- **Integrity checks**: Rate limits, caps, momentum windows, and duplication protection.

---

## Roles & Access

- **System Administrator**: Grants platform access and configures integrations (webhooks, APIs, IP allowlists).
- **HR Practitioner / Programme Owner / Instructor**: Defines tracked metrics and rules; reviews analytics.
- **Learner**: Participates in learning; earns and redeems points.

---

## How It Works (Architecture)

[ Learner Actions ]
↓ (Events)
[ LMS / Platform ] ──▶ [ Webhooks or xAPI/LRS ] ──▶ [ RLR Ingestion ]
├─▶ [ Rules Engine → Points/Badges ]
├─▶ [ Wallet & Rewards ]
└─▶ [ Analytics (Mixpanel/BI) ]

csharp
Copy
Edit

**Notes**
- LMS-first stacks use webhook integrations (Moodle/Open LMS, LearnWorlds, Thinkific).
- LRS-first stacks (e.g., Valamis) send xAPI statements that RLR can ingest/transform.
- Analytics mirrors the same canonical event schema for unified reporting.

---

## Points & Rewards Model

### Default example rules (editable)
| Category | Trigger | Example rule | Default points | Caps / Notes |
|---|---|---|---:|---|
| Activity completion | `lesson.completed` | Award on first completion per lesson | 10 | Max 3/day |
| Section mastery | `% course progress` | Award when learner passes a configured threshold | 10 | 1 per section |
| Time-boxed completion | `started_at + completed_at` | Award if within recommended time window | 15 | Window configurable |
| Consistency / streak | `n days with >=1 completion` | Weekly streak bonus | 20 | Anti-gaming checks |
| Positive engagement | `forum.posted` + quality signals | Instructor-tagged as constructive | 5 | Rate-limited |
| Full course completion | `course.completed` | Major milestone | 50 | One-time per course |
| Programme complete | `all trainings >=80%` | Final badge & bonus | 100 | Once per user |

> Configure point values, caps, and cooldowns per partner. Anti-abuse includes dedupe by event id, per-day caps, and trigger cooldowns.

---

## Integrations

### Moodle / Open LMS

**Two patterns:**
1) **Event Trigger plugin** → HTTP POST to RLR  
2) **Local plugin / observers** listening to core events, then call RLR.

**Common events to emit**
- `\core\event\user_loggedin` (login)
- `\core\event\course_completed` (course completion)
- Activity/section events (completion updates, views)

**Event Trigger plugin (recommended to start)**
- Install **tool_trigger** (Catalyst IT).
- Create a workflow:
  - **Trigger**: choose event (e.g., `\core\event\course_completed`)
  - **(Optional) Filters**: limit to specific courses/categories
  - **Action**: HTTP POST to your RLR endpoint with JSON payload; include auth header.
- Use Moodle’s Events list report to explore available events and components.

**References** (conceptual docs listed at end)

#### Example: HTTP POST action fields (sanitize secrets!)
- URL: `https://<your-r lr-domain>/api/public/hook/moodle/event`
- Headers: `Content-Type: application/json`, `Authorization: Bearer <token>`
- Body (JSON): include `id, eventname, component, action, target, objectid, userid, courseid, timecreated, other`

### LearnWorlds

- Use **Developers → Webhooks** to register URLs for events (enrollments, completions, purchases, etc.).
- Optionally, send via Zapier/Make during pilots.
- For deeper data pulls, also enable LearnWorlds REST API.

### Thinkific

- Use **Webhooks API** (Admin API & Webhooks) to register webhook topics such as `order.created`, `enrollment.progress`, `lesson.completed`, `course.completed`, `user.updated`, `lead.created`.
- For managed pilots, Zapier/Pipedream can be used; production should use direct Webhooks API with secret verification.

### Valamis (xAPI / LRS-first)

- Valamis is xAPI-centric with an embedded LRS. Configure your LRS to forward selected statements to RLR (webhook/xAPI proxy), or fetch from LRS for batch import.
- Recommended statements: `Completed`, `Passed`, `Experienced`, time-on-task measures, and programme progress.

### Canvas (pilot/optional)

- Webhooks are not first-class; use API polling and/or Live Events via third-party tools. For proof-of-concept, focus on assignment submissions, quiz completions, and module progress.

---

## Events & Webhooks

### Event Naming & Schema

**Naming**: `domain.action` (e.g., `course.completed`, `lesson.completed`, `user.logged_in`)

**Canonical schema (RLR ingestion)**
```json
{
  "event": "course.completed",
  "source": "moodle",            // moodle | openlms | learnworlds | thinkific | valamis | custom
  "occurred_at": "2025-08-21T10:15:30Z",
  "user": {
    "id": "12345",
    "email": "learner@example.edu",
    "external_ids": { "moodle": "8774" }
  },
  "context": {
    "course": { "id": "987", "title": "Health & Safety" },
    "section": { "id": "sec-3", "title": "Risk Basics" },
    "lesson": { "id": "l-12", "title": "PPE Basics" }
  },
  "metrics": {
    "progress_pct": 100,
    "time_on_task_sec": 1420
  },
  "trace": {
    "request_id": "c37c3e…",
    "lms_event_id": "9194694",
    "lms_eventname": "\\core\\event\\course_completed"
  }
}
Example Payloads
Moodle / Open LMS → RLR

json
Copy
Edit
{
  "id": 9194694,
  "eventname": "\\core\\event\\course_completed",
  "component": "core",
  "action": "completed",
  "target": "course",
  "objectid": 987,
  "userid": 8774,
  "courseid": 987,
  "timecreated": 1662013333,
  "other": { "completiontime": 1662013333 }
}
LearnWorlds → RLR (shape varies by topic)

json
Copy
Edit
{
  "topic": "course.completed",
  "occurred_at": "2025-08-21T10:15:30Z",
  "data": {
    "user_id": "U-123",
    "course_id": "C-987",
    "progress": 100
  },
  "signature": "sha256=..."
}
Thinkific → RLR

json
Copy
Edit
{
  "topic": "lesson.completed",
  "created_at": "2025-08-21T10:15:30Z",
  "payload": {
    "user": { "id": 123, "email": "learner@example.com" },
    "course_id": 987,
    "lesson_id": 456
  },
  "hmac": "..."
}
Security (Secrets, Auth, IP allowlist)
Verify HMAC/signature when provided (Thinkific); otherwise issue a bearer token to each source and rotate periodically.

Prefer IP allowlisting for webhook sources where feasible.

Store secrets in your secure config (never in code or docs).

Use a staging project for test traffic isolation.

Analytics & Insights
Mixpanel Setup (Sheets → Mixpanel, HTTP API)
Option A – Google Sheets extension (no-code)

Install the official Sheets ⇄ Mixpanel add-on.

Mode: Sheet → Mixpanel to import events from a tab with canonical columns.

Schedule imports hourly during pilot; switch to server-side ingest for production.

Option B – HTTP /track & /import

Server-side: send batches to /import for historical and server events.

Client-side (if applicable): /track or SDKs (JS, Python, etc.).

Create a test project and use the Debug/Live View to validate schemas before production.

Event naming & properties

Use the canonical event names above.

Always include: distinct_id (user id), time (epoch seconds), and a stable event_id for idempotency.

Add properties like course_id, lesson_id, progress_pct, time_on_task_sec, lms.

Recommended starter dashboard

Conversion: course.enrolled → lesson.completed (≥3) → course.completed

Retention: 7-day unbounded by lesson.completed

Engagement: Daily active learners (DAL), average lessons/day

Quality: % completions within recommended window; constructive posts tagged

Rewards: Points earned vs. redeemed per cohort

Power BI Prototype
For early research with a university, export RLR/Mixpanel aggregates or event-level CSVs.

Minimal model:

events (event, user_id, course_id, lesson_id, time, props…)

users (dept, cohort, start_date…)

courses (category, modality)

Measures: Course completion rate, weekly momentum score, points issued vs. redeemed, effect sizes pre/post RLR.

CSV Imports & Validation
Use CSV to backfill users or events in controlled pilots. Common validation failures to detect and message clearly:

Names: empty, all-caps, numerals/symbols, emoji.

Emails: missing @, multiple @, invalid TLD, spaces, case-sensitivity anomalies.

User IDs: non-unique, mixed types (string vs int), leading zeros.

Timestamps: non-numeric, out-of-range epoch, timezone missing.

Course/Lesson IDs: missing, not found in mapping table.

Duplicate rows: same event_id or (user_id, event, timestamp) tuple.

Schema drift: unexpected columns, missing required columns.

Encoding: non-UTF-8; stray BOM; delimiter mismatch.

Consent flags: missing required policy acknowledgements (if enabled).

Sheets UNIX timestamp to datetime

text
Copy
Edit
= (A2 / 86400) + DATE(1970,1,1)         // format cell as Date/Time
Add timezone with + (2/24) for SAST or use Apps Script for robust TZ conversion.

Onboarding & Customer Success Playbook
Lead capture & qualification

Target Clients (brands/vendors) for rewards supply and Institutional Partners (universities, organisations) for deployment.

LMS integration consultation

Confirm integration capabilities, courses and user volumes, test access.

Implementation

Provision RLR admin + secure endpoints/keys.

Configure webhooks (Moodle Event Trigger / LearnWorlds / Thinkific / Valamis LRS).

Set points rules, badges, and redemption catalog.

Pilot with a small cohort and a Mixpanel test project.

Operate

Weekly health checks: event freshness, rule hit rates, points issuance, redemption velocity.

Quarterly reviews: programme adjustments and stakeholder reporting.

Admin Guide
Rules: Create/edit rule sets per organisation, with caps and cooldowns.

Badges: Thresholds (e.g., ≥80% on all trainings) → badge issue & bonus.

Rewards: Configure catalog visibility, limits, burn windows.

Integrity: Set per-event/day caps; dedupe by event id; audit log exports.

Data: Manage exports, retention policies, anonymisation on request.

Troubleshooting
No events arriving

Check webhook delivery logs in source LMS.

Verify DNS/SSL for RLR endpoint; confirm bearer/HMAC.

Confirm IP allowlist and 2xx responses.

Moodle course_completed not firing

In some versions it can be cron/task-driven or triggered upon requirement satisfaction; verify task runs and completion settings.

Use Events list report to confirm emissions; test with a simple workflow.

Mixpanel data not visible

Verify you’re in the test project vs production.

Use Live View and the Debugger to inspect property shapes.

Ensure distinct_id and time are present; align property casing.

Timestamps wrong in Sheets

Ensure epoch seconds, not ms. Divide by 1000 if needed.

Apply TZ offset or convert serverside before import.

Accessibility & UX
Reward messaging should be clear, non-manipulative, and opt-out friendly.

Follow WCAG guidance for any learner-facing UI (contrast, focus states, semantic structure).

Keep text concise with clear purpose statements at the top of each page.

Security & Compliance
Data minimisation: only send the identifiers needed (avoid sensitive categories).

Policies: align with POPIA (SA) and GDPR where applicable.

Retention: configurable; default to shortest useful window for raw events.

Access: least privilege; rotate secrets; use per-partner tokens; enable audit logs.

Docs & Contribution Guide
We use MkDocs Material and Markdown. Local structure:

pgsql
Copy
Edit
mkdocs.yml
docs/
  index.md
  integrations/
    moodle-openlms.md
    learnworlds.md
    thinkific.md
    valamis-xapi.md
  analytics/
    mixpanel.md
    powerbi.md
  admin/
    rules.md
    rewards.md
    badges.md
  ops/
    troubleshooting.md
    security.md
    release-notes.md
Style: start articles with a purpose statement; keep tasks step-by-step; use consistent templates and headings.

Add screenshots sparingly and keep them current.

Release Notes Template
markdown
Copy
Edit
# Release YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Deprecated/Removed
- ...
Glossary
xAPI: Experience API standard for learning activity statements.

LRS: Learning Record Store (stores xAPI statements).

Event Trigger: Moodle plugin that posts events to external endpoints.

HMAC: Signature used to verify webhook authenticity.

DAL: Daily Active Learners.

Appendix: Templates
Minimal webhook receiver (pseudo-Express)
js
Copy
Edit
app.post('/api/public/hook/:source/event', verifySignature, async (req, res) => {
  const canonical = mapToCanonical(req.params.source, req.body);
  if (await isDuplicate(canonical.trace.lms_event_id)) return res.status(200).send('dup');
  await awardPoints(canonical);
  await enqueueAnalytics(canonical);
  res.status(202).send('ok');
});
CSV event import (columns)
bash
Copy
Edit
event,distinct_id,time,course_id,lesson_id,progress_pct,time_on_task_sec,event_id,source
Mixpanel event (server-side /import)
json
Copy
Edit
POST https://api.mixpanel.com/import
[
  {
    "event": "lesson.completed",
    "properties": {
      "time": 1724230530,
      "distinct_id": "U-123",
      "course_id": "C-987",
      "lesson_id": "L-456",
      "source": "thinkific",
      "event_id": "thinkific-evt-123"
    }
  }
]
Moodle Event Trigger HTTP body (example)
json
Copy
Edit
{
  "id": "{id}",
  "eventname": "{eventname}",
  "component": "{component}",
  "action": "{action}",
  "target": "{target}",
  "objectid": "{objectid}",
  "userid": "{userid}",
  "courseid": "{courseid}",
  "timecreated": "{timecreated}"
}
