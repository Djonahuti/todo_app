# 🎛️ cPanel Python App Configuration Guide

## Quick Setup for Shared Hosting (No SSH Required)

This guide is specifically for **shared hosting cPanel** users who don't have SSH/terminal access.

---

## 🚀 Quick Start (5 Steps)

### Step 1: Upload Files via FTP

**Using FileZilla (or any FTP client):**

1. Connect to FTP:
   ```
   Host: ftp.yourdomain.com
   Username: your_cpanel_username
   Password: your_cpanel_password
   Port: 21
   ```

2. Navigate to `/public_html/` (or your subdomain folder)

3. Upload ALL files from your local project:
   ```
   ✅ app.py
   ✅ passenger_wsgi.py (REQUIRED!)
   ✅ .htaccess (REQUIRED!)
   ✅ requirements.txt
   ✅ config.py
   ✅ .env
   ✅ templates/ folder
   ✅ static/ folder
   ```

---

### Step 2: Create PostgreSQL Database

1. **Login to cPanel**
2. **Find "PostgreSQL Databases"**
3. **Create Database:**
   - Database Name: `todo_db` (will become `username_todo_db`)
   - Click "Create Database"

4. **Create User:**
   - Username: `todouser` (will become `username_todouser`)
   - Password: **Generate Strong Password** ⚠️ SAVE THIS!
   - Click "Create User"

5. **Add User to Database:**
   - Select User: `username_todouser`
   - Select Database: `username_todo_db`
   - Click "Add"
   - Grant **ALL PRIVILEGES**
   - Click "Make Changes"

---

### Step 3: Setup Python Application

1. **In cPanel, find "Setup Python App"** (or "Python Selector")

2. **Click "Create Application"**

3. **Fill in the form:**

   | Field | Value |
   |-------|-------|
   | **Python version** | 3.11 (or highest available, minimum 3.7) |
   | **Application root** | `/home/username/public_html` (or your path) |
   | **Application URL** | `yourdomain.com` (or subdomain) |
   | **Application startup file** | `passenger_wsgi.py` |
   | **Application Entry point** | `application` |

4. **Click "CREATE"**

---

### Step 4: Install Dependencies

**Option A: Upload requirements.txt**

1. In "Setup Python App" page
2. Scroll to **"Configuration Files"** section
3. Click **"Browse"** and select `requirements.txt`
4. Click **"RUN PIP INSTALL"**
5. Wait for installation to complete

**Option B: Manual Installation**

In the **"RUN PIP INSTALL"** field, paste each line and click "RUN":

```
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
psycopg2-binary==2.9.9
Werkzeug==3.0.1
SQLAlchemy==2.0.23
python-dotenv==1.0.0
```

---

### Step 5: Configure Environment Variables

**Edit your `.env` file via FTP:**

```env
DATABASE_URL=postgresql://username_todouser:YOUR_PASSWORD@localhost:5432/username_todo_db
SECRET_KEY=your-random-secret-key-here
FLASK_ENV=production
FLASK_DEBUG=False
```

**Replace:**
- `username_todouser` → Your actual database username (with prefix)
- `YOUR_PASSWORD` → The password you saved from Step 2
- `username_todo_db` → Your actual database name (with prefix)
- `your-random-secret-key-here` → Generate at https://randomkeygen.com/

**Upload the edited `.env` file via FTP**

---

## ✅ Restart & Test

1. **In cPanel → Setup Python App**
2. **Click "RESTART"** button
3. **Visit your domain:** `https://yourdomain.com`
4. **You should see the Liquid Glass Todo app! 🎉**

---

## 🔧 Common cPanel Configurations

### Different Hosting Providers

#### **Bluehost / HostGator:**
```
Python version: Available in "Software" section
Path format: /home1/username/public_html/
Database prefix: username_
```

#### **GoDaddy:**
```
Python: Called "Python Manager"
Path: /home/username/public_html/
Database: PostgreSQL available in "Databases"
```

#### **Namecheap:**
```
Python: "Setup Python App" in Software
Path: /home/username/public_html/
Database: PostgreSQL in "Databases" section
```

#### **A2 Hosting:**
```
Python: "Setup Python App"
Path: /home/username/public_html/
Supports newer Python versions (3.10+)
```

---

## 🎯 File Structure on Server

Your files should be organized like this on the server:

```
/home/username/public_html/
│
├── 📄 passenger_wsgi.py        ← Entry point (REQUIRED)
├── 📄 .htaccess                ← URL routing (REQUIRED)
├── 📄 app.py                   ← Main application
├── 📄 config.py                ← Configuration
├── 📄 requirements.txt         ← Dependencies
├── 📄 .env                     ← Environment variables
│
├── 📁 templates/
│   └── 📄 index.html           ← Main template
│
├── 📁 static/
│   ├── 📄 liquid-glass.css     ← Styles
│   ├── 📄 liquid-glass.js      ← JavaScript
│   └── 📄 todo.css             ← (legacy, can delete)
│
└── 📁 instance/                ← (Only if using SQLite)
    └── 📄 todos.db             ← SQLite database
```

