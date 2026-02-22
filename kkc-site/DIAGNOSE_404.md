# Diagnosing 404 Error on Vercel

## Most Common Causes (Check These First!)

### 1. ✅ Root Directory Not Set (90% of cases)

**Check this FIRST:**

In Vercel Dashboard:
1. Go to **Project Settings** → **General**
2. Look at **Root Directory** field
3. If it says `./` or is empty → **THIS IS THE PROBLEM!**
4. Change it to: `kkc-site`
5. Click **Save**
6. **Redeploy** (go to Deployments → Click "..." → Redeploy)

**Why:** Your GitHub repo structure is:
```
KKC/
  └── kkc-site/
      ├── src/
      ├── package.json
      └── ...
```

Vercel needs to know to look in the `kkc-site` folder!

---

### 2. ✅ Build is Failing Silently

**Check Build Logs:**

1. Go to Vercel Dashboard → Your Deployment
2. Click **"Build Logs"** tab
3. Look for:
   - ❌ Red errors
   - ⚠️ Yellow warnings
   - "Build failed" messages

**Common Build Errors:**
- Missing environment variables
- TypeScript errors
- Import errors
- Missing dependencies

---

### 3. ✅ Test Direct Routes

Try accessing these URLs directly (replace with your domain):

- `https://kkc-deploy.vercel.app/en` ← Should work if routing is OK
- `https://kkc-deploy.vercel.app/rw` ← Should work
- `https://kkc-deploy.vercel.app/en/products` ← Test nested route

**If `/en` works but `/` doesn't:**
- Root redirect issue (proxy.ts or vercel.json)

**If `/en` also gives 404:**
- Root directory or build issue

---

### 4. ✅ Check Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

**Required:**
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`

**Missing env vars can cause build to fail!**

---

### 5. ✅ Proxy.ts Migration Issue

We just migrated from `middleware.ts` to `proxy.ts`. If this broke things:

**Check if proxy.ts is working:**
- Look in build logs for proxy-related errors
- Try reverting to middleware.ts temporarily

---

## Quick Diagnostic Steps

### Step 1: Check Root Directory
```bash
# In Vercel Dashboard → Settings → General
# Root Directory should be: kkc-site
```

### Step 2: Check Build Logs
```bash
# In Vercel Dashboard → Deployments → Click latest → Build Logs
# Look for errors
```

### Step 3: Test Routes
```bash
# Try these URLs:
https://your-domain.vercel.app/en
https://your-domain.vercel.app/rw
```

### Step 4: Check Function Logs
```bash
# In Vercel Dashboard → Deployments → Click latest → Logs
# Look for runtime errors
```

---

## Most Likely Solution

**99% chance it's the Root Directory:**

1. Vercel Dashboard → Project Settings → General
2. Set **Root Directory** to: `kkc-site`
3. Save
4. Redeploy

This fixes 90% of 404 errors!
