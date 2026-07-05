# InterviewMaster AI — Razorpay Payment Architecture (V1.1)

> **Status:** Implemented in v1.1.0. See `CHANGELOG.md` and `README.md` for deployment.
> **Parent doc:** `docs/MASTER_PROMPT.md`  
> **V1 payment model:** One-time Razorpay **Orders** only — **not** Razorpay Subscriptions API.

---

## Overview

InterviewMaster AI V1 payments use **one-time Razorpay Orders** to unlock **30-day (monthly)** or **365-day (yearly)** premium access stored in Firestore. Premium is never granted on the frontend alone.

This document refines the scaffolded payment flow with four production requirements:

1. **Firebase Secret Manager** for Razorpay credentials  
2. **Idempotency** — the same payment cannot grant premium twice  
3. **Order ownership verification** — `order.notes.uid === request.auth.uid`  
4. **`payments/{paymentId}` audit collection** — immutable payment history  

---

## V1 payment model (locked)

| Topic | V1 decision |
|-------|-------------|
| Razorpay API | **Orders API** (`razorpay.orders.create`) |
| Razorpay Subscriptions API | **Not used in V1** |
| Premium duration | 30 days (monthly) / 365 days (yearly) — computed server-side |
| Renewal | Manual repurchase when `currentPeriodEnd` passes (expiry job optional in V1.1) |
| Webhook events | `payment.captured` and/or `order.paid` only |

Do **not** implement `subscription.*` webhook handlers in V1 — they belong to a future Subscriptions migration (V2+).

---

## Architecture diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│ FRONTEND (Vercel)                                                        │
│  PricingPage → createRazorpayOrder → openRazorpayCheckout → verify       │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ Firebase Callable / HTTPS
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ CLOUD FUNCTIONS (secrets via Firebase Secret Manager)                    │
│                                                                          │
│  createRazorpayOrder                                                     │
│    → Razorpay Orders API (notes: { uid, plan })                          │
│                                                                          │
│  verifyRazorpayPayment                                                   │
│    → HMAC verify → fetch order → uid match → idempotent grant            │
│                                                                          │
│  razorpayWebhook                                                         │
│    → webhook HMAC → idempotent grant (backup path)                       │
│                                                                          │
│  processPremiumGrant (internal, shared)                                  │
│    → Firestore transaction on payments/{paymentId}                       │
│    → grant users/{uid} if not already completed                          │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ Admin SDK
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ FIRESTORE                                                                │
│  users/{uid}           — plan + subscription (client read-only premium)  │
│  payments/{paymentId}  — audit trail (Admin write, user read own)        │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ refreshProfile()
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ FRONTEND gating — AuthContext.isPremium ← Firestore only                 │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Firebase Secret Manager (not plain `process.env`)

### Requirement

Razorpay secrets **must not** rely on unbound `process.env` in production. Use **Firebase Functions v2 Secret Manager** via `defineSecret()`.

### Secrets (per environment: dev / staging / prod)

| Secret name | Used by |
|-------------|---------|
| `RAZORPAY_KEY_ID` | `createRazorpayOrder`, returned as public `keyId` to checkout |
| `RAZORPAY_KEY_SECRET` | Order API, payment HMAC verification, optional order fetch |
| `RAZORPAY_WEBHOOK_SECRET` | `razorpayWebhook` signature verification |

### Implementation pattern (when coding)

```typescript
import { defineSecret } from 'firebase-functions/params'

const razorpayKeyId = defineSecret('RAZORPAY_KEY_ID')
const razorpayKeySecret = defineSecret('RAZORPAY_KEY_SECRET')
const razorpayWebhookSecret = defineSecret('RAZORPAY_WEBHOOK_SECRET')

export const createRazorpayOrder = onCall(
  { secrets: [razorpayKeyId, razorpayKeySecret], cors: true },
  async (request) => {
    const keySecret = razorpayKeySecret.value()
    // ...
  },
)
```

### Setup commands (per Firebase project)

```bash
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
```

### Frontend