---

## 🔐 Security Best Practices

### File Permissions (Set via FTP):

```
Files (.py, .css, .js):    644
Folders:                   755
.htaccess:                 644
.env:                      600 or 644
```

### Protect Sensitive Files

The included `.htaccess` already protects:
- `.env` files
- `.py` source files
- `.log` files

### Change Default Secret Key

**Never use default SECRET_KEY in production!**

Generate a secure key:
```python
# Run this in Python console (or online Python compiler)
import secrets
print(secrets.token_hex(32))
```

Copy the result to your `.env` file.

---

## 🐛 Debugging in cPanel

### View Application Logs

1. **cPanel → Setup Python App**
2. **Click on your application**
3. **Scroll to "LOGS" section**
4. **Click "View Log"**

Common errors you'll see here:
- Import errors (missing dependencies)
- Database connection errors
- Configuration errors

### View Error Logs

1. **cPanel → Metrics → Errors**
2. **View the latest errors**
3. Look for Python/Passenger errors

### View PostgreSQL Logs

1. **cPanel → PostgreSQL Databases**
2. **Check connection errors**
3. **Verify user privileges**

---

## 🔄 How to Make Updates

### Update Code Files:

1. **Edit files locally**
2. **Upload via FTP** (overwrite existing)
3. **Restart app** in cPanel:
   - Setup Python App → RESTART button

### Update Database Schema:

If you modify database models in `app.py`:

**Option 1: Fresh Start**
```
1. Drop database in cPanel
2. Create new database
3. Restart app (tables auto-create)
```

**Option 2: Manual Migration**
```
1. Connect to database via phpPgAdmin (in cPanel)
2. Run SQL commands to modify tables
3. Restart app
```

### Update Dependencies:

1. **Upload new `requirements.txt`** via FTP
2. **cPanel → Setup Python App**
3. **RUN PIP INSTALL** with `requirements.txt`
4. **Restart** application

---

## 🌐 Domain & SSL Configuration

### Setup Custom Domain

1. **cPanel → Domains → Addon Domains**
2. **Add your domain**
3. **Point Application URL** to that domain in Setup Python App

### Enable SSL (HTTPS)

1. **cPanel → Security → SSL/TLS Status**
2. **Enable AutoSSL** for your domain
3. **Or install Let's Encrypt certificate**
4. App will automatically use HTTPS

### Force HTTPS (Optional)

Uncomment these lines in `.htaccess`:
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 📊 Performance Optimization

### Enable Caching

Add to `.htaccess`:
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 year"
</IfModule>
```

### Compress Static Files

Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE text/html
</IfModule>
```

---

## ❓ FAQ

### Q: Can I use SQLite instead of PostgreSQL?

**A:** Yes! Just change `.env`:
```env
DATABASE_URL=sqlite:///todos.db
```
And create `instance/` folder with 755 permissions.

### Q: How do I restart the app?

**A:** Three ways:
1. cPanel → Setup Python App → RESTART button
2. Create/touch file `tmp/restart.txt` via FTP
3. Edit `passenger_wsgi.py` (changes trigger restart)

### Q: Can I use a subdomain?

**A:** Yes! 
1. Create subdomain in cPanel
2. Upload files to subdomain folder
3. Point Python app to that folder
4. Use subdomain URL in app configuration

### Q: Where are my uploaded files?

**A:** Check:
- `/home/username/public_html/` (main domain)
- `/home/username/public_html/subdomain/` (subdomain)
- Use FTP client to verify

### Q: App shows "Application Not Configured"?

**A:** Check:
1. `passenger_wsgi.py` exists in root
2. Application startup file is set to `passenger_wsgi.py`
3. Application entry point is set to `application`
4. Restart the app

### Q: 500 Internal Server Error?

**A:** Most common causes:
1. Wrong Python version (need 3.7+)
2. Missing `passenger_wsgi.py`
3. Wrong file permissions
4. Missing dependencies
5. Check error logs!

---

## 📞 Getting Help

### Check These First:
1. ✅ Application logs in cPanel
2. ✅ Error logs in cPanel
3. ✅ File permissions (644 for files, 755 for folders)
4. ✅ `.env` file has correct database credentials
5. ✅ All files uploaded via FTP

### Contact Your Host If:
- Python version is too old (< 3.7)
- PostgreSQL not available
- Cannot create Python app
- File permission errors persist

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] App is accessible at your domain
- [ ] No 500 errors
- [ ] CSS and JavaScript load correctly
- [ ] Can create new tasks
- [ ] Can mark tasks as complete
- [ ] Can edit tasks
- [ ] Can delete tasks
- [ ] Search works
- [ ] Filters work
- [ ] Recycle bin works
- [ ] Tasks persist after page reload (database working)

---

**🎊 Congratulations! Your Liquid Glass Todo App is live!**

For detailed troubleshooting, see `DEPLOYMENT_GUIDE.md`
