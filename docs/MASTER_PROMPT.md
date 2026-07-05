# InterviewMaster AI — Master Prompt

> **Status:** Architecture blueprint (Prompt 1). Never changes without explicit owner approval.  
> **Cursor rule:** Read this document completely before implementing any feature, fix, or refactor.

---

## Mission

Transform the existing React + Vite + TypeScript + Tailwind project into **InterviewMaster AI** — a production-quality V1 edtech platform.

**Design goal:** Take inspiration from CodeWithAryan **only for content density and information architecture** — do **not** copy its UI. Build a significantly more premium, modern, polished, conversion-focused experience that feels like a high-quality SaaS product. Prioritize excellent UX, mobile responsiveness, accessibility, readability, and performance.

**Final goal:** Users should feel InterviewMaster AI is not just another SQL website — it is a **premium Data Engineering learning platform** that will continuously grow with new learning paths. Architecture, routing, branding, design system, auth, payments, Firestore structure, and the module system must all support that long-term vision.

InterviewMaster AI is a **platform**, not a SQL-only site. SQL is the first live learning path.

---

## Non-Negotiable Rules

1. **Do NOT rebuild from scratch.** Extend the existing project at `sql-interview-prep`.
2. **Do NOT store questions in Firestore.** Questions live in TypeScript files only.
3. **Do NOT trust frontend for premium status.** Never use `localStorage` or client-only flags for entitlements.
4. **Do NOT use mock APIs, fake auth, or fake payments.** Integrations must be real (test mode acceptable during development).
5. **Do NOT leave TODOs** in shipped V1 code paths.
6. **Do NOT hardcode colors.** Use design tokens everywhere.
7. **Do NOT display "SQL Interview Prep" anywhere.** Always brand as **InterviewMaster AI** (UI, metadata, OG tags, JSON-LD, package display name where user-facing).
8. **Do NOT introduce alternative backends.** Firebase Cloud Functions is the only backend for V1.
9. **Do NOT start V2 features** (PostgreSQL, Admin Panel, CMS) during V1 unless explicitly requested.

---

## Locked V1 Architecture

```
Vercel
  └── React 19 + Vite + TypeScript + Tailwind CSS
        ├── Firebase Auth (Google Login only in V1)
        ├── Firestore (users, subscriptions, payment metadata ONLY)
        ├── Firebase Cloud Functions (Razorpay backend ONLY)
        ├── Questions in src/data/questions/*.ts
        └── src/data/learningPaths.ts (single source of truth)

Later (V2):
  └── PostgreSQL + Admin Panel + CMS
```

### Why this stack

- **Vercel:** Frontend hosting, security headers, edge-friendly static assets.
- **Firebase Auth + Firestore + Functions:** Single ecosystem for identity, user state, and payment verification.
- **TypeScript question files:** Fast reads, version control, no CMS dependency in V1.
- **PostgreSQL deferred to V2:** Migration path without blocking V1 launch.

---

## Tech Stack (V1)

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router, Framer Motion |
| Auth | Firebase Authentication — **Google OAuth only** (V1) |
| Database | Cloud Firestore — **user data only** |
| Backend | **Firebase Cloud Functions only** |
| Payments | Razorpay (subscriptions) |
| Content | TypeScript files in `src/data/` |
| Hosting | Vercel (frontend), Firebase (functions) |
| Analytics | Google Analytics, Microsoft Clarity (via env vars) |
| Email | Out of V1 scope unless added in a later phase |

**Explicitly excluded from V1:** Shadcn UI, Express on Render/Railway, PostgreSQL, Stripe, GitHub OAuth, email/password auth.

---

## Branding

| Use | Do not use |
|-----|------------|
| **InterviewMaster AI** | SQL Interview Prep |
| "SQL" as a learning path label | SQL as the product name |
| Tagline: platform for interview prep across data & engineering paths | Any legacy repo naming in user-facing copy |

Apply branding consistently in:

- Page titles and meta descriptions
- OpenGraph and Twitter cards
- JSON-LD structured data
- Navbar, footer, auth screens, pricing
- Error and empty states

---

## Design System & UI/UX Quality Bar

> The UI is one of the most important parts of this product. Every page must feel polished. The site must immediately communicate: **"This is a professional platform worth paying for."**

