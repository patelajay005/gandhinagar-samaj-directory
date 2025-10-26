# 🔐 Fix Git Authentication Error (403)

## The Error
```
remote: Permission to patelajay005/gandhinagar-samaj-directory.git denied to patelajay005.
fatal: unable to access 'https://github.com/patelajay005/gandhinagar-samaj-directory.git/': The requested URL returned error: 403
```

## What's Happening?
- GitHub is rejecting your cached credentials
- Windows Credential Manager has outdated/incorrect GitHub credentials
- You need to either clear credentials OR use Personal Access Token

## 🔧 Solutions

### ⭐ Solution 1: Use Personal Access Token (RECOMMENDED - 2 minutes)

This is the fastest and most reliable method.

#### Step 1: Create GitHub Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `Gandhinagar Samaj App`
4. Expiration: Choose duration (or "No expiration" for convenience)
5. Select scopes:
   - ✅ **repo** (check this - it checks all sub-items automatically)
6. Scroll down and click **"Generate token"**
7. **⚠️ COPY THE TOKEN NOW** (starts with `ghp_...`) - You can't see it again!

#### Step 2: Update Git Remote URL with Token
```powershell
# Replace YOUR_TOKEN with the token you just copied
git remote set-url origin https://patelajay005:YOUR_TOKEN@github.com/patelajay005/gandhinagar-samaj-directory.git
```

Example:
```powershell
# If your token is ghp_abc123xyz456...
git remote set-url origin https://patelajay005:ghp_abc123xyz456@github.com/patelajay005/gandhinagar-samaj-directory.git
```

#### Step 3: Push to GitHub
```powershell
git push -u origin main
```

✅ **Done!** Your code should now be on GitHub!

--- ---

### Solution 2: Clear Windows Credential Manager (Manual)

If you prefer to clear cached credentials:

#### Using GUI (Easiest):
1. Press **Windows Key** and type: `Credential Manager`
2. Click **"Credential Manager"** (Control Panel)
3. Click **"Windows Credentials"**
4. Look for entries starting with:
   - `git:https://github.com`
   - `GitHub - https://api.github.com`
5. Click on each → **Remove** → **Yes**
6. Try pushing again:
   ```powershell
   git push -u origin main
   ```
7. Enter your GitHub username: `patelajay005`
8. Enter password: Use **Personal Access Token** (not your GitHub password!)

#### Using PowerShell:
```powershell
# List GitHub credentials
cmdkey /list | Select-String "github"

# Delete the main GitHub credential
cmdkey /delete:"LegacyGeneric:target=git:https://github.com"

# Try pushing again
git push -u origin main
```

---

### Solution 3: Use SSH Instead of HTTPS

1. **Check if you have SSH key**:
   ```powershell
   ls ~/.ssh
   ```

2. **If no SSH key, generate one**:
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   Press Enter for all prompts

3. **Add SSH key to GitHub**:
   ```powershell
   # Copy your public key
   cat ~/.ssh/id_ed25519.pub
   ```
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your public key
   - Click "Add SSH key"

4. **Update remote to use SSH**:
   ```powershell
   # For your account
   git remote set-url origin git@github.com:PatelAjayTR/gandhinagar-samaj-directory.git
   
   # OR for patelajay005 (if you have access)
   git remote set-url origin git@github.com:patelajay005/gandhinagar-samaj-directory.git
   ```

5. **Push**:
   ```powershell
   git push -u origin main
   ```

### Solution 4: Clear Cached Credentials

If you have old credentials cached:

```powershell
# Clear Windows Credential Manager
git config --global --unset credential.helper
git config --system --unset credential.helper

# Or use Windows Credential Manager GUI
# Control Panel → Credential Manager → Windows Credentials
# Remove any GitHub credentials

# Then try push again (it will ask for new credentials)
git push -u origin main
```

## 🎯 Quick Fix (Most Common)

Most likely you want to push to YOUR account (`PatelAjayTR`):

```powershell
# 1. Create repo on GitHub: https://github.com/new
# 2. Update remote URL
git remote set-url origin https://github.com/PatelAjayTR/gandhinagar-samaj-directory.git

# 3. Verify
git remote -v

# 4. Push
git push -u origin main
```

## ✅ Verify Remote URL

After changing, verify it's correct:
```powershell
git remote -v
```

Should show:
```
origin  https://github.com/YOUR_USERNAME/gandhinagar-samaj-directory.git (fetch)
origin  https://github.com/YOUR_USERNAME/gandhinagar-samaj-directory.git (push)
```

## 🆘 Still Having Issues?

Share the output of:
```powershell
git remote -v
git config --list | Select-String "user"
```

---

**Next Step**: Choose Solution 1 and push to your own GitHub account!
