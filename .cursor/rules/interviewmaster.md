---
description: InterviewMaster AI — locked architecture and V1 rules. Read docs/MASTER_PROMPT.md before any implementation.
alwaysApply: true
---

# InterviewMaster AI — Cursor Rules

Before implementing anything, read **`docs/MASTER_PROMPT.md`** in full.

## Product & goal

- **Name:** InterviewMaster AI (never "SQL Interview Prep")
- **Platform:** Multi-path Data Engineering interview prep; SQL is first live module
- **Feel:** Premium SaaS (Vercel, Linear, Stripe, Clerk) + CodeWithAryan **content density only** — do NOT copy CodeWithAryan's UI
- **Goal:** Professional platform worth paying for; grows with new learning paths over time

## Locked stack (V1)

```
Vercel → React + Vite + TS + Tailwind + Framer Motion
  → Firebase Auth (Google only)
  → Firestore (users, subscriptions, payment metadata ONLY)
  → firestore.rules (production-grade, least privilege)
  → Firebase Cloud Functions (Razorpay ONLY)
  → Questions in src/data/questions/*.ts
  → learningPaths.ts = single source of truth
```

**Do not use:** Express/Render, PostgreSQL, Shadcn, Stripe, GitHub auth, Firestore for questions.

## Hard rules

1. Extend existing project — **no rebuild from scratch**
2. Questions in **TypeScript only** — never Firestore
3. Premium via **Firestore after server verification** — never `localStorage`
4. **`plan` / `subscription` client-writable = forbidden** — Functions + Admin SDK only
5. Backend = **Firebase Cloud Functions only**
6. **No TODOs** in shipped V1
7. **Design tokens only** — no hardcoded colors (primary, secondary, accent, surface, background, card, border, muted, warning, success, info)
8. **Premium dark theme** — not a generic Tailwind dashboard
9. **Three environments** — dev / staging / prod — separate Firebase + Razorpay + env vars; never mix credentials
10. **Do not start V2** unless explicitly asked

## UI quality bar

Framer Motion, skeleton loaders, empty states, premium lock illustrations, sticky nav, responsive sidebar + mobile nav, pricing cards, trust badges, glassmorphism sparingly. Never feel like template/CRUD/college project.

## Module contract

- **`src/data/learningPaths.ts`** drives home, nav, sidebar, routes
- Same shell for every path: `/learn/:pathSlug/...`
- Code under **`src/modules/`** — SQL is reference implementation

## Firestore

- `users/{uid}` — profile + subscription summary (client cannot write `plan` / `subscription`)
- `payments/{paymentId}` — audit + idempotency (Admin write only; user read own)

## Payments (V1 — see `docs/RAZORPAY_ARCHITECTURE.md`)

- **One-time Razorpay Orders only** — 30-day / 365-day premium; **no** Razorpay Subscriptions API in V1
- Secrets via **Firebase Secret Manager** (`defineSecret`) — not plain `process.env`
- **Idempotency:** `payments/{paymentId}` transaction — same payment never grants twice
- **Ownership:** fetch order → `order.notes.uid === request.auth.uid` before grant
- Flow: Google Login → create order → Checkout → verify → idempotent grant → Firestore → premium unlocked
- Never `localStorage` for premium

## V1 scope

Home, Learning Paths, SQL module, Pricing, Google Auth, Firestore + rules, Razorpay + Functions, premium guards, error pages, env strategy, logging, SEO, perf, security headers, analytics, dark theme + tokens + motion, `npm run build` zero errors.

## V2 (later)

PostgreSQL, Admin Panel, CMS