### What it must feel like

- Premium modern SaaS — comparable to **Vercel, Linear, Stripe, Raycast, Notion, Clerk, Supabase**
- CodeWithAryan-level **information density** and IA — rich but clean
- **Premium dark theme** as the default experience

### What it must NOT feel like

- A generic Tailwind dashboard
- A template, CRUD app, or college project
- A copy of CodeWithAryan's visual design

### UI requirements (mandatory)

- Premium dark theme with beautiful gradients
- Premium typography and excellent spacing
- Smooth **Framer Motion** animations ( purposeful, not distracting )
- Modern cards; glassmorphism **only where appropriate**
- Beautiful hover interactions
- Skeleton loading states
- Polished empty states
- Premium lock illustrations for gated content
- Sticky navigation
- Responsive sidebar + responsive mobile navigation
- Beautiful pricing cards
- Premium CTA sections
- Trust badges
- Consistent iconography
- Proper visual hierarchy and readability

### Design tokens (required — semantic)

Define tokens in `src/lib/design-tokens/` (or equivalent). **Every component must use design tokens. Never hardcode hex/rgb in components.**

| Token | Purpose |
|-------|---------|
| `primary` | Brand actions, key links |
| `secondary` | Secondary actions |
| `accent` | Highlights, badges, premium cues |
| `surface` | Elevated surfaces |
| `background` | Page background |
| `card` | Card backgrounds |
| `border` | Dividers, inputs, card edges |
| `muted` | Secondary text, subtle UI |
| `warning` | Caution states |
| `success` | Success states |
| `info` | Informational states |

Map tokens to Tailwind theme extensions in `index.css` / Tailwind config.

### UI standards

- Tailwind CSS only — **no Shadcn in V1**
- Framer Motion for page transitions, cards, modals, and micro-interactions
- Mobile-first responsive layout
- WCAG-aware contrast and focus states
- Lazy-loaded routes and heavy components
- Readable typography: clear body text + monospace for SQL/code
- Reusable component primitives built on tokens — consistent design system across all modules

---

## Platform Architecture: Learning Paths

### Single source of truth

All learning paths are defined in **`src/data/learningPaths.ts`**.

Home, sidebar, navbar, learning paths page, and module routing **must read from this file only**. Adding a new path tomorrow = update one file + add a module folder — **no navigation redesign**.

Example shape:

```typescript
export type LearningPathStatus = 'live' | 'coming_soon'

export interface LearningPath {
  slug: string
  title: string
  description: string
  status: LearningPathStatus
  icon: string
  order: number
  premium?: boolean // path-level flag if needed
}
```

Initial paths:

| Slug | Status |
|------|--------|
| `sql` | **live** |
| `pyspark` | coming_soon |
| `spark` | coming_soon |
| `azure-data-engineering` | coming_soon |
| `azure-data-factory` | coming_soon |
| `azure-databricks` | coming_soon |
| `delta-lake` | coming_soon |
| `python` | coming_soon |
| `data-modeling` | coming_soon |
| `system-design` | coming_soon |
| `projects` | coming_soon |
| `mock-interviews` | coming_soon |

---

## Module Layout Contract (critical)

Every learning path module **must use the exact same layout shell**. When PySpark, Spark, ADF, or Databricks launch, they plug in without routing or nav redesign.

### Shared module shell

```
/learn/:pathSlug                    → Module home (categories / sheets overview)
/learn/:pathSlug/:categorySlug      → Category or sheet list
/learn/:pathSlug/question/:id       → Question detail
```

### Rules

1. **`src/modules/`** — one folder per path (`sql/`, `pyspark/`, …).
2. **Shared components** in `src/components/` or `src/components/module-shell/` — sidebar, breadcrumbs, progress slot, premium gate UI.
3. **SQL module** is the reference implementation; future modules copy the same shell.
4. **Coming soon paths** render the same shell with a locked/ teaser state — not a different page template.
5. **No path-specific navbar forks.** One nav driven by `learningPaths.ts`.

---

## Folder Structure (V1 target)

