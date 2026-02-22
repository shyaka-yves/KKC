# Quick Deploy Guide - Vercel

## 🚀 Fastest Way to Deploy (5 minutes)

### Step 1: Push to GitHub
```bash
cd kkc-site
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kkc-site.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up/login (use GitHub)

2. **Click "Add New Project"**

3. **Import your repository** (select `kkc-site`)

4. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (or leave default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

5. **Add Environment Variables:**
   
   Click "Environment Variables" and add these **one by one**:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID
   ADMIN_EMAIL
   ADMIN_PASSWORD
   ```

   **Important:** 
   - Get Firebase values from Firebase Console → Project Settings → Your apps
   - Set `ADMIN_EMAIL` to your admin email (default: `shyakayvany@gmail.com`)
   - Set `ADMIN_PASSWORD` to your admin password (default: `shyaka1234`)

6. **Click "Deploy"**

### Step 3: Wait for Build (~2-3 minutes)

Vercel will:
- Install dependencies
- Build your Next.js app
- Deploy to a global CDN
- Give you a URL like: `https://kkc-site.vercel.app`

### Step 4: Configure Firebase

After deployment, you need to:

1. **Add your Vercel domain to Firebase:**
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add: `kkc-site.vercel.app` and `*.vercel.app`

2. **Create Firestore Index:**
   - Firebase Console → Firestore → Indexes → Create Index
   - Collection: `products`
   - Fields: `visible` (Ascending), `featured` (Ascending), `updatedAt` (Descending)

3. **Update Firestore Security Rules** (see DEPLOYMENT.md)

### Step 5: Test Your Site

Visit your Vercel URL and test:
- ✅ Home page loads
- ✅ Featured products section (if you have featured products)
- ✅ Products page
- ✅ About page (with vision & mission)
- ✅ Admin login at `/en/admin` or `/rw/admin`

---

## 🔄 Automatic Deployments

Every time you push to GitHub, Vercel automatically:
- Builds your site
- Runs tests (if configured)
- Deploys to production
- Creates preview URLs for pull requests

---

## 🌐 Custom Domain (Optional)

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `kkc-quincaillerie.com`)
3. Follow DNS instructions
4. SSL certificate is automatic!

---

## 📊 Monitoring

- **Analytics:** Vercel Dashboard → Analytics (free tier available)
- **Logs:** Vercel Dashboard → Deployments → Click any deployment → View Logs
- **Performance:** Built-in Core Web Vitals tracking

---

## 🆘 Troubleshooting

**Build fails?**
- Check build logs in Vercel Dashboard
- Ensure all environment variables are set
- Verify Firebase config is correct

**Site loads but Firebase doesn't work?**
- Check browser console for errors
- Verify Firebase environment variables are set
- Check Firebase authorized domains

**Admin login doesn't work?**
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set correctly
- Check API route logs in Vercel Dashboard

---

## 💰 Cost

**Free Tier Includes:**
- Unlimited personal projects
- 100GB bandwidth/month
- Automatic SSL
- Global CDN
- Preview deployments

**Perfect for:** Small to medium businesses, portfolios, MVPs

---

## ✅ Done!

Your site is now live! Share the Vercel URL with your team and customers.
