# 🚀 GitHub Actions FTP Deployment Setup

This guide will help you set up automated FTP deployment using GitHub Actions for your Liquid Glass Todo app.

## 📋 Overview

Every time you push to the `main` (or `production`) branch, GitHub Actions will automatically:
1. ✅ Validate your code
2. 📦 Package your application
3. 🚀 Deploy via FTP to your cPanel hosting
4. 📊 Provide deployment summary

---

## 🔐 Step 1: Configure GitHub Secrets

GitHub Secrets keep your FTP credentials secure. Never commit passwords to your repository!

### How to Add Secrets:

1. **Go to your GitHub repository**
2. **Click on `Settings`** (top menu)
3. **Click on `Secrets and variables`** → **Actions** (left sidebar)
4. **Click `New repository secret`**

### Required Secrets:

Add each of these as a separate secret:

#### **FTP_SERVER**
```
Your FTP hostname
Examples: ftp.yourdomain.com or 192.168.1.1
```

#### **FTP_USERNAME**
```
Your FTP username (usually your cPanel username)
Example: myusername
```

#### **FTP_PASSWORD**
```
Your FTP password
⚠️ Keep this secure! This is why we use secrets.
```

#### **FTP_SERVER_DIR**
```
The directory path on your server
Examples:
  /public_html/                (main domain)
  /public_html/subdomain/      (subdomain)
  /home/username/public_html/  (full path)
```

### Optional Secrets:

#### **FTP_PROTOCOL**
```
Default: ftps
Options: ftp, ftps, ftps-legacy
Use 'ftps' for secure FTP (recommended)
```

#### **FTP_PORT**
```
Default: 21
Only change if your host uses a different port
```

#### **DATABASE_URL**
```
Your PostgreSQL connection string
Example: postgresql://user:pass@localhost:5432/db_name
```

#### **SECRET_KEY**
```
Your Flask secret key for production
Generate at: https://randomkeygen.com/
```

---

## 📝 Step 2: Understanding the Workflow

The workflow file is located at `.github/workflows/deploy-ftp.yml`

### When Does It Run?

**Automatically:**
- On push to `main` branch
- On push to `production` branch

**Manually:**
- Go to `Actions` tab → Select workflow → Click `Run workflow`

### What Does It Do?

1. **Checkout code** - Gets your latest code
2. **Setup Python** - Installs Python 3.11
3. **Install dependencies** - Validates `requirements.txt`
4. **Run validation** - Checks if app imports correctly
5. **Prepare files** - Copies necessary files to deploy folder
6. **Deploy via FTP** - Uploads files to your server
7. **Provide summary** - Shows deployment status

---

## 🎯 Step 3: First Deployment

### Initial Setup:

1. **Add all secrets** to GitHub (see Step 1)
2. **Commit the workflow file** to your repository:
   ```bash
   git add .github/workflows/deploy-ftp.yml
   git commit -m "Add GitHub Actions FTP deployment"
   git push origin main
   ```
3. **Watch the deployment**:
   - Go to your repo → `Actions` tab
   - Click on the running workflow
   - Monitor the progress

### After First Deployment:

1. **Login to cPanel**
2. **Go to "Setup Python App"**
3. **Click "RESTART"** to apply changes
4. **Visit your domain** to verify

---

## 🔄 How to Deploy Updates

### Automatic Deployment:

Simply push to main branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

The deployment will happen automatically!

### Manual Deployment:

1. **Go to GitHub** → Your repository
2. **Click `Actions`** tab
3. **Select "Deploy to cPanel via FTP"** workflow
4. **Click `Run workflow`** → Select branch → **Run workflow**

---

## 📂 Files That Get Deployed

The workflow deploys these files:
```
✅ app.py
✅ config.py
✅ passenger_wsgi.py
✅ requirements.txt
✅ .htaccess
✅ .env (created from secrets or copied)
✅ templates/ folder
✅ static/ folder
```

**Not deployed:**
```
❌ .git/
❌ __pycache__/
❌ *.pyc
❌ .env.example
❌ README.md
❌ documentation files
```

---

## 🛠️ Customization

### Deploy to Different Branch:

Edit `.github/workflows/deploy-ftp.yml`:
```yaml
on:
  push:
    branches:
      - production  # Change this to your branch name
```

### Deploy to Subdomain:

Update `FTP_SERVER_DIR` secret:
```
/public_html/subdomain/
```

### Change Python Version:

Edit the workflow:
```yaml
- name: Setup Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.10'  # Change version here
```

---

## 🔍 Monitoring Deployments