```
sql-interview-prep/
├── docs/
│   └── MASTER_PROMPT.md          # This file
├── firestore.rules               # Production-grade security rules
├── functions/                    # Firebase Cloud Functions
│   └── src/
│       ├── payments/
│       │   ├── createOrder.ts
│       │   ├── verifyPayment.ts
│       │   └── razorpayWebhook.ts
│       └── lib/
│           └── logger.ts         # Structured logging (no secrets)
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── modules/
│   │   ├── sql/                  # Live module
│   │   ├── auth/
│   │   ├── billing/
│   │   └── marketing/            # Home, pricing, learning paths, error pages
│   ├── components/               # Shared UI + module shell + skeletons
│   ├── lib/
│   │   ├── firebase/
│   │   └── design-tokens/
│   ├── data/
│   │   ├── learningPaths.ts      # Single source of truth
│   │   ├── sheets.ts
│   │   └── questions/            # TypeScript question banks
│   ├── hooks/
│   ├── types/
│   └── ...
├── vercel.json                   # Security headers
├── .env.example                  # Placeholders only — never real secrets
├── .env.development              # Local dev (gitignored)
├── .env.staging                  # Staging (gitignored)
├── .env.production               # Production (gitignored)
└── firebase.json
```

---

## Content: Questions in TypeScript

- Keep existing structure: `src/data/questions/*.ts`, aggregated in `index.ts`.
- Each question includes: title, difficulty, question, answer, optional example SQL.
- **Never migrate questions to Firestore in V1.**
- Premium gating is enforced in the frontend **using Firestore plan status** + question/sheet metadata flags — not by hiding content in the database.

---

## Authentication (V1)

| Feature | V1 |
|---------|-----|
| Google Login | ✅ |
| Email / password | ❌ |
| GitHub OAuth | ❌ |
| OTP | ❌ |

### Flow

1. User clicks **Sign in with Google**.
2. Firebase Auth completes OAuth.
3. On first login, create/update `users/{uid}` in Firestore.
4. Protected routes read auth state from Firebase; premium routes also read `plan` from Firestore.

---

## Firestore Schema

**Collection:** `users/{uid}`

```typescript
{
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: Timestamp
  lastLoginAt: Timestamp
  plan: 'free' | 'premium'
  subscription: {
    status: 'active' | 'expired' | 'cancelled' | 'none'
    razorpaySubscriptionId?: string
    razorpayPlanId?: string
    currentPeriodEnd?: Timestamp
    updatedAt: Timestamp
  }
}
```

**Store only:** user profile, subscription status, payment metadata.  
**Never store:** questions, answers, blog posts, or CMS content in V1.

---

## Firestore Security Rules (mandatory)

Implement production-grade rules in **`firestore.rules`**. These decisions override any ambiguity elsewhere.

### Requirements

- Users can **read and update only their own** `users/{uid}` document.
- Users must **never** read or write another user's document.
- **`plan` and `subscription` fields cannot be modified from the client** — ever.
- Subscription and payment metadata may be **written only by trusted Cloud Functions** (Admin SDK) after successful Razorpay verification.
- Payment metadata is **read-only from the client** (user may read their own subscription summary).
- **Deny every write by default** unless explicitly allowed.
- Follow the **Principle of Least Privilege**.

### Allowed client writes (users/{uid})

On create/login, the client may set **only** non-privileged profile fields:

- `email`, `displayName`, `photoURL`, `createdAt`, `lastLoginAt`

The client must **not** set or update: `plan`, `subscription`, or any payment fields.

### Reference rules (implement and extend)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;

      allow create: if request.auth != null
        && request.auth.uid == userId
        && !('plan' in request.resource.data)
        && !('subscription' in request.resource.data);

      allow update: if request.auth != null
        && request.auth.uid == userId
        && !request.resource.data.diff(resource.data).affectedKeys()
            .hasAny(['plan', 'subscription']);

      allow delete: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

All privileged updates (`plan`, `subscription`, payment metadata) go through **Cloud Functions with Admin SDK only**.

---

## Payments: Razorpay (mandatory server verification)

### Payment flow (the only acceptable flow)

```
User
  ↓
Google Login
  ↓
Buy Premium (Pricing page)
  ↓
Razorpay checkout
  ↓
Firebase Cloud Function verifies signature
  ↓
Firestore user.plan = 'premium' + subscription metadata
  ↓
Premium content unlocked
```

### Forbidden flow

