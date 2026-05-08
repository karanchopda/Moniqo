# 🔐 GitHub Authentication Setup

## ⚠️ Authentication Required

You're getting a 403 error because GitHub needs to verify your identity.

---

## 🚀 Quick Solution (Recommended)

### Option 1: Use GitHub CLI (Easiest)

#### Step 1: Install GitHub CLI
```bash
# On macOS
brew install gh
```

#### Step 2: Authenticate
```bash
gh auth login
```

Follow the prompts:
1. Choose: **GitHub.com**
2. Choose: **HTTPS**
3. Authenticate with: **Login with a web browser**
4. Copy the code shown
5. Press Enter to open browser
6. Paste code and authorize

#### Step 3: Push
```bash
git push -u origin main
```

---

## Option 2: Personal Access Token (Classic Method)

### Step 1: Create Token
1. Go to: https://github.com/settings/tokens
2. Click: **Generate new token** → **Generate new token (classic)**
3. Note: "Moniqo Development"
4. Expiration: 90 days (or your preference)
5. Select scopes:
   - ✅ **repo** (Full control of private repositories)
6. Click: **Generate token**
7. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Configure Git Credential Helper
```bash
# Store credentials
git config --global credential.helper store
```

### Step 3: Push (will prompt for credentials)
```bash
git push -u origin main
```

When prompted:
- **Username**: karanchopda
- **Password**: [PASTE YOUR TOKEN HERE]

The token will be saved for future use.

---

## Option 3: SSH Keys (Most Secure)

### Step 1: Generate SSH Key
```bash
# Generate key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Press Enter to accept default location
# Press Enter twice for no passphrase (or set one)
```

### Step 2: Add to SSH Agent
```bash
# Start agent
eval "$(ssh-agent -s)"

# Add key
ssh-add ~/.ssh/id_ed25519
```

### Step 3: Copy Public Key
```bash
# Copy to clipboard
cat ~/.ssh/id_ed25519.pub | pbcopy

# Or display it
cat ~/.ssh/id_ed25519.pub
```

### Step 4: Add to GitHub
1. Go to: https://github.com/settings/keys
2. Click: **New SSH key**
3. Title: "Mac Mini - Moniqo Development"
4. Key: Paste your public key
5. Click: **Add SSH key**

### Step 5: Change Remote to SSH
```bash
# Remove HTTPS remote
git remote remove origin

# Add SSH remote
git remote add origin git@github.com:karanchopda/Moniqo.git

# Push
git push -u origin main
```

---

## 🎯 Recommended: GitHub CLI

**Why?**
- ✅ Easiest to set up
- ✅ Most secure
- ✅ Handles authentication automatically
- ✅ Works with 2FA
- ✅ No manual token management

**Install and authenticate in 2 minutes:**
```bash
brew install gh
gh auth login
git push -u origin main
```

---

## 🔍 Verify Authentication

After setting up, test with:
```bash
# Test connection
git push -u origin main
```

You should see:
```
Enumerating objects: ...
Counting objects: 100% ...
Writing objects: 100% ...
To https://github.com/karanchopda/Moniqo.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🐛 Troubleshooting

### Still getting 403?
- Make sure you're logged into the correct GitHub account
- Verify the repository exists: https://github.com/karanchopda/Moniqo
- Check you have write access to the repository

### Token not working?
- Make sure you selected the `repo` scope
- Copy the entire token (no spaces)
- Token should start with `ghp_`

### SSH not working?
- Test SSH connection: `ssh -T git@github.com`
- Should see: "Hi karanchopda! You've successfully authenticated"

---

## ✅ After Successful Push

You'll see your code at:
**https://github.com/karanchopda/Moniqo**

With:
- ✅ 3 commits
- ✅ 148 files
- ✅ 29,153 lines of code
- ✅ Complete documentation

---

## 🎊 Next Steps After Push

1. **Verify on GitHub**: Visit https://github.com/karanchopda/Moniqo
2. **Add Description**: "AI-powered financial analysis platform"
3. **Add Topics**: ai, finance, nextjs, nodejs, openai, typescript
4. **Set to Private**: If not already (Settings → Danger Zone)
5. **Invite Collaborators**: If working with a team

---

**Choose your authentication method above and push your code!** 🚀
