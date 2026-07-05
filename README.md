# InterviewMaster AI (ProdFyl)

Premium Data Engineering interview preparation platform. **SQL is live** with 130+ curated questions. Production: [https://prodfyl.com](https://prodfyl.com)

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router (Vercel)
- **Auth:** Firebase Authentication (Google)
- **Database:** Cloud Firestore
- **Backend:** Firebase Cloud Functions + Firebase Secret Manager
- **Payments:** Razorpay Orders API (one-time orders, 30/365-day premium)
- **Content:** TypeScript question files (not stored in Firestore)

## Payment architecture

See **`docs/RAZORPAY_ARCHITECTURE.md`** for the full spec.

```
Pricing → createRazorpayOrder → Razorpay Checkout → verifyRazorpayPayment
       → processPremiumGrant (Firestore transaction)
       → payments/{paymentId} + users/{uid}
       → refreshProfile → premium unlocked
```

Backup paths: **webhook** (`payment.captured`, `order.paid`) and **recoverPendingPayment** (browser closed after pay).

---

## Prerequisites

- Node.js 20+
- Firebase CLI (`npm i -g firebase-tools`)
- Firebase project per environment (dev / staging / prod)
- Razorpay account (test mode for staging)
- Vercel account

---

## Local setup

```bash
git clone <repo>
cd sql-interview-prep
npm install
npm install --prefix functions
cp .env.example .env.development
# Fill VITE_FIREBASE_* values
npm run dev
```

---

## Firebase Secret Manager (Razorpay)

Set secrets **per Firebase project** (never commit, never put in Vercel):

```bash
firebase login
firebase use <your-project-id>

firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
```

Functions bind secrets via `defineSecret()` in `functions/src/lib/secrets.ts`.

---

## Firestore deploy

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Collections:

| Collection | Purpose |
|------------|---------|
| `users/{uid}` | Profile + premium summary (`plan`, `subscription`) |
| `users/{uid}/orders/{orderId}` | Pending order tracking for recovery |
| `payments/{paymentId}` | Audit trail + idempotency |

---

## Cloud Functions deploy

```bash
npm run functions:build
firebase deploy --only functions
```

Exported functions:

| Function | Type | Purpose |
|----------|------|---------|
| `createRazorpayOrder` | Callable | Create Razorpay order with `notes.uid` + `notes.plan` |
| `verifyRazorpayPayment` | Callable | HMAC verify + order ownership + grant premium |
| `recoverPendingPayment` | Callable | Recover paid orders if verify never ran |
| `razorpayWebhook` | HTTPS | Backup grant on `payment.captured` / `order.paid` |

---

## Razorpay dashboard configuration

1. Use **Test Mode** keys for staging, **Live Mode** for production.
2. Copy Key ID + Key Secret into Firebase Secret Manager (not frontend).
3. Create a **Webhook** pointing to:

```
https://<region>-<firebase-project-id>.cloudfunctions.net/razorpayWebhook
```

Find your exact URL after deploy:

```bash
firebase functions:list
```

4. Enable webhook events:
   - `payment.captured`
   - `order.paid`

5. Copy the webhook **secret** into `RAZORPAY_WEBHOOK_SECRET`.

---

## Vercel deployment (frontend)

1. Import repo in Vercel
2. Set all `VITE_*` variables from `.env.example`
3. Set `VITE_SITE_URL=https://prodfyl.com` (production)
4. Deploy — security headers from `vercel.json` include Razorpay CSP entries

**No Razorpay secrets on Vercel.** Checkout receives public `keyId` from `createRazorpayOrder`.

---

## Environment variables

### Frontend (Vercel / `.env.development`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_APP_ENV` | Yes | `development`, `staging`, `production` |
| `VITE_SITE_URL` | Yes | Public URL (`https://prodfyl.com`) |
| `VITE_FIREBASE_*` | Yes | Firebase web config (6 vars) |
| `VITE_GA_ID` | Optional | Google Analytics |
| `VITE_CLARITY_ID` | Optional | Microsoft Clarity |

### Cloud Functions (Firebase Secret Manager)

| Secret | Description |
|--------|-------------|
| `RAZORPAY_KEY_ID` | Razorpay Key ID (test or live) |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signing secret from Razorpay dashboard |

---

## Manual testing checklist

- [ ] Google Sign-In works on production
- [ ] Signed-in user opens `/pricing`
- [ ] `createRazorpayOrder` returns order + keyId (Firebase Functions logs)
- [ ] Razorpay Checkout opens and completes (test card in test mode)
- [ ] `verifyRazorpayPayment` grants premium in Firestore
- [ ] `payments/{paymentId}` document created with `status: completed`
- [ ] `users/{uid}.plan === 'premium'` and `subscription.status === 'active'`
- [ ] Premium SQL sheets unlock after refresh
- [ ] Replay verify with same payment → `alreadyProcessed: true`, no duplicate grant
- [ ] Pay → close browser → login → `recoverPendingPayment` unlocks premium
- [ ] Webhook fires → idempotent grant (check Functions logs)
- [ ] Payment failure routes to `/payment/failed`
- [ ] `npm run build` and `npm run functions:build` pass

### Razorpay test card (test mode)

- Card: `4111 1111 1111 1111`
- Expiry: any future date
- CVV: any 3 digits

---

## Free vs Premium

**Free:** SQL Basics, first 8 Qs in Joins/Aggregations, search within free content.

**Premium:** Master Sheet, company questions, advanced SQL, premium notes (30 or 365 days).

Premium is granted **only** by Cloud Functions writing Firestore — never client-side.

---

## Architecture docs

- `docs/MASTER_PROMPT.md` — platform blueprint
- `docs/RAZORPAY_ARCHITECTURE.md` — payment spec
- `.cursor/rules/interviewmaster.md` — Cursor rules

## License

Private — InterviewMaster AI.
