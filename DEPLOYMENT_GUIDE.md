# 🚀 Complete cPanel Deployment Guide - Liquid Glass Todo App

This guide will walk you through deploying your Liquid Glass Todo App to a shared hosting environment using cPanel (without SSH access).

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [FTP Upload Instructions](#ftp-upload)
3. [cPanel Setup](#cpanel-setup)
4. [PostgreSQL Database Setup](#database-setup)
5. [Python App Configuration](#python-app-configuration)
6. [Environment Variables](#environment-variables)
7. [Testing Your Deployment](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

✅ **cPanel hosting account** with Python support (3.7+)  
✅ **FTP credentials** (hostname, username, password)  
✅ **Domain or subdomain** configured in cPanel  
✅ **PostgreSQL database** access in cPanel  
✅ **FTP client** installed (FileZilla, Cyberduck, or WinSCP recommended)

---

## 📤 FTP Upload Instructions

### Step 1: Connect to FTP

1. **Open your FTP client** (FileZilla example below)
2. Enter your FTP credentials:
   ```
   Host: ftp.yourdomain.com (or your hosting IP)
   Username: your-ftp-username
   Password: your-ftp-password
   Port: 21 (or 22 for SFTP if available)
   ```
3. Click **Connect**

### Step 2: Navigate to Your Domain Directory

1. In the remote site (right panel), navigate to:
   ```
   /public_html/              (for main domain)
   OR
   /public_html/subdomain/    (for subdomain)
   ```

### Step 3: Upload Application Files

Upload these files to your domain directory:

```
📁 Your Domain Directory
├── 📄 app.py                  ✅ Main Flask application
├── 📄 config.py              ✅ Configuration file
├── 📄 passenger_wsgi.py      ✅ WSGI entry point (required!)
├── 📄 requirements.txt       ✅ Python dependencies
├── 📄 .htaccess              ✅ URL routing (required!)
├── 📄 .env                   ✅ Environment variables
├── 📁 templates/
│   └── 📄 index.html         ✅ Main template
├── 📁 static/
│   ├── 📄 liquid-glass.css   ✅ Styles
│   └── 📄 liquid-glass.js    ✅ JavaScript
└── 📁 instance/              ⚠️  Create this folder for SQLite (if not using PostgreSQL)
```

**Important Notes:**
- ✅ **DO upload**: All `.py`, `.html`, `.css`, `.js`, `.htaccess`, `.env` files
- ❌ **DON'T upload**: `.git/` folder, `__pycache__/`, `*.pyc` files, `venv/` folder

### Step 4: Set File Permissions

After uploading, right-click on each file and select **File Permissions**:

```
📄 .htaccess           → 644
📄 passenger_wsgi.py   → 644
📄 app.py             → 644
📄 .env               → 644 (or 600 for extra security)
📁 static/            → 755
📁 templates/         → 755
📁 instance/          → 755
```

---

## 🎛️ cPanel Setup

### Step 1: Access cPanel

1. Log in to your cPanel account
2. URL usually looks like: `https://yourdomain.com:2083` or `https://yourdomain.com/cpanel`

### Step 2: Setup Python App

1. **Find "Setup Python App"** in cPanel (use search if needed)
2. Click **"Create Application"**

3. **Configure your Python application:**

   ```
   Python version:        3.11.x (or highest available)
   Application root:      /home/username/public_html/yourdomain
   Application URL:       yourdomain.com (or subdomain)
   Application startup:   passenger_wsgi.py
   Application entry:     application
   Passenger log file:    (leave default)
   ```

4. Click **"CREATE"**

### Step 3: Install Dependencies

After creating the app, cPanel will show you the virtual environment path.

1. **Copy the command** to activate the virtual environment:
   ```bash
   source /home/username/virtualenv/public_html/3.11/bin/activate
   ```

2. Scroll down to **"CONFIGURATION FILES"** section

3. In the **"RUN PIP INSTALL"** section, paste:
   ```
   Flask==3.0.0
   Flask-SQLAlchemy==3.1.1
   psycopg2-binary==2.9.9
   Werkzeug==3.0.1
   SQLAlchemy==2.0.23
   python-dotenv==1.0.0
   ```

4. Click **"RUN PIP INSTALL"** button

**OR** you can upload `requirements.txt` and install all at once:
   ```
   requirements.txt
   ```

---

## 🗄️ PostgreSQL Database Setup

### Step 1: Create PostgreSQL Database

1. In cPanel, go to **"PostgreSQL Databases"**
2. **Create a new database:**
   ```
   Database Name: username_todo_db
   ```
   (cPanel usually adds your username as prefix)

3. Click **"Create Database"**

### Step 2: Create Database User

1. Scroll to **"PostgreSQL Users"** section
2. **Create new user:**
   ```
   Username: username_todouser
   Password: [Generate strong password]
   ```
3. Click **"Create User"**
4. **⚠️ SAVE THIS PASSWORD!** You'll need it for `.env` file

### Step 3: Add User to Database

1. Scroll to **"Add User To Database"** section
2. Select:
   - User: `username_todouser`
   - Database: `username_todo_db`
3. Click **"Add"**
4. On next page, grant **ALL PRIVILEGES**
5. Click **"Make Changes"**

### Step 4: Get Database Connection Info

1. Go to **"PostgreSQL Databases"** page
2. Note down:
   ```
   Database Host: localhost (or specific hostname shown)
   Database Port: 5432 (default)
   Database Name: username_todo_db
   Username: username_todouser
   Password: [password you created]
   ```

---

## 🔐 Environment Variables

### Method 1: Using .env File (Recommended)

1. Create a `.env` file in your application root:

   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username_todouser:your_password@localhost:5432/username_todo_db
   
   # Flask Configuration
   SECRET_KEY=your-super-secret-key-change-this-to-random-string
   FLASK_ENV=production
   FLASK_DEBUG=False
   
   # Application Settings
   APP_NAME=Liquid Glass Todo
   ```

2. **Generate a SECRET_KEY:**
   - Go to: https://randomkeygen.com/
   - Copy a "256-bit WPA Key" or similar
   - Paste as your SECRET_KEY

3. Upload `.env` via FTP to your application root

### Method 2: Using cPanel Environment Variables

1. In **"Setup Python App"** page
2. Scroll to **"ENVIRONMENT VARIABLES"** section
3. Add each variable:
   ```
   Name: DATABASE_URL
   Value: postgresql://username_todouser:password@localhost/username_todo_db
   
   Name: SECRET_KEY
   Value: your-generated-secret-key
   
   Name: FLASK_ENV
   Value: production
   ```

4. Click **"SAVE"** after each one

---

## 🧪 Testing Your Deployment

### Step 1: Initialize Database

After setup, the app will automatically create tables on first run. Visit your domain:

```
https://yourdomain.com
```

### Step 2: Check for Errors

If you see errors:

1. **Check Application Logs:**
   - cPanel → Setup Python App → Click on your app
   - Look for "LOGS" section
   - Click "View Log"

2. **Check Error Log:**
   - cPanel → Metrics → Errors
   - Look for Python/Flask errors

### Step 3: Test Features

✅ Create a new task  
✅ Mark task as complete  
✅ Edit a task  
✅ Delete a task  
✅ Search and filter  
✅ Restore from recycle bin

---

## 🛠️ Troubleshooting

### Issue 1: 500 Internal Server Error

**Cause:** Python app not configured properly

**Solutions:**
1. Check `passenger_wsgi.py` exists in root
2. Verify `passenger_wsgi.py` has correct permissions (644)
3. Check Python app is running in cPanel
4. View error logs in cPanel

### Issue 2: Static Files Not Loading (CSS/JS missing)

**Cause:** Incorrect file paths or permissions

**Solutions:**
1. Check folder structure:
   ```
   /static/liquid-glass.css
   /static/liquid-glass.js
   ```
2. Set folder permissions to 755
3. Set file permissions to 644
4. Check `.htaccess` is uploaded

### Issue 3: Database Connection Error

**Cause:** Wrong DATABASE_URL or database doesn't exist

**Solutions:**
1. Verify database exists in cPanel → PostgreSQL Databases
2. Check DATABASE_URL format:
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   ```
3. Test database credentials in cPanel
4. Ensure user has ALL PRIVILEGES on database

### Issue 4: Application Won't Start

**Cause:** Missing dependencies or Python version mismatch

**Solutions:**
1. Reinstall requirements:
   - cPanel → Setup Python App → RUN PIP INSTALL
   - Enter: `requirements.txt`
2. Check Python version (minimum 3.7)
3. Restart app:
   - cPanel → Setup Python App → RESTART button

### Issue 5: Changes Not Reflecting

**Cause:** App needs restart

**Solution:**
1. After any file changes, restart the app:
   - cPanel → Setup Python App
   - Click **"RESTART"** button
   - OR create/touch a `tmp/restart.txt` file

### Issue 6: Application Showing as "Not Configured"

**Cause:** WSGI entry point not found

**Solutions:**
1. Ensure `passenger_wsgi.py` is in root directory
2. Check the file contains:
   ```python
   from app import app as application
   ```
3. Verify application root path in cPanel matches file location

---

## 🔄 Making Updates

When you need to update your app:

1. **Upload changed files via FTP**
2. **Restart the application:**
   - cPanel → Setup Python App → RESTART
3. **Clear browser cache** to see CSS/JS changes

---

## 📧 Support

If you encounter issues not covered here:

1. Check cPanel error logs (Metrics → Errors)
2. Check application logs (Setup Python App → Logs)
3. Contact your hosting provider's support for:
   - Python version availability
   - PostgreSQL configuration
   - File permission issues

---

## ✅ Quick Checklist

Before going live, ensure:

- [ ] All files uploaded via FTP
- [ ] `passenger_wsgi.py` exists in root
- [ ] `.htaccess` uploaded
- [ ] File permissions set correctly
- [ ] Python app created in cPanel
- [ ] Dependencies installed
- [ ] PostgreSQL database created
- [ ] Database user created with privileges
- [ ] `.env` file configured with correct DATABASE_URL
- [ ] SECRET_KEY is changed from default
- [ ] Application restarted in cPanel
- [ ] Website accessible via browser
- [ ] All features working (create/edit/delete tasks)

---

## 🎉 Success!

Your Liquid Glass Todo App should now be live! Visit your domain to see your beautiful, modern todo application with glassmorphism effects.

**Features Available:**
- ✨ Beautiful Liquid Glass UI
- 📝 Create, edit, delete tasks
- 🏷️ Categories and tags
- 🔍 Search and filter
- ⚡ Smooth animations
- 📱 Responsive design
- 🗄️ PostgreSQL database
- 🔄 Recycle bin

Enjoy your new todo app! 🚀
