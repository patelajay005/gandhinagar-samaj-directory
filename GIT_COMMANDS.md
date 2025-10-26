# Git & GitHub Quick Commands

## 🎯 Your Project is Ready!

✅ Git repository initialized  
✅ 2 commits made  
✅ All files tracked  
✅ Ready to push to GitHub  

## 🚀 Push to GitHub (3 Steps)

### Step 1: Create GitHub Repository
Go to: https://github.com/new
- Name: `gandhinagar-samaj-directory`
- Description: `Community member directory with Google Sheets integration`
- Public or Private: Your choice
- **Don't initialize with README** (we already have one)
- Click "Create repository"

### Step 2: Add Remote & Push
Copy your repository URL and run:

```powershell
# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/gandhinagar-samaj-directory.git

# Rename branch to main (GitHub standard)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Verify
- Go to your GitHub repository
- You should see all 32 files!

## 📝 Daily Git Commands

### Making Changes
```powershell
# Check what changed
git status

# See specific changes
git diff

# Stage all changes
git add .

# Stage specific file
git add src/components/AddMember.tsx

# Commit changes
git commit -m "Your descriptive message"

# Push to GitHub
git push
```

### Viewing History
```powershell
# View commit history
git log --oneline

# View last 5 commits
git log --oneline -5

# View detailed history
git log
```

### Branches
```powershell
# Create new branch
git branch feature-name

# Switch to branch
git checkout feature-name

# Create and switch
git checkout -b feature-name

# List all branches
git branch

# Merge branch to main
git checkout main
git merge feature-name
```

## 🔄 Sync with GitHub

### Pull Latest Changes
```powershell
# Pull from GitHub (if others are working)
git pull

# Pull from specific branch
git pull origin main
```

### Check Remote
```powershell
# View remote URL
git remote -v

# Change remote URL
git remote set-url origin NEW_URL
```

## 🆘 Undo Changes

### Before Commit
```powershell
# Undo all changes
git restore .

# Undo specific file
git restore src/App.tsx

# Unstage file
git restore --staged file.txt
```

### After Commit
```powershell
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

## 🏷️ Tags & Releases

```powershell
# Create tag
git tag v1.0.0

# Push tag to GitHub
git push origin v1.0.0

# Push all tags
git push --tags

# List tags
git tag
```

## 📊 Current Repository Status

**Branch**: master (will rename to `main` when pushing)  
**Commits**: 2  
**Files Tracked**: 32  
**Remote**: None yet (will add GitHub)  

**Latest Commits**:
1. `a3521f2` - Add GitHub setup guide and update documentation
2. `8892251` - Initial commit: Gandhinagar Morbi Samaj Directory app

## 🎓 Git Best Practices

1. ✅ **Commit Often**: Small, focused commits
2. ✅ **Write Clear Messages**: Describe what changed and why
3. ✅ **Pull Before Push**: Avoid conflicts
4. ✅ **Use Branches**: Keep main branch stable
5. ✅ **Review Before Commit**: Use `git status` and `git diff`

## 📚 Learn More

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- Interactive Learning: https://learngitbranching.js.org

---

**Next Step**: Follow PUSH_TO_GITHUB.md to push your code to GitHub! 🚀
