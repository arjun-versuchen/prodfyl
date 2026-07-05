# InterviewMaster AI

Premium Data Engineering interview preparation platform. **SQL is live** with 130+ curated questions. Additional learning paths (PySpark, Spark, Azure, Databricks, and more) are scaffolded as Coming Soon modules.

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router
- **Auth:** Firebase Authentication (Google)
- **Database:** Cloud Firestore (users, subscriptions, payment metadata only)
- **Backend:** Firebase Cloud Functions (Razorpay)
- **Content:** TypeScript question files (not stored in Firestore)
- **Hosting:** Vercel (frontend), Firebase (functions + Firestore rules)

## Features (V1)

- Premium dark UI with design tokens
- Modular learning path architecture (`/learn/:pathSlug/...`)
- SQL sheets with free/premium gating
- Google sign-in + Firestore user profiles
- Razorpay checkout with server-side verification
- Branded error pages, SEO, analytics hooks, security headers

## Prerequisites

- Node.js 20+
- Firebase project (dev/staging/prod recommended separately)
- Razorpay account (test mode for staging)
- Vercel account (for frontend deploy)

## Local setup

1. **Clone and install**

```bash
cd sql-interview-prep
npm install
npm install --prefix functions
```

2. **Environment variables**

```bash
cp .env.example .env.development
```

Fill in Firebase and optional analytics/Razorpay public key values.

3. **Firebase setup**

- Create a Firebase project
- Enable **Google** sign-in in Authentication
- Create a Firestore database
- Deploy rules:

```bash
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules
```

4. **Cloud Functions secrets**

```bash
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
```

Deploy functions:

```bash
firebase deploy --only functions
```

Configure Razorpay webhook URL to your deployed `razorpayWebhook` endpoint.

5. **Run locally**

```bash
npm run dev
```

Open `http://localhost:5173`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm --prefix functions run build` | Compile Cloud Functions |

## Deployment

### Frontend (Vercel)

1. Import the repository in Vercel
2. Set environment variables from `.env.example`
3. Deploy — `vercel.json` applies security headers automatically
4. Update `VITE_SITE_URL`, `public/sitemap.xml`, and `public/robots.txt` with your production domain

### Firebase

```bash
firebase deploy --only firestore:rules,functions
```

## Environment variables

### Frontend (Vercel / `.env.*`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_APP_ENV` | Yes | `development`, `staging`, or `production` |
| `VITE_SITE_URL` | Yes | Public site URL for SEO/canonical links |
| `VITE_FIREBASE_API_KEY` | Yes | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | e.g. `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `VITE_RAZORPAY_KEY_ID` | For payments | Razorpay **public** key |
| `VITE_GA_ID` | Optional | Google Analytics measurement ID |
| `VITE_CLARITY_ID` | Optional | Microsoft Clarity project ID |

### Cloud Functions (Firebase secrets)

| Secret | Description |
|--------|-------------|
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook signing secret |

## Free vs Premium

**Free:** SQL Basics, first 8 questions in Joins & Aggregations sheets, search within free content, learning paths, pricing.

**Premium:** Master Sheet, company-wise questions, advanced SQL sheets, premium notes, full mixed sheets.

Premium is granted **only** after Cloud Function payment verification updates Firestore.

## Architecture notes

- Single source of truth for paths: `src/data/learningPaths.ts`
- Shared module shell: `src/components/module-shell/ModuleShell.tsx`
- Access rules: `src/lib/access.ts`
- Master architecture doc: `docs/MASTER_PROMPT.md`

## License

Private — InterviewMaster AI.
