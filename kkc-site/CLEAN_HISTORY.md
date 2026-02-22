# Clean Git History - Remove Large Files

The `.next` folder is still in your Git history, causing the 202 MB push. Here are solutions:

## Option 1: Use Git Filter-Repo (Recommended)

### Install git-filter-repo
```powershell
# Install via pip (if you have Python)
pip install git-filter-repo

# Or download from: https://github.com/newren/git-filter-repo
```

### Remove .next from all history
```powershell
cd D:\KKC
git filter-repo --path kkc-site/.next --invert-paths
git push origin --force --all
```

## Option 2: Use BFG Repo-Cleaner (Easier)

### Download BFG
1. Download from: https://rtyley.github.io/bfg-repo-cleaner/
2. Save as `bfg.jar` in `D:\KKC`

### Remove .next from history
```powershell
cd D:\KKC
java -jar bfg.jar --delete-folders .next
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

## Option 3: Fresh Start (Simplest - if you don't need history)

If you don't need the commit history, create a fresh repository:

```powershell
cd D:\KKC
# Backup current code
Copy-Item -Recurse kkc-site kkc-site-backup

# Remove .git
Remove-Item -Recurse -Force .git

# Initialize fresh repo
git init
git add .
git commit -m "Initial commit - cleaned"
git remote add origin https://github.com/shyaka-yves/KKC.git
git push -u origin main --force
```

## Option 4: Push via SSH (Sometimes faster)

If you have SSH keys set up:

```powershell
cd D:\KKC
git remote set-url origin git@github.com:shyaka-yves/KKC.git
git push -u origin main
```

## Option 5: Use GitHub CLI (gh)

```powershell
# Install GitHub CLI first
gh repo sync shyaka-yves/KKC
```

---

## Recommended: Option 3 (Fresh Start)

Since this is a new project and you don't need the old commit history with large files, **Option 3 is the simplest and fastest**.
