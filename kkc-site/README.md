## KKC Quincaillerie Website (Next.js)

Premium, modern, responsive website for **KKC Quincaillerie** (Kigali – Gisozi, Rwanda) with:

- Next.js App Router + Tailwind CSS + Framer Motion
- English / Kinyarwanda (`/en`, `/rw`) via `next-intl`
- Firebase Authentication (Google-only)
- Firestore products + favorites
- Role-based admin dashboard at `/[locale]/admin` (no ecommerce checkout)

## Getting Started

Install deps and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Firebase setup (required for login/admin)

1) Create a Firebase project.

2) Enable **Authentication → Sign-in method → Google**.

3) Create Firestore database.

4) (Optional) Enable **Storage** for product image upload.

5) Create `.env.local` from `.env.example` and fill:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Admin role & default admin

**Default admin credentials** (after running the setup script below):

- **Email:** `shyakayvany@gmail.com`
- **Password:** `shyaka1234`

Admin access is controlled via a Firestore document:

- Collection: `roles`
- Document ID: the user’s Firebase `uid`
- Fields: `{ "role": "admin", "admin": true }`

### One-time setup: create admin user and role

1. In Firebase Console enable **Authentication → Sign-in method → Email/Password**.
2. Create a **service account key**: Project Settings → Service accounts → “Generate new private key” → save the JSON file as `scripts/firebase-service-account.json` (this path is in `.gitignore`).
3. Install dev dependency (if not already): `npm install firebase-admin --save-dev`
4. From the project root, run:

   **Windows (PowerShell):**
   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS = "D:\KKC\kkc-site\scripts\firebase-service-account.json"
   $env:FIREBASE_PROJECT_ID = "your-firebase-project-id"
   node scripts/create-admin.js
   ```

   **macOS/Linux:**
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=./scripts/firebase-service-account.json FIREBASE_PROJECT_ID=your-firebase-project-id node scripts/create-admin.js
   ```

   Use your actual Firebase project ID (same as in `.env.local`).

5. Sign in on the site with **Admin sign-in** using the email and password above; you’ll have access to the Dashboard and `/admin`.

## WhatsApp product chat

Product cards use:

`https://wa.me/250788318876?text=Hello%20KKC,%20I%20am%20interested%20in%20[PRODUCT_NAME]`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

Set `NEXT_PUBLIC_SITE_URL` (recommended) and deploy to Vercel or your preferred platform.
