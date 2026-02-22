# Fixing 404 Error on Vercel

## The Problem
Your app uses `next-intl` with locale routing (`/en`, `/rw`), so the root `/` needs to redirect to `/en`. The 404 error suggests Vercel isn't handling this correctly.

## Solution 1: Check Root Directory (MOST COMMON ISSUE)

If your GitHub repository structure is:
```
your-repo/
  └── kkc-site/
      ├── src/
      ├── package.json
      └── ...
```

Then in Vercel Dashboard:
1. Go to **Project Settings** → **General**
2. Under **Root Directory**, click **Edit**
3. Set it to: `kkc-site`
4. Click **Save**
5. **Redeploy** the project

## Solution 2: Verify Build Settings

In Vercel Dashboard → Project Settings → General, verify:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (or leave empty for auto-detect)
- **Output Directory:** `.next` (or leave empty for auto-detect)
- **Install Command:** `npm install` (or leave empty for auto-detect)

## Solution 3: Check Build Logs

1. Go to your deployment in Vercel Dashboard
2. Click on **Build Logs**
3. Look for any errors or warnings
4. Common issues:
   - Missing environment variables
   - Build failures
   - TypeScript errors

## Solution 4: Test Locale Routes Directly

Try accessing these URLs directly:
- `https://kkc-deploy.vercel.app/en`
- `https://kkc-deploy.vercel.app/rw`

If these work but `/` doesn't, the redirect isn't working.

## Solution 5: Force Redeploy

1. In Vercel Dashboard → Deployments
2. Click the **"..."** menu on the latest deployment
3. Click **Redeploy**
4. Wait for build to complete

## Solution 6: Check Environment Variables

Make sure all required environment variables are set:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Quick Fix Checklist

- [ ] Root Directory is set correctly in Vercel (probably `kkc-site`)
- [ ] Build logs show no errors
- [ ] Environment variables are all set
- [ ] Try accessing `/en` directly (should work)
- [ ] Redeploy after making changes

## If Still Not Working

1. Check the **Function Logs** in Vercel Dashboard
2. Check browser console for client-side errors
3. Verify the build output exists in `.next` folder
4. Try accessing a specific route like `/en/products` to see if routing works
