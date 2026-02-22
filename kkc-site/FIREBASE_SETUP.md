# Firebase Setup for Production (Vercel)

## 1. Fix Images Disappearing

Images disappear because **Firebase Storage** requires authentication to upload, but the admin dashboard uses a cookie-based login (not Firebase Auth). Storage rejects unauthenticated uploads.

### Solution A: Sign in with Google Before Adding Products (Recommended)

1. On your live site, click **Login** (top right)
2. Sign in with **Google**
3. Then go to **Dashboard** and log in with your admin email/password
4. Now when you add products with images, you're authenticated with Firebase and uploads will work

### Solution B: Update Firebase Storage Rules

If you want image uploads to work without signing in with Google:

1. Go to [Firebase Console](https://console.firebase.google.com) → Your Project
2. Click **Storage** → **Rules** tab
3. Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read (for displaying product images)
    match /products/{allPaths=**} {
      allow read: if true;
      // Allow write for product images (adjust for production - consider requiring auth)
      allow write: if true;
    }
    // Block everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click **Publish**

**Note:** `allow write: if true` lets anyone upload. For production, use:
```javascript
allow write: if request.auth != null;
```
Then admins must sign in with Google before uploading.

---

## 2. Enable Google Login on HTTPS (Vercel)

Google Sign-In works on HTTPS. You need to add your Vercel domain to Firebase.

### Steps

1. Go to [Firebase Console](https://console.firebase.google.com) → Your Project
2. Click **Authentication** (build icon in left menu)
3. Click **Settings** tab → **Authorized domains**
4. Click **Add domain**
5. Add these domains:
   - `kkc-deploy.vercel.app` (or your actual Vercel domain)
   - `*.vercel.app` (covers preview deployments)
6. Click **Add**

### Verify Google Sign-In is Enabled

1. **Authentication** → **Sign-in method** tab
2. Click **Google**
3. Ensure it's **Enabled**
4. Add your Support email and Project public-facing name if not set
5. Click **Save**

### Test

1. Go to your live site
2. Click **Login**
3. Click **Continue with Google**
4. Sign in — it should work now

---

## 3. Firestore Security Rules (Reference)

Ensure your Firestore rules allow reads for products and writes for admins:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/roles/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == 'admin';
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/roles/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == 'admin';
    }
    match /users/{userId}/favorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /roles/{userId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

---

## Quick Checklist

- [ ] Add Vercel domain to Firebase **Authorized domains**
- [ ] Enable **Google** in Authentication → Sign-in method
- [ ] Update **Storage** rules to allow product image uploads
- [ ] Sign in with Google before adding products with images (if using `request.auth != null` in Storage rules)
