# Changelog

All notable changes to InterviewMaster AI (ProdFyl) will be documented in this file.

---

## v1.1.0 - Razorpay Payments
Date: 2026-07-06

### Added
- Razorpay one-time Orders checkout (monthly ₹499 / yearly ₹4,999)
- Firebase Cloud Functions: `createRazorpayOrder`, `verifyRazorpayPayment`, `recoverPendingPayment`, `razorpayWebhook`
- Firebase Secret Manager for `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- Shared `processPremiumGrant()` with Firestore transaction idempotency
- `payments/{paymentId}` audit collection
- `users/{uid}/orders/{orderId}` pending order tracking
- Order ownership verification (`order.notes.uid === auth.uid`)
- Payment recovery on login and pricing page (`recoverPendingPayment`)
- Premium summary on `users/{uid}` (`plan`, `subscription.status`, `currentPeriodEnd`, `lastPaymentId`)
- Firestore security rules for `payments/` collection
- Firestore composite index for order recovery queries
- Payment error handling (failed, cancelled, duplicate verify, recovery)
- Recover Pending Payment button on pricing page

### Security
- Server-side amount calculation only
- HMAC payment verification
- Webhook signature verification
- Rate limiting on payment endpoints
- Structured logging without secrets

---

## v1.0.0 - Production Authentication Foundation
Date: 2026-07-05

### Added
- Firebase Authentication
- Google Sign-In
- Firestore integration
- Persistent login sessions
- User avatar with fallback initials
- Premium-ready authentication architecture
- Vercel production deployment
- Custom domain (prodfyl.com)
- Environment variable configuration
- GitHub repository and CI/CD deployment

### Fixed
- Firebase configuration issues
- Google profile avatar fallback
- Content Security Policy (CSP) for Google Sign-In
- Production authentication flow