```
Razorpay success callback on frontend
  ↓
localStorage.premium = true   ❌ NEVER
```

### Cloud Functions endpoints (V1)

| Function | Purpose |
|----------|---------|
| `createRazorpayOrder` | Create order/subscription server-side |
| `verifyRazorpayPayment` | Verify payment signature after checkout |
| `razorpayWebhook` | Handle subscription lifecycle events |

- Validate Razorpay signatures on the server.
- Update Firestore **only** after verification.
- Frontend re-fetches user doc after payment — never self-grants premium.

---

## Free vs Premium (V1 entitlements)

### Free tier (enough value to build trust)

- SQL Basics
- Some Joins content
- Some Aggregations content
- Search (within free content)
- Pricing page
- Learning Paths overview (including Coming Soon cards)

### Premium tier

- SQL Master Sheet
- Company-wise questions
- Advanced SQL content
- Premium notes
- Reserved/early-access placeholders for future paths (PySpark, Spark, ADF, Databricks, etc.)

Implement gating via metadata on sheets/questions (e.g. `tier: 'free' | 'premium'`) combined with Firestore `plan`.

---

## Environment Strategy (mandatory)

Maintain **three separate environments**. Never mix development and production credentials.

| Environment | Purpose |
|-------------|---------|
| **Development** | Local work, Firebase emulators optional |
| **Staging** | Pre-production testing, Razorpay test mode |
| **Production** | Live users, Razorpay live mode |

Each environment has its **own**:

- Firebase project
- Firestore database
- Cloud Functions deployment
- Razorpay keys (test vs live)
- Environment variables (frontend + functions)

### Rules

- Use **`.env.example`** with placeholders only — commit this file.
- **`.env.development`**, **`.env.staging`**, **`.env.production`** are gitignored.
- Vercel: separate projects or env scopes per environment.
- Firebase: separate project IDs per environment (`VITE_FIREBASE_PROJECT_ID`, etc.).
- Document environment setup in README when V1 is implemented.

---

## Logging Strategy (mandatory)

Implement production-ready structured logging in Cloud Functions (`functions/src/lib/logger.ts`).

### Log these events

- Authentication-related function triggers (where applicable)
- Login failures (client-side auth errors surfaced to monitoring)
- Cloud Function execution (start, success, failure)
- Razorpay verification attempts and outcomes
- Subscription updates (plan changes, expiry, cancellation)
- Unexpected exceptions (with stack traces server-side)

### Never log

- Secrets, API keys, webhook secrets
- Access tokens, ID tokens, refresh tokens
- Razorpay key secrets
- Personal payment information (full card/UPI details, etc.)

Logs must be useful for **production troubleshooting** without exposing sensitive data.

---

## Error Pages (mandatory)

Create polished, branded error and state pages under **`src/modules/marketing/errors/`** (or equivalent). All must follow InterviewMaster AI branding, design tokens, and premium UI quality bar.

| Page | Route / trigger |
|------|-----------------|
| **404** | Unknown routes |
| **403** | Unauthorized / forbidden |
| **500** | Unexpected app errors |
| **Offline** | Network unavailable (PWA-style detection optional) |
| **Payment Failed** | Razorpay checkout failure |
| **Subscription Expired** | Premium lapsed — upsell to renew |
| **Coming Soon** | Locked learning paths (reuse across modules) |

Each page includes: clear headline, helpful copy, primary CTA (home, pricing, retry), consistent nav/footer where appropriate.

---

## V1 Feature Scope (Prompt 2)

When implementing V1, build **only** this list:

- [ ] Home page (premium SaaS hero, social proof, path grid, trust badges)
- [ ] Learning paths page (from `learningPaths.ts`)
- [ ] SQL module (reuse existing questions + module shell)
- [ ] Pricing page (beautiful pricing cards, premium CTAs)
- [ ] Google Login (Firebase Auth)
- [ ] Firestore user collection + **`firestore.rules`**
- [ ] Razorpay subscription (Cloud Functions + verification)
- [ ] Premium route protection (Firestore-backed)
- [ ] Branded error pages (404, 403, 500, Offline, Payment Failed, Subscription Expired, Coming Soon)
- [ ] Environment strategy (`.env.example` + dev/staging/prod separation)
- [ ] Structured logging in Cloud Functions
- [ ] SEO (dynamic titles, meta, OG, Twitter, robots, sitemap, JSON-LD)
- [ ] Performance (lazy routes, code splitting, bundle optimization, skeleton states)
- [ ] Responsive UI (sticky nav, sidebar, mobile nav)
- [ ] Security headers (vercel.json)
- [ ] Analytics setup (GA + Clarity via env)
- [ ] Premium dark theme + design tokens + Framer Motion
- [ ] `npm run build` passes with zero errors