### View Deployment Status:

1. **Go to `Actions` tab** in your repository
2. **Click on a workflow run** to see details
3. **Expand each step** to see logs

### Deployment Success:

```
✅ All steps green
✓ Files deployed successfully
```

### Deployment Failed:

```
❌ Red X on failed step
Check logs for error details
```

---

## 🆘 Troubleshooting

### ❌ "FTP connection failed"

**Cause:** Wrong credentials or server unreachable

**Fix:**
1. Verify `FTP_SERVER` secret is correct
2. Check `FTP_USERNAME` and `FTP_PASSWORD`
3. Try changing `FTP_PROTOCOL` to `ftp` (not secure but may work)
4. Contact hosting provider to verify FTP is enabled

### ❌ "Permission denied"

**Cause:** FTP user lacks write permissions

**Fix:**
1. Check FTP user has write permissions in cPanel
2. Verify `FTP_SERVER_DIR` path is correct
3. Try without leading slash: `public_html/` instead of `/public_html/`

### ❌ "Import failed" during validation

**Cause:** Missing dependency or syntax error

**Fix:**
1. Test locally: `python app.py`
2. Check `requirements.txt` has all dependencies
3. Fix any Python syntax errors
4. Push fix and retry

### ❌ "Secret not found"

**Cause:** GitHub Secret not configured

**Fix:**
1. Go to Settings → Secrets → Actions
2. Add the missing secret
3. Re-run workflow

---

## 🔐 Security Best Practices

### ✅ Do:
- Use `ftps` protocol (secure FTP)
- Keep secrets in GitHub Secrets (never in code)
- Use strong passwords
- Rotate FTP passwords periodically
- Use separate FTP account for deployments

### ❌ Don't:
- Commit `.env` file with real credentials
- Share your FTP password
- Use `dangerous-clean-slate: true` (deletes everything!)
- Commit secrets to repository
- Use plain `ftp` protocol if `ftps` available

---

## 📊 Advanced Features

### Auto-Restart App After Deploy:

Add this to your workflow after FTP deploy step:

```yaml
- name: Auto-restart Python app
  run: |
    sshpass -p "${{ secrets.FTP_PASSWORD }}" \
    ssh ${{ secrets.FTP_USERNAME }}@${{ secrets.FTP_SERVER }} \
    "touch ~/tmp/restart.txt"
```

*Note: Requires SSH access (not available on all shared hosting)*

### Deploy Only Changed Files:

The workflow already uses incremental deployment. Only changed files are uploaded.

### Slack/Discord Notifications:

Add notification step:

```yaml
- name: Notify deployment
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 💡 Tips

1. **Test locally first** before pushing to GitHub
2. **Use branches** for development, deploy from `main` only
3. **Monitor first few deployments** to catch issues early
4. **Check cPanel Python app** status after deployment
5. **Restart app in cPanel** after first deployment

---

## 📞 Getting Help

### Check These First:
- ✅ All secrets configured correctly
- ✅ FTP credentials work (test with FileZilla)
- ✅ Server directory path is correct
- ✅ Workflow file syntax is valid
- ✅ GitHub Actions is enabled for your repo

### Still Having Issues?

1. **View workflow logs** in Actions tab
2. **Test FTP connection** manually with FileZilla
3. **Contact your hosting provider** about FTP settings
4. **Check GitHub Actions documentation** for deployment help

---

## ✅ Quick Setup Checklist

Before first deployment:

- [ ] Created GitHub repository
- [ ] Added `FTP_SERVER` secret
- [ ] Added `FTP_USERNAME` secret
- [ ] Added `FTP_PASSWORD` secret
- [ ] Added `FTP_SERVER_DIR` secret
- [ ] Added `DATABASE_URL` secret (optional)
- [ ] Added `SECRET_KEY` secret (optional)
- [ ] Committed workflow file
- [ ] Pushed to main branch
- [ ] Monitored deployment in Actions tab
- [ ] Restarted Python app in cPanel
- [ ] Verified app is working

---

## 🎉 Success!

Once configured, your deployments are fully automated! Every push to `main` will:

1. ✅ Validate your code
2. 🚀 Deploy to your server
3. 📊 Show you the results

**No more manual FTP uploads!** 🎊

---

## 📚 Related Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Manual deployment guide
- [CPANEL_SETUP.md](CPANEL_SETUP.md) - cPanel configuration
- [QUICK_START.md](QUICK_START.md) - Quick deployment reference
- [README.md](README.md) - Main documentation

---

**Happy Deploying!** 🚀✨
