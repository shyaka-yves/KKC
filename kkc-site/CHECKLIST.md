# 🚨 404 Error - Step-by-Step Fix Checklist

## ⚠️ MOST IMPORTANT: Check Root Directory FIRST!

### Step 1: Fix Root Directory (Do This First!)

1. Open **Vercel Dashboard**
2. Go to your project: **kkc-deploy**
3. Click **Settings** (gear icon)
4. Click **General** tab
5. Scroll to **Root Directory**
6. Click **Edit**
7. Change from `./` to: **`kkc-site`**
8. Click **Save**
9. **Redeploy** (Deployments → "..." → Redeploy)

**This fixes 90% of 404 errors!**

---

## Step 2: Verify Build Success

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Build Logs** tab
4. Check for:
   - ✅ Green "Build Completed" message
   - ❌ Any red errors
   - ⚠️ Any warnings

**If build failed:**
- Check error messages
- Verify environment variables are set
- Check TypeScript errors

---

## Step 3: Test Direct Routes

Try these URLs (replace with your actual domain):

```
https://kkc-deploy.vercel.app/en
https://kkc-deploy.vercel.app/rw
https://kkc-deploy.vercel.app/en/products
```

**Results:**
- ✅ If `/en` works → Root directory or redirect issue
- ❌ If `/en` also 404 → Build or root directory issue

---

## Step 4: Check Environment Variables

Vercel Dashboard → Settings → Environment Variables

**Must have all 8:**
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`

**Missing vars = Build failure = 404**

---

## Step 5: Check Function Logs

1. Deployments → Latest deployment
2. Click **Logs** tab (not Build Logs)
3. Look for runtime errors

---

## Quick Test: Try Accessing /en Directly

If `https://your-domain.vercel.app/en` works but `/` doesn't:
- ✅ Routing works
- ❌ Root redirect issue (proxy.ts)

If `/en` also gives 404:
- ❌ Root directory or build issue

---

## Most Common Fix

**Set Root Directory to `kkc-site` in Vercel Settings → General**

This is almost always the problem!
