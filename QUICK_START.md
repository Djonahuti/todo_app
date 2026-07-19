# 🚀 Quick Deployment Reference

## For cPanel Shared Hosting (Most Common)

### 🎯 You Need:
1. FTP access to your hosting
2. cPanel login credentials  
3. A domain or subdomain configured

### 📚 Which Guide to Follow?

**Choose based on your experience level:**

#### Beginner (No Technical Experience)
👉 **Start with: [CPANEL_SETUP.md](CPANEL_SETUP.md)**
- Simple 5-step process
- Quick and easy to follow
- Gets you up and running fast
- ⏱️ Time: ~15-20 minutes

#### Intermediate (Some Technical Knowledge)  
👉 **Use: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**
- Comprehensive documentation
- Detailed troubleshooting
- Security best practices
- All scenarios covered
- ⏱️ Time: ~30-45 minutes

### 🎬 Quick Steps Overview

```
1. Upload Files (FTP)
   ↓
2. Create Database (cPanel)
   ↓
3. Setup Python App (cPanel)
   ↓
4. Install Dependencies (cPanel)
   ↓
5. Configure .env file (FTP)
   ↓
6. Restart App (cPanel)
   ↓
7. ✅ DONE! Visit your domain
```

---

## 📱 FTP Clients (Pick One)

### Windows Users:
- **FileZilla** (Free) - https://filezilla-project.org/
- **WinSCP** (Free) - https://winscp.net/

### Mac Users:
- **Cyberduck** (Free) - https://cyberduck.io/
- **FileZilla** (Free) - https://filezilla-project.org/

### All Platforms:
- Use your hosting's **File Manager** in cPanel (no download needed!)

---

## 🎯 Files You MUST Upload

### Essential Files (Required):
```
✅ app.py
✅ passenger_wsgi.py    ← CRITICAL for cPanel!
✅ .htaccess            ← CRITICAL for routing!
✅ requirements.txt
✅ .env (create from .env.example)
```

### Folders (Required):
```
✅ templates/
✅ static/
```

### Optional but Recommended:
```
⚪ config.py
⚪ README.md
⚪ CPANEL_SETUP.md
⚪ DEPLOYMENT_GUIDE.md
```

### DON'T Upload:
```
❌ .git/
❌ __pycache__/
❌ venv/
❌ *.pyc files
❌ .env (upload .env not .env.example)
```

---

## 🗄️ Database Setup (PostgreSQL)

### In cPanel PostgreSQL Databases:

**1. Create Database:**
```
Name: todo_db
Result: username_todo_db (cPanel adds prefix)
```

**2. Create User:**
```
Username: todouser
Password: [Generate Strong Password] ⚠️ SAVE THIS!
Result: username_todouser (cPanel adds prefix)
```

**3. Add User to Database:**
```
User: username_todouser
Database: username_todo_db
Privileges: ALL PRIVILEGES ✅
```

**4. Your DATABASE_URL:**
```
postgresql://username_todouser:your_password@localhost:5432/username_todo_db
```

---

## ⚙️ Python App Configuration

### In cPanel "Setup Python App":

```
Python version:        3.11 (or highest available)
Application root:      /home/username/public_html
Application URL:       yourdomain.com
Application startup:   passenger_wsgi.py
Application entry:     application
```

Then click **CREATE**

---

## 📦 Installing Dependencies

### After creating Python app:

**Option 1:** Upload requirements.txt
```
1. In "Setup Python App" page
2. Scroll to "Configuration Files"
3. Upload: requirements.txt
4. Click: RUN PIP INSTALL
```

**Option 2:** Manual entry
```
Paste in "RUN PIP INSTALL" field:
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
psycopg2-binary==2.9.9
Werkzeug==3.0.1
SQLAlchemy==2.0.23
python-dotenv==1.0.0

Then click: RUN PIP INSTALL
```

---

## 🔐 Environment Variables (.env file)

### Create/Edit .env file:

```env
DATABASE_URL=postgresql://username_todouser:YOUR_PASSWORD@localhost:5432/username_todo_db
SECRET_KEY=generate-random-key-at-randomkeygen-dot-com
FLASK_ENV=production
FLASK_DEBUG=False
```

### Generate SECRET_KEY:
1. Visit: https://randomkeygen.com/
2. Copy "256-bit WPA Key"
3. Paste as SECRET_KEY in .env

### Upload .env via FTP to application root

---

## ✅ Testing Your Deployment

### After setup:

1. **Restart App:** cPanel → Setup Python App → RESTART
2. **Visit:** https://yourdomain.com
3. **Test Features:**
   - ✅ Create a task
   - ✅ Mark as complete
   - ✅ Edit task
   - ✅ Delete task
   - ✅ Search/filter

### If errors occur:
1. Check logs: cPanel → Setup Python App → View Logs
2. Check error log: cPanel → Metrics → Errors
3. See troubleshooting in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🆘 Common Issues & Quick Fixes

### "500 Internal Server Error"
```
✅ Check passenger_wsgi.py exists
✅ Check file permissions (644)
✅ Restart app
✅ View error logs
```

### "CSS/JS Not Loading"
```
✅ Check static/ folder uploaded
✅ Check folder permissions (755)
✅ Check .htaccess uploaded
✅ Clear browser cache
```

### "Database Connection Error"
```
✅ Check DATABASE_URL in .env
✅ Verify database exists in cPanel
✅ Check database user has privileges
✅ Test database credentials
```

### "Application Not Configured"
```
✅ Verify passenger_wsgi.py in root
✅ Check "Application startup" = passenger_wsgi.py
✅ Check "Application entry" = application
✅ Restart app
```

---

## 📁 Correct File Structure on Server

```
/home/username/public_html/
│
├── passenger_wsgi.py    ← Must be here!
├── .htaccess            ← Must be here!
├── app.py
├── config.py
├── requirements.txt
├── .env                 ← Your configured file
│
├── templates/
│   └── index.html
│
└── static/
    ├── liquid-glass.css
    └── liquid-glass.js
```

---

## 🔄 Making Updates Later

```
1. Upload changed files via FTP
2. cPanel → Setup Python App → RESTART
3. Clear browser cache (Ctrl+F5)
4. Done!
```

---

## 📞 Need More Help?

### Documentation:
- 📘 [CPANEL_SETUP.md](CPANEL_SETUP.md) - Quick guide
- 📗 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Detailed guide
- 📙 [README.md](README.md) - App features & overview

### Hosting Support:
- Contact your hosting provider for:
  - Python version issues
  - PostgreSQL setup help
  - File permission problems
  - cPanel access issues

---

## ✨ Success Checklist

Before considering deployment complete:

- [ ] All files uploaded via FTP
- [ ] PostgreSQL database created
- [ ] Database user created with privileges
- [ ] Python app configured in cPanel
- [ ] Dependencies installed successfully
- [ ] .env file created and configured
- [ ] SECRET_KEY changed from default
- [ ] App restarted in cPanel
- [ ] Website loads in browser
- [ ] No CSS/JS errors
- [ ] Can create tasks
- [ ] Can edit tasks
- [ ] Can delete tasks
- [ ] Search works
- [ ] Filters work
- [ ] Database persists data (reload page, tasks still there)

---

## 🎊 You're All Set!

Once all checks pass, your Liquid Glass Todo app is live and ready to use!

**Enjoy your beautiful new todo application!** 🚀✨

---

## 💡 Pro Tips

1. **Bookmark** your cPanel Setup Python App page for easy restarts
2. **Save** your database credentials securely
3. **Enable** SSL/HTTPS in cPanel (free with Let's Encrypt)
4. **Backup** your .env file
5. **Test** on mobile devices too!

---

**Need the full details?** See the complete guides:
- [CPANEL_SETUP.md](CPANEL_SETUP.md) (Quick version)
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) (Comprehensive version)