**Do not start V2** until V1 is reviewed and approved.

---

## SEO Requirements

- Dynamic `<title>` and meta description per route
- OpenGraph tags (title, description, image, url)
- Twitter card tags
- `public/robots.txt`
- `public/sitemap.xml` (or build-time generation)
- Canonical URLs
- JSON-LD for `WebSite` and `Organization` (InterviewMaster AI)
- Brand name **InterviewMaster AI** in all SEO surfaces

---

## Performance Requirements

Target: **Lighthouse 95+** on production (iterate after deploy).

- Route-based code splitting (`React.lazy`)
- Lazy load below-the-fold content
- Optimize bundle size (analyze with `vite build`)
- Asset caching headers via Vercel
- Avoid blocking scripts; defer analytics
- Image optimization where images are used

---

## Security Requirements

### Frontend (Vercel — `vercel.json`)

- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### Backend (Cloud Functions)

- Rate limiting on payment endpoints
- Request validation (schema/type checks)
- Verify Razorpay webhook signatures
- Never expose Razorpay secrets to frontend
- Use Firebase Admin SDK for Firestore writes from functions
- Environment variables for all secrets

### General

- XSS: sanitize user-facing dynamic content; React default escaping
- Auth: Firebase ID token verification on protected function calls
- HTTPS only in production

---

## Analytics

Use environment variables — never hardcode IDs:

```
VITE_GA_MEASUREMENT_ID=
VITE_CLARITY_PROJECT_ID=
```

Load analytics in a privacy-conscious, deferred manner. Do not block initial render.

---

## Coding Standards

- TypeScript strict mode — no `any` without justification
- Functional React components + hooks
- Colocate module code under `src/modules/`
- Shared logic in `src/lib/` and `src/hooks/`
- No placeholder or lorem ipsum in production UI copy
- Meaningful component and file names
- Keep components focused; extract when > ~150 lines
- All new env vars documented in `.env.example`

---

## Environment Variables

> Separate values per **development**, **staging**, and **production**. Never commit real secrets.

### Frontend (`.env.example` — placeholders only)

```
VITE_APP_ENV=development          # development | staging | production
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GA_MEASUREMENT_ID=
VITE_CLARITY_PROJECT_ID=
VITE_RAZORPAY_KEY_ID=             # Public key only — test key in dev/staging
```

### Cloud Functions (Firebase secrets / config per environment)

```
APP_ENV=development
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

---

## V2 Roadmap (do not implement in V1)

| Feature | Notes |
|---------|-------|
| PostgreSQL | Migrate user analytics, progress, bookmarks |
| Admin Panel | CRUD for questions |
| CMS | Markdown/blog management |
| Additional auth | Email, GitHub OAuth |
| Additional payments | Stripe, enterprise billing |
| Mock interviews | Full simulator |
| SQL playground | Sandboxed execution |

Architecture V1 must remain **modular** so V2 adds capabilities without rewriting the module shell or routing.

---

## Implementation Workflow for Cursor

1. **Read this entire document** before writing code.
2. **Read `.cursor/rules/interviewmaster.md`** for condensed rules.
3. Implement **V1 scope only** when given Prompt 2.
4. **Reuse** existing question data and routes where possible; migrate to module shell pattern.
5. Run `npm run build` before marking work complete.
6. Stop and report if a decision would violate this document.

---

## Prompt 2 Template (V1 Implementation)

When ready to build, use:

```
Read and follow docs/MASTER_PROMPT.md completely.

Implement V1 only. Do not start V2.

Build: [list from V1 Feature Scope]

Ensure npm run build passes with zero errors.
Do not leave TODOs.
```

---

*Last updated: architecture lock + final refinements for InterviewMaster AI V1.*
