# Skedaddle — MVP

> **"We are not building social features. We are building a coordination engine that turns aligned people into repeated real-world experiences."**

**Skedaddle Enterprises, Inc.** — Confidential  
Companion to: *Skedaddle Long-Term Product Proposal v2.0*  
Audience: Founding engineering team + early collaborators

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [The Five Layers](#the-five-layers)
- [Build Sequence](#build-sequence)
- [Firestore Schema](#firestore-schema)
- [KPIs & Success Metrics](#kpis--success-metrics)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Skedaddle is an AI-orchestrated social coordination platform. It moves people from strangers to shared real-world experiences — in days, not months. The MVP is decomposed into **five layers**, in dependency order. Each layer is buildable independently, ships user value on its own, and writes to the same underlying intelligence layer.

| Layer | Name | What it does |
|---|---|---|
| 1 | **Experience Coordination** | Core engine — proposes, runs, and learns from every shared experience |
| 2 | **Tribes** | Individual layer — small AI-matched experience cohorts (5–7 people) |
| 3 | **Family Pods** | Household layer — internal family OS + inter-family matching |
| 4 | **Community OS** | Institution layer — SaaS for churches, schools, homeschool co-ops |
| 5 | **Connection Graph™** | Intelligence layer — behavioral property graph; the defensible moat |

**Engineering principle:** Every layer ships a deterministic, rule-based version first. Claude AI orchestration is layered on once the rules have been validated against real users (Phase 5).

---

## Architecture

```
   [ React SPA ]   Vite + Tailwind + shadcn/ui + React Query

        |
        v
   +--- Firebase -------------------------------------------------+
   |                                                              |
   |   [ Auth ]   [ Firestore ]   [ Storage ]   [ Hosting ]      |
   |                  |                                           |
   |                  v                                           |
   |          [ Cloud Functions (TypeScript) ]                    |
   |                  |                                           |
   |        +---------+---------+----------+                      |
   |        |         |         |          |                      |
   |    Matching  Coordination  Edge       FCM                    |
   |    Engine    Workflows     Writer     (Push)                 |
   |        |         |                                           |
   |        +----+----+                                           |
   |             |                                                |
   |             v                                                |
   |        [ Claude API ]  prompt-cached, rate-limited           |
   |        (Anthropic)     via internal LLM gateway              |
   |                                                              |
   +--------------------------------------------------------------+

   All persistent state in Firestore:
   /users  /tribes  /families  /orgs  /experiences  /edges
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React + Vite | SPA for all four user-facing surfaces |
| **Styling** | Tailwind CSS + shadcn/ui | Component library and design tokens |
| **Data Fetching** | React Query | Server state management |
| **Forms** | React Hook Form + Zod | Validation across onboarding and RSVP flows |
| **Routing** | React Router | Client-side navigation |
| **Auth** | Firebase Auth | Email, Google, Apple, phone verification |
| **Database** | Firestore | Primary data store for all five layers |
| **Backend Logic** | Cloud Functions (TypeScript) | Matching engine, coordination workflows, edge writers |
| **Push Notifications** | Firebase Cloud Messaging | Reminders, voting prompts, T&S alerts |
| **File Storage** | Firebase Storage | Profile photos, event images, T&S verification |
| **Hosting** | Firebase Hosting | CDN-backed SPA + preview channels per PR |
| **AI Orchestration** | Claude (Anthropic API) | Match reasoning, experience proposals, re-ranking (Phase 5) |
| **Payments** | Stripe | Family Pods Mode A subscriptions ($14/mo) — added in Phase 3 |
| **IDE** | VS Code | Shared workspace settings + devcontainer config |

---

## Project Structure

```
skedaddle-mvp/
├── web/                            # React SPA (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── onboarding/         # Intake flow (life stage, interests, schedule)
│   │   │   ├── tribes/             # Tribe view, RSVP, voting
│   │   │   ├── family/             # Family Pods Mode A + Mode B
│   │   │   ├── community/          # Community OS org-admin dashboard
│   │   │   └── shared/             # Common UI components
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── firebase.ts         # Firebase SDK init
│   │   │   └── api.ts              # Cloud Function callers
│   │   └── main.tsx
│   ├── tailwind.config.ts          # Skedaddle design tokens
│   ├── vite.config.ts
│   └── package.json
│
├── functions/                      # Firebase Cloud Functions (TypeScript)
│   ├── src/
│   │   ├── matching/
│   │   │   ├── tribeEngine.ts      # Rule-based Tribe matching (Phases 1–4)
│   │   │   └── familyEngine.ts     # Family Pod Mode B matching
│   │   ├── coordination/
│   │   │   ├── proposalEngine.ts   # Experience proposal generation
│   │   │   ├── weatherCheck.ts     # Weather adaptation + indoor fallback
│   │   │   └── reminders.ts        # FCM reminder sequencing
│   │   ├── graph/
│   │   │   └── edgeWriter.ts       # Connection Graph edge write fan-out
│   │   ├── llm/
│   │   │   └── gateway.ts          # Claude API wrapper (rate limits, caching)
│   │   └── index.ts                # Function exports
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                         # Shared TypeScript types
│   └── src/
│       ├── types.ts                # User, Tribe, Family, Org, Experience, Edge
│       └── constants.ts            # Matching thresholds, metro configs
│
├── firebase/
│   ├── firestore.rules             # Security rules
│   └── firestore.indexes.json      # Index definitions
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions → Firebase Hosting
├── .firebaserc
├── firebase.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v9+`
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase project (dev + staging + prod environments)

### Installation

```bash
# Clone the repo
git clone https://github.com/skedaddle-enterprises/skedaddle-mvp.git
cd skedaddle-mvp

# Install all workspaces
npm install

# Install Firebase Functions dependencies
cd functions && npm install && cd ..

# Authenticate with Firebase
firebase login

# Link to the dev project
firebase use dev
```

### Running Locally

```bash
# Start the React dev server
cd web && npm run dev

# In a separate terminal — start Firebase emulators
firebase emulators:start --only firestore,auth,functions
```

The app will be available at `http://localhost:5173`.  
The Firebase emulator UI will be available at `http://localhost:4000`.

> **Phase 0 definition of done:** A developer can clone the repo, run the above commands, sign up for an account, and see a placeholder home screen pulled from Firestore.

---

## Available Scripts

| Location | Command | Description |
|---|---|---|
| `web/` | `npm run dev` | Start React dev server with hot reload |
| `web/` | `npm run build` | Build optimized production bundle |
| `web/` | `npm run preview` | Preview production build locally |
| `web/` | `npm run lint` | Run ESLint |
| `functions/` | `npm run build` | Compile TypeScript Cloud Functions |
| `functions/` | `npm run serve` | Run Functions locally via emulator |
| Root | `firebase deploy` | Deploy everything to Firebase |
| Root | `firebase deploy --only hosting` | Deploy frontend only |
| Root | `firebase deploy --only functions` | Deploy backend only |

---

## The Five Layers

### Layer 1 — Experience Coordination

The heartbeat of Skedaddle. A coordination engine with nine sequential responsibilities:

```
Detect availability → Detect compatibility → Detect proximity → Detect interests
→ Propose experiences → Handle logistics → Confirm participation
→ Track outcomes → Learn from results
```

**MVP rule (Phases 1–4):** A single Cloud Function on a schedule applies four filters in order:

```
availability_overlap  (>= 2 hours shared this week)
+ interest_match      (>= 60% Jaccard similarity)
+ distance_threshold  (median pairwise distance <= 15 mi)
+ group_size_rule     (4–7 members)
→ propose experience
```

No vector search, no embeddings, no LLM — until the loop is validated end-to-end against real users.

**Phase 5 additions:** Claude generates the "why this match" narrative, proposes experiences beyond the venue catalog, and re-ranks rule-based candidates using Connection Graph signals.

---

### Layer 2 — Tribes

Small, AI-matched experience cohorts of 5–7 people. The atomic unit of individual-level connection.

**Matching constraints:**

| Constraint | Rule | Type |
|---|---|---|
| Availability overlap | All members share ≥ 1 weekly window of 2+ hours | Hard |
| Interest similarity | ≥ 3 shared top-level interest tags across the group | Hard |
| Life-stage similarity | Ages within 8-year span; parental status optional | Soft (weighted) |
| Geography radius | All members within 15 mi of geographic centroid | Hard |
| Group diversity | No more than 60% share the same primary interest | Soft (weighted) |

**Four-week lifecycle:** Intro experience → Second shared activity → Optional subgrouping → Stability scoring at Week 4. Failed Tribes are dissolved and rematched with all accumulated outcome data intact — failure is a feature.

**Metrics tracked from day one:** attendance rate, repeat attendance (3+ experiences in 6 weeks), cross-member interaction, drop-off, subgroup formation.

---

### Layer 3 — Family Pods

**Mode A (ships first):** A private household OS. Weekly experience proposals generated from household profile — children's ages, parent schedules, budget, faith/cultural preferences, travel radius. Handles schedule overlap detection, travel time, child-appropriateness filtering, cost filtering, and weather adaptation automatically.

**Mode B (after Mode A retention is stable):** Inter-family matching on children's age bands, parenting style, values alignment, activity preferences, and schedule compatibility. Includes neutral meeting-place logic and optional background verification — both are first-class, not afterthoughts.

**Commercial rationale:** Highest LTV segment ($14/mo per family via Stripe), highest retention (switching cost is high once Mode A is weekly-active), strongest network effects (each Mode B activation writes 4–8 person-edges vs. 2–3 for a Tribe match).

---

### Layer 4 — Community OS

Belonging and onboarding infrastructure for institutions — churches, schools, homeschool co-ops. Turns a roster into actual connections.

**What it produces:** Structured intake → AI-matched small groups, intro families, service opportunities, and personalized events — replacing weeks of manual connections-pastor work with days of software.

**Admin dashboard surfaces:** newcomer integration score, engagement rate, household connections formed, participation velocity.

**Engineering cost is small** — a different read pattern over the same Firestore data, plus an org-admin React app with Firebase Auth custom claims for role gating.

---

### Layer 5 — Connection Graph™

A behavioral property graph capturing every real-world experience outcome. The primary defensible moat.

**Node types:** Individuals, Households, Organizations, Locations/venues, Experiences, Outcomes

**Edge types + signals:**

| Edge type | Weight signals |
|---|---|
| `attended_together` | Recency (days since), frequency (count over window) |
| `repeated_contact` | Satisfaction (mean rating) |
| `hosted` | Retention effect (correlation with continued engagement) |
| `introduced_by` | Trust signal (T&S incidents, positive vouches) |
| `vouched_for` | Edge type weight (configurable per metro) |
| `member_of` | — |

**Why it's the moat:** Smarter over time (every outcome refines future coordination), harder to copy (competitors cannot purchase or synthesize verified real-world participation data), outcome-optimized (every KPI is downstream of an actual real-world result), retention-driven (edge weights explicitly correlate with continued engagement).

---

## Build Sequence

| Phase | Scope | Weeks | Definition of Done |
|---|---|---|---|
| **Phase 0** | Foundation | 1–3 | Dev can clone, run, sign up, see placeholder home from Firestore |
| **Phase 1** | Tribes MVP | 4–10 | 100 hand-recruited Tampa users; 20 Tribes with ≥ 1 completed experience each |
| **Phase 2** | Coordination Engine + Graph writer | 11–18 | Full loop closed: matched → attended → rated → graph → measurably better next match |
| **Phase 3** | Family Pods | 19–26 | 50 households on Mode A; 10 Mode B matches with 2+ shared experiences |
| **Phase 4** | Community OS pilots | 27–38 | 1 paid institutional contract signed; consumer Tampa at 5,000 active users |
| **Phase 5** | Claude AI orchestration | 39–52 | ≥ 30% of Tribe formations AI-augmented; AI cost < $0.40/active user/mo; 5+ pp lift in 7-day retention |

---

## Firestore Schema

```
/users/{userId}
  profile, interests, availability, lifeStage, socialEnergy, geo
  tribeIds: [], familyId?: string, orgIds: []

/tribes/{tribeId}
  metro, formedAt, status, compatibility, lastExperienceAt
  /members/{userId}        — role, joinedAt, attendanceCount
  /experiences/{expId}     — cached recent

/families/{familyId}
  parents: [userId], children: [{age, name?}], budget, radius
  /experiences/{expId}
  /matches/{otherFamilyId} — Mode B matches

/orgs/{orgId}
  type: 'church' | 'school' | 'coop' | ...
  /members/{userId}        — with onboarding state
  /admins/{userId}
  /metrics/{period}        — denormalized rollups

/experiences/{expId}
  proposedBy: 'engine' | userId
  participants: [userId], startsAt, endsAt, venue, status
  /feedback/{userId}

/edges/{edgeId}
  fromNodeId, fromNodeType, toNodeId, toNodeType
  edgeType: 'attended_together' | 'repeated_contact' | 'hosted' | ...
  weight: 0.0–1.0
  recency: timestamp
  frequency: number
  satisfaction: number
  experienceIds: [string]
  metroScope: 'tampa' | 'charlotte' | ...
```

> Each user document also stores a precomputed `topEdges` summary the matching engine can scan without N+1 queries. Cloud Functions keep it in sync on every relevant write. When edge volume exceeds ~5M, the plan is to mirror selected partitions to a managed Neo4j read replica — this is a documented migration, not a rewrite.

---

## KPIs & Success Metrics

| Layer | Primary KPI | Target (Month 18) |
|---|---|---|
| Experience Coordination | Median time from match → first attended experience | ≤ 3.5 days |
| Tribes | Repeat attendance (3+ experiences in 6 weeks) | ≥ 55% |
| Family Pods Mode A | Weekly active households | ≥ 1,500 |
| Family Pods Mode B | Inter-family matches with 2+ shared experiences | ≥ 200 |
| Community OS | Active institutional contracts | ≥ 8 |
| Connection Graph | Verified edges written | ≥ 100,000 |
| Whole product | WAU + ARR run-rate | 50K WAU + $1.2M ARR |

**Counter-metrics (early warning signals):**

| Signal | Threshold | Response |
|---|---|---|
| Tribe formation acceptance rate | < 50% | Pause Phase 2; tune matching engine |
| Mode A monthly churn | > 8% | Investigate household experience slate quality |
| AI cost per active user | > $1.00/mo | Tighten LLM gateway rate limits |
| T&S incident rate | > 1 per 10K experiences | Hire second T&S reviewer immediately |
| Community OS pilot conversion | < 33% (1 of 3) | Reassess institutional pricing and ICP |

---

## Environment Variables

Create a `.env.local` file in `web/` for local development. **Never commit secrets.**

```env
# Firebase (web app config)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Feature flags
VITE_ENABLE_PHONE_VERIFY=false     # Gates phone verification (off until Phase 3)
VITE_ENABLE_AI_MATCHING=false      # Gates Claude AI orchestration (off until Phase 5)
VITE_METRO_SEED=tampa              # Active metro for seeded venue catalog
```

Cloud Functions read secrets via Firebase Secret Manager — see `functions/src/config.ts`.

---

## Deployment

### Preview (per pull request)

GitHub Actions automatically deploys a Firebase Hosting preview channel on every PR. The preview URL is posted as a PR comment.

### Staging

```bash
firebase use staging
firebase deploy
```

### Production

```bash
firebase use prod
firebase deploy
```

Merging to `main` triggers a full production deploy automatically via `.github/workflows/deploy.yml`.

---

## Contributing

This is an internal Skedaddle Enterprises repository.

1. Branch off `main`: `git checkout -b feature/your-feature-name`
2. Keep commits scoped — each commit should map to a sprint card
3. Run `npm run lint` and `npm run build` before opening a PR
4. PR description must include: what changed, which phase/layer it belongs to, and the definition of done it closes
5. Request review from at least one other team member before merging to `main`

---

## License

**Confidential — All Rights Reserved**  
© 2025 Skedaddle Enterprises, Inc.  
Proprietary frameworks for internal team use only. Unauthorized reproduction, distribution, or disclosure is strictly prohibited.
