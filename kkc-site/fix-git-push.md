# Fix Git Push (Remove .next and node_modules from Git)

Your push failed because **kkc-site/.next** (and possibly node_modules) were committed—that's ~202 MB and caused the timeout.

## Run these commands from your repo root (D:\KKC)

### 1. Stop tracking .next and node_modules (keeps files on disk)
```powershell
cd D:\KKC
git rm -r --cached kkc-site/.next
git rm -r --cached kkc-site/node_modules
```
If you get "did not match any files" for node_modules, that's OK—only .next might be tracked.

### 2. Commit the cleanup
```powershell
git add kkc-site/.gitignore
git commit -m "Stop tracking .next and node_modules, fix .gitignore"
```

### 3. Push again (will be much smaller)
```powershell
git push -u origin main
```

## Optional: Increase Git buffer if push still times out
```powershell
git config http.postBuffer 524288000
```
Then try `git push -u origin main` again.

## After this
- Future builds will not commit .next or node_modules.
- Vercel runs `npm run build` on their servers, so they don't need your .next folder.