- **No Razorpay secrets** on Vercel.  
- `keyId` for checkout comes **only** from `createRazorpayOrder` response.  
- Remove unused `VITE_RAZORPAY_KEY_ID` from implementation (or stop documenting it as required).

---

## 2. Idempotency (same payment processed once)

### Problem

Both `verifyRazorpayPayment` and `razorpayWebhook` can fire for the same payment. Retries, double-clicks, or network retries must not double-grant or corrupt state.

### Solution

Use **`payments/{paymentId}`** as the idempotency key (Razorpay `payment_id` is globally unique).

### Shared internal function: `processPremiumGrant`

All grant paths **must** call one function:

```
processPremiumGrant({
  paymentId,
  orderId,
  uid,
  plan,
  amount,
  currency,
  source: 'verify' | 'webhook',
})
```

### Firestore transaction (mandatory)

```
BEGIN TRANSACTION
  paymentRef = payments/{paymentId}

  IF paymentRef.exists AND paymentRef.status == 'completed'
    RETURN existing result (success, already processed)

  IF paymentRef.exists AND paymentRef.status == 'processing'
    RETURN conflict / retry later

  WRITE paymentRef {
    uid, orderId, plan, amount, currency,
    status: 'completed',
    source,
    createdAt, completedAt
  }

  UPDATE users/{uid} {
    plan: 'premium',
    subscription: { status: 'active', currentPeriodEnd, ... }
  }
COMMIT
```

### Callable / webhook behavior

| Scenario | Response |
|----------|----------|
| First successful grant | `{ success: true, plan: 'premium' }` |
| Duplicate `paymentId` already `completed` | `{ success: true, alreadyProcessed: true }` — no error to user |
| Invalid signature / uid mismatch | Fail — do not write payment doc |

---

## 3. Order ownership verification

### Requirement

Before granting premium in **`verifyRazorpayPayment`**, the backend must prove the order belongs to the authenticated user.

### Steps (verify callable only)

1. Require `request.auth` (Firebase ID token).  
2. Verify payment HMAC: `HMAC(orderId|paymentId, KEY_SECRET)`.  
3. **Fetch order from Razorpay:** `razorpay.orders.fetch(orderId)`.  
4. Assert:
   - `order.notes.uid === request.auth.uid`
   - `order.notes.plan === request.data.plan`
   - `order.amount === PLANS[plan].amount`
   - `order.status` is `paid` (or cross-check payment entity)  
5. Only then call `processPremiumGrant(...)`.

### Webhook path

- Verify webhook signature.  
- On `payment.captured` / `order.paid`: read `payment.entity.notes.uid` and `payment.entity.order_id`.  
- Run same ownership + amount checks against fetched order.  
- Call `processPremiumGrant` (idempotent).

### Threat model addressed

Without this check, a malicious client could pass another user's valid `paymentId` + `signature` tuple and unlock premium on their account.

---

## 4. `payments/{paymentId}` audit collection

### Purpose

- Idempotency key  
- Payment history / dispute debugging  
- Future admin dashboard (V2)  
- No PII beyond uid, orderId, amounts  

### Schema

**Collection:** `payments/{paymentId}`  
(`paymentId` = Razorpay `pay_xxx` id)

```typescript
{
  uid: string                    // Firebase user who paid
  orderId: string                // Razorpay order_id
  plan: 'monthly' | 'yearly'
  amount: number                 // paise
  currency: 'INR'
  status: 'completed' | 'failed'
  source: 'verify' | 'webhook'
  razorpayPaymentId: string      // same as document ID
  razorpayOrderId: string        // duplicate for queries
  createdAt: Timestamp
  completedAt: Timestamp
  failureReason?: string         // if status failed
}
```

### Firestore security rules

```javascript
match /payments/{paymentId} {
  // Users may read their own payment history
  allow read: if request.auth != null
    && resource.data.uid == request.auth.uid;

  // All writes: Admin SDK only (Cloud Functions)
  allow create, update, delete: if false;
}
```

### `users/{uid}` subscription fields (unchanged intent)

Keep summary on user doc for fast premium checks:

```typescript
subscription: {
  status: 'active' | 'expired' | 'none'
  razorpayPlanId: 'monthly' | 'yearly'
  razorpayOrderId?: string
  razorpayPaymentId?: string      // latest successful payment
  currentPeriodEnd?: Timestamp
  updatedAt: Timestamp
}
```

Remove `razorpaySubscriptionId` from V1 schema (Subscriptions API not used). Full history lives in `payments/`.

---

## 5. Cloud Functions (V1.1)

| Function | Type | Secrets | Responsibility |
|----------|------|---------|----------------|
| `createRazorpayOrder` | Callable | KEY_ID, KEY_SECRET | Auth, rate limit, create order with `notes.uid` + `notes.plan` |
| `verifyRazorpayPayment` | Callable | KEY_ID, KEY_SECRET | HMAC verify, fetch order, uid match, idempotent grant |
| `razorpayWebhook` | HTTPS | WEBHOOK_SECRET | Verify signature, handle `payment.captured` / `order.paid`, idempotent grant |
| `processPremiumGrant` | Internal module | — | Transaction: `payments/` + `users/` |

### Webhook events (V1 only)

| Event | Action |
|-------|--------|
| `payment.captured` | `processPremiumGrant` if notes valid |
| `order.paid` | Optional backup — same grant path |
| `subscription.*` | **Ignore in V1** |

---

## 6. End-to-end flow (updated)

```
1. User signs in (Google) → users/{uid} created
2. User clicks Get Premium on /pricing
3. Frontend: createRazorpayOrder({ plan })
   Backend: Razorpay order created with notes { uid, plan }
4. Frontend: Razorpay Checkout opens (keyId from step 3)
5. User pays
6. Frontend handler receives payment_id + signature
7. Frontend: verifyRazorpayPayment({ orderId, paymentId, signature, plan })
   Backend:
     a. Verify HMAC
     b. Fetch Razorpay order → assert notes.uid === auth.uid
     c. processPremiumGrant (transaction, idempotent)
8. Frontend: refreshProfile() → isPremium true
9. (Parallel) Webhook payment.captured → same processPremiumGrant
   → no-op if paymentId already completed
10. Premium SQL content unlocks via access.ts
```

---

## 7. How this fits the existing codebase

| Existing file | Change at implementation time |
|---------------|-------------------------------|
| `functions/src/lib/razorpay.ts` | Read secrets via `defineSecret().value()`, add `fetchOrder(orderId)` |
| `functions/src/lib/firestore.ts` | Replace `grantPremiumAccess` with transactional `processPremiumGrant` |
| `functions/src/payments/verifyPayment.ts` | Add order fetch + uid check before grant |
| `functions/src/payments/webhook.ts` | Remove `subscription.*` handlers; use idempotent grant only |
| `functions/src/payments/createOrder.ts` | Bind secrets; keep order notes |
| `firestore.rules` | Add `payments/{paymentId}` read-own rules |
| `src/lib/firebase/payments.ts` | No secret changes; handle `alreadyProcessed` in response |
| `src/modules/marketing/PricingPage.tsx` | Treat idempotent success same as first success |

**No frontend architecture change** — still: Callable → Checkout → Callable → refreshProfile.

---

## 8. Production checklist (before go-live)

- [ ] Secrets set in each Firebase project (dev / staging / prod)  
- [ ] Functions deployed with secret bindings  
- [ ] Razorpay webhook URL points to `razorpayWebhook` (staging test keys first)  
- [ ] Firestore rules deployed including `payments/`  
- [ ] Test: pay once → premium granted  
- [ ] Test: replay verify with same paymentId → no double grant, success returned  
- [ ] Test: verify with wrong uid order → rejected  
- [ ] CSP allows `checkout.razorpay.com` (already in `vercel.json`)  

---

## 9. Explicitly out of scope (V1)

- Razorpay Subscriptions API  
- Auto-renewal billing  
- `subscription.cancelled` webhooks  
- Admin payment dashboard (V2)  
- PostgreSQL payment migration (V2)  

---

*Last updated: Razorpay architecture refinement pre-implementation.*
