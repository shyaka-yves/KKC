# Deployment Guide for KKC Quincaillerie Website

## Recommended: Vercel (Best for Next.js)

Vercel is made by the Next.js team and offers the best integration and performance for Next.js applications.

### Prerequisites
- A GitHub, GitLab, or Bitbucket account
- Your code pushed to a repository
- Firebase project configured

### Step-by-Step Deployment

#### 1. Push Your Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

#### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Add your environment variables (see below)
6. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel
```

#### 3. Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**For Admin Login API Route**, also add:
```
ADMIN_EMAIL=shyakayvany@gmail.com
ADMIN_PASSWORD_HASH=your-bcrypt-hash
```

#### 4. Firebase Firestore Indexes

After deployment, you'll need to create a composite index for featured products:

1. Go to Firebase Console → Firestore → Indexes
2. Click "Create Index"
3. Collection: `products`
4. Fields:
   - `visible` (Ascending)
   - `featured` (Ascending)
   - `updatedAt` (Descending)
5. Click "Create"

#### 5. Firebase Security Rules

Update Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - readable by all, writable by admins only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/roles/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Categories - readable by all, writable by admins only
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/roles/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User favorites
    match /users/{userId}/favorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Roles - readable by authenticated users, writable by admins only
    match /roles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/roles/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Vercel Benefits
- ✅ Free tier (hobby plan)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push
- ✅ Preview deployments for PRs
- ✅ Built-in analytics
- ✅ Zero configuration needed

---

## Alternative: Netlify

### Deployment Steps

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build Configuration**
Create `netlify.toml` in project root (see below)

3. **Deploy**
```bash
netlify login
netlify init
netlify deploy --prod
```

4. **Add Environment Variables**
Netlify Dashboard → Site Settings → Environment Variables

---

## Alternative: Firebase Hosting

Since you're already using Firebase, you can host on Firebase Hosting:

### Steps

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Firebase Hosting**
```bash
firebase init hosting
```

3. **Build Configuration**
- Public directory: `.next`
- Configure as single-page app: No
- Set up automatic builds: Yes

4. **Update firebase.json** (see below)

5. **Build and Deploy**
```bash
npm run build
firebase deploy --only hosting
```

---

## Build Configuration Files

### For Netlify: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

### For Firebase Hosting: `firebase.json`

```json
{
  "hosting": {
    "public": ".next",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Note:** Firebase Hosting works better with static exports. For full Next.js features, Vercel or Netlify are recommended.

---

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Firebase indexes created (for featured products query)
- [ ] Firestore security rules updated
- [ ] Firebase Storage rules configured (if using image uploads)
- [ ] Custom domain configured (optional)
- [ ] Admin user created and tested
- [ ] Test product creation/editing
- [ ] Test featured products display
- [ ] Test multi-language switching

---

## Cost Comparison

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| **Vercel** | 100GB bandwidth/month | $20/month (Pro) |
| **Netlify** | 100GB bandwidth/month | $19/month (Pro) |
| **Firebase Hosting** | 10GB storage, 360MB/day | Pay-as-you-go |

---

## Recommendation

**Use Vercel** - It's the easiest, most reliable option for Next.js projects with excellent developer experience and free tier that's perfect for this project.
