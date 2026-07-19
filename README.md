# ✨ Liquid Glass Todo App

<div align="center">

![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supported-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**A stunning, modern todo application with Apple-inspired Liquid Glass UI**

[Features](#-features) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [Screenshots](#-preview)

</div>

---

## 🎯 Overview

Liquid Glass Todo is a beautifully designed, full-featured task management application combining the elegance of Apple's design language with modern glassmorphism effects. Built with Flask and PostgreSQL, it offers a robust backend with a stunning, animated frontend.

### Why Choose Liquid Glass Todo?

✨ **Beautiful Apple-Inspired Design** - Glassmorphism effects with smooth animations  
🎨 **Modern UI/UX** - Latest design trends with liquid glass aesthetics  
🚀 **Production-Ready** - PostgreSQL database with proper architecture  
📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile  
⚡ **Fast & Smooth** - Optimized animations and interactions  
🔐 **Secure** - Best practices for authentication and data handling  
🎭 **Feature-Rich** - Categories, tags, filters, search, and more  

---

## ✨ Features

### 🎨 UI/UX Features
- **Liquid Glass Effect** - Beautiful glassmorphism with backdrop blur
- **Animated Background** - Gradient shifting with floating orbs
- **Smooth Animations** - Transitions, scaling, fading effects
- **Interactive Cards** - Hover effects and micro-interactions
- **Toast Notifications** - Elegant feedback for user actions
- **Modal Dialogs** - Smooth sliding modals for task creation/editing
- **Responsive Design** - Adapts perfectly to all screen sizes

### 👥 User Management Features
- 🔐 **User Authentication** - Secure login and registration system
- 👤 **User Accounts** - Permanent storage for logged-in users
- 👻 **Guest Mode** - Temporary session-based storage for guests
- 🛡️ **Admin Dashboard** - Monitor users, tasks, and system usage
- 📊 **User Statistics** - Track activity and engagement
- 🔒 **Role-Based Access** - Admin and regular user roles
- 💾 **Data Persistence** - Never lose your tasks when logged in

### 📝 Task Management Features
- ✅ **Create Tasks** - With title, description, dates, priority, category, and tags
- 📋 **Edit Tasks** - Update any task details inline
- 🔄 **Toggle Complete** - Mark tasks as done/undone with animation
- 🗑️ **Soft Delete** - Move tasks to recycle bin
- ♻️ **Restore Tasks** - Recover deleted tasks from recycle bin
- 💀 **Permanent Delete** - Remove tasks forever
- 🔍 **Search** - Real-time search across task titles and descriptions
- 🎯 **Filter by Category** - Organize tasks by custom categories
- 🏷️ **Filter by Priority** - High, Medium, Low priority levels
- 🏷️ **Tag System** - Add multiple tags to tasks
- 📊 **Statistics** - Live task counters with animated numbers
- ⌨️ **Keyboard Shortcuts** - Ctrl+K for search, Ctrl+N for new task

### 🛠️ Technical Features
- **PostgreSQL Database** - Robust, scalable data storage
- **SQLAlchemy ORM** - Clean database operations
- **Flask-Login** - Secure user session management
- **Session Storage** - For guest users (temporary)
- **RESTful API** - JSON endpoints for all operations
- **Environment Config** - Secure configuration with .env
- **Production Ready** - Gunicorn WSGI server support
- **cPanel Compatible** - Passenger WSGI for shared hosting
- **GitHub Actions** - Automated FTP deployment
- **Error Handling** - Graceful error management
- **Security Headers** - XSS, CSRF, clickjacking protection

---

## 🚀 Quick Start

### Prerequisites

- Python 3.7+
- PostgreSQL (or SQLite for development)
- pip (Python package manager)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/liquid-glass-todo.git
   cd liquid-glass-todo
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Run the application:**
   ```bash
   python app.py
   ```

6. **Open browser:**
   ```
   http://localhost:5000
   ```

7. **Default admin account:**
   ```
   Username: admin
   Password: admin123
   ⚠️ Change this immediately in production!
   ```

### User Modes

#### 🔐 Logged In Mode (Recommended)
- **Permanent storage** - Your tasks are saved in the database
- **Access anywhere** - Login from any device
- **Full features** - All features available
- **Secure** - Password-protected account

**To use:**
1. Click "Sign Up" to create an account
2. Or click "Login" if you have an account
3. Start creating tasks - they'll be saved permanently!

#### 👻 Guest Mode
- **Temporary storage** - Tasks stored in browser session only
- **No signup required** - Start immediately
- **Session-based** - Tasks deleted when browser closes
- **Try before signup** - Test the app without commitment

**To use:**
- Just start using the app without logging in
- Or click "Continue as Guest" on login page

### Using SQLite (Development)

For quick local testing without PostgreSQL:

```env
# .env file
DATABASE_URL=sqlite:///todos.db
SECRET_KEY=your-secret-key-here
```

### Using PostgreSQL (Production)

```env
# .env file
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
SECRET_KEY=your-secret-key-here
FLASK_ENV=production
```

---

## 👥 User Authentication

### Registration

1. Click **"Sign Up"** button
2. Fill in:
   - Username (unique)
   - Email (unique)
   - Password (min 6 characters)
   - Confirm password
3. Click **"Create Account"**
4. You'll be redirected to login

### Login

1. Click **"Login"** button
2. Enter your username and password
3. Optionally check "Remember me"
4. Click **"Sign In"**

### Guest to User Conversion

⚠️ **Note:** Guest tasks are not automatically transferred when you create an account. Guest mode is temporary only.

**Recommendation:** Create an account before starting serious work!

---

## 🛡️ Admin Dashboard

### Accessing Admin Panel

1. Login with admin account
2. Click **"Admin"** button in header
3. Or visit `/admin` directly

### Default Admin Account

```
Username: admin
Password: admin123
```

**⚠️ SECURITY:** Change the default admin password immediately!

To change admin password:
1. Login as admin
2. Create a new admin user
3. Login with new admin
4. Delete old admin account

Or update directly in database:
```python
from app import app, db, User
with app.app_context():
    admin = User.query.filter_by(username='admin').first()
    admin.set_password('new-secure-password')
    db.session.commit()
```

### Admin Features

#### 📊 System Statistics
- Total users count
- Total tasks created
- Completed tasks
- Active tasks

#### 👥 User Management
- View all registered users
- See user details (email, join date, last login)
- View task count per user
- Make users admin
- Delete users
- Cannot delete yourself
- Cannot modify your own admin status

#### 📈 Activity Monitoring
- Recent user logins
- Recent task creations
- User engagement metrics
- Category distribution

### Making Users Admin

1. Go to Admin Dashboard
2. Find user in User Management table
3. Click shield icon to toggle admin status
4. Confirm the action

### Deleting Users

1. Go to Admin Dashboard
2. Find user in User Management table
3. Click trash icon
4. Confirm deletion (this is permanent!)

**Note:** When you delete a user, all their tasks are also deleted (cascade delete).

---

## 🚀 Automated Deployment with GitHub Actions

### Setup Automated FTP Deployment

The app includes a GitHub Actions workflow for automatic deployment to cPanel via FTP.

#### Quick Setup:

1. **Add GitHub Secrets** (Settings → Secrets → Actions):
   ```
   FTP_SERVER          = ftp.yourdomain.com
   FTP_USERNAME        = your-ftp-username
   FTP_PASSWORD        = your-ftp-password
   FTP_SERVER_DIR      = /public_html/
   DATABASE_URL        = postgresql://...
   SECRET_KEY          = your-secret-key
   ```

2. **Push to main branch:**
   ```bash
   git push origin main
   ```

3. **Watch deployment** in Actions tab

4. **Restart app** in cPanel after first deployment

#### Features:
- ✅ Automatic deployment on push to `main`
- ✅ Manual deployment trigger available
- ✅ Code validation before deployment
- ✅ Incremental file uploads (only changed files)
- ✅ Deployment status notifications
- ✅ Error handling and rollback protection

**Full Guide:** [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)

---

## 📦 Installation Options

### Option 1: Standard Installation

```bash
pip install -r requirements.txt
python app.py
```

### Option 2: Production with Gunicorn

```bash
pip install -r requirements.txt
gunicorn app:app --bind 0.0.0.0:8000
```

### Option 3: cPanel Shared Hosting

See detailed guide: [CPANEL_SETUP.md](CPANEL_SETUP.md)

Quick steps:
1. Upload files via FTP
2. Create PostgreSQL database in cPanel
3. Setup Python App in cPanel
4. Install dependencies
5. Configure environment variables
6. Restart and enjoy!

Full guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🎨 Preview

### Main Dashboard
- Beautiful glassmorphism cards
- Animated gradient background
- Floating blur orbs
- Real-time task statistics

### Task Cards
- Priority badges (High/Medium/Low)
- Category labels
- Tag chips
- Date information
- Action buttons (Edit/Delete)

### Create/Edit Modal
- Smooth sliding animation
- Form with all task properties
- Validation and error handling

### Search & Filters
- Real-time search
- Category filtering
- Priority filtering
- Animated results

---

## 📁 Project Structure

```
liquid-glass-todo/
├── 📄 app.py                    # Main Flask application
├── 📄 config.py                 # Configuration classes
├── 📄 passenger_wsgi.py         # WSGI entry point (cPanel)
├── 📄 requirements.txt          # Python dependencies
├── 📄 .env.example              # Environment variables template
├── 📄 .htaccess                 # Apache configuration (cPanel)
├── 📄 Procfile                  # Heroku deployment
├── 📄 runtime.txt               # Python version specification
│
├── 📁 templates/
│   └── 📄 index.html            # Main HTML template
│
├── 📁 static/
│   ├── 📄 liquid-glass.css      # Liquid Glass UI styles
│   ├── 📄 liquid-glass.js       # JavaScript functionality
│   ├── 📄 styles.css            # (legacy)
│   ├── 📄 main.js               # (legacy)
│   └── 📄 todo.css              # (legacy)
│
├── 📁 instance/
│   └── 📄 todos.db              # SQLite database (if used)
│
├── 📄 README.md                 # This file
├── 📄 DEPLOYMENT_GUIDE.md       # Comprehensive deployment guide
├── 📄 CPANEL_SETUP.md          # cPanel-specific setup
└── 📄 LICENSE                   # MIT License
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/todo_db

# Flask
SECRET_KEY=your-super-secret-random-key
FLASK_ENV=production
FLASK_DEBUG=False

# App
APP_NAME=Liquid Glass Todo
```

### Generate Secret Key

```python
import secrets
print(secrets.token_hex(32))
```

---

## 🗄️ Database Schema

### Task Model

```python
class Task:
    id              # Integer, Primary Key
    title           # String(500), Required
    description     # Text
    category        # String(100), Default: 'General'
    priority        # String(20), Default: 'Medium'
    status          # String(20), Default: 'Incomplete'
    done            # Boolean, Default: False
    is_deleted      # Boolean, Default: False
    tags            # String(500), Comma-separated
    start_date      # String(20)
    end_date        # String(20)
    created_at      # DateTime
    updated_at      # DateTime
```

---

## 🌐 API Endpoints

### Task Operations

```
GET  /                          # Main page with tasks
GET  /api/tasks                 # Get tasks (JSON)
                                  ?category=work
                                  ?priority=high
                                  ?search=keyword

POST /add                       # Create new task
POST /update/<id>               # Update task
POST /toggle/<id>               # Toggle task completion
POST /delete/<id>               # Soft delete task
POST /restore/<id>              # Restore deleted task
POST /permanent-delete/<id>     # Permanently delete task
```

---

## 🚀 Deployment

### Deploy to cPanel (Shared Hosting)

**Perfect for beginners with no SSH access!**

1. 📚 Read: [CPANEL_SETUP.md](CPANEL_SETUP.md) (Quick guide)
2. 📖 Or read: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) (Detailed guide)

**Quick Summary:**
- Upload via FTP
- Create PostgreSQL database
- Setup Python app in cPanel
- Install dependencies
- Configure environment
- Done! 🎉

### Deploy to Heroku

```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
git push heroku main
heroku open
```

### Deploy to VPS (Ubuntu)

```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip python3-venv postgresql nginx

# Setup app
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Run with Gunicorn
gunicorn app:app --bind 0.0.0.0:8000

# Setup Nginx reverse proxy
# Configure systemd service
```

---

## 🎯 Usage Tips

### Keyboard Shortcuts

- `Ctrl + K` - Focus search bar
- `Ctrl + N` - Create new task
- `Escape` - Close modal

### Power User Features

- **Bulk Actions** - Filter by category/priority then bulk edit
- **Quick Search** - Search updates in real-time as you type
- **Smart Tags** - Use tags for quick organization
- **Date Ranges** - Set start and end dates for time tracking

---

## 🛠️ Development

### Running in Development Mode

```bash
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py
```

### Database Migrations

For schema changes:

1. **Update model** in `app.py`
2. **Drop tables** (dev only):
   ```python
   with app.app_context():
       db.drop_all()
       db.create_all()
   ```
3. Or use **Flask-Migrate** for production migrations

### Adding Features

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Design Inspiration**: Apple's iOS and macOS design language
- **Glassmorphism**: Modern UI trend popularized by Apple
- **Flask**: Lightweight Python web framework
- **PostgreSQL**: Robust open-source database
- **Bootstrap Icons**: Beautiful icon set

---

## 📞 Support

### Documentation
- [Quick Setup](CPANEL_SETUP.md) - cPanel setup guide
- [Deployment](DEPLOYMENT_GUIDE.md) - Comprehensive deployment guide
- [GitHub Actions](GITHUB_ACTIONS_SETUP.md) - Automated FTP deployment setup
- [Quick Reference](QUICK_START.md) - Quick deployment reference

### Issues
- Report bugs via GitHub Issues
- Request features via GitHub Issues
- Ask questions in Discussions

### Community
- ⭐ Star this repo if you find it useful!
- 🐦 Share on social media
- 💬 Join discussions

---

## 🗺️ Roadmap

### Planned Features
- [x] User authentication and accounts ✅ **DONE!**
- [x] Admin dashboard and user management ✅ **DONE!**
- [x] Guest mode with session storage ✅ **DONE!**
- [x] Automated deployment with GitHub Actions ✅ **DONE!**
- [ ] Task sharing and collaboration
- [ ] Due date reminders and notifications
- [ ] Subtasks and checklists
- [ ] Dark mode toggle
- [ ] Export tasks (CSV, JSON, PDF)
- [ ] Task templates
- [ ] Activity timeline and history
- [ ] Mobile app (React Native)
- [ ] Calendar view integration
- [ ] Email notifications
- [ ] Two-factor authentication (2FA)

---

## 📊 Tech Stack

**Backend:**
- Python 3.7+
- Flask 3.0.0
- SQLAlchemy 2.0.23
- PostgreSQL / SQLite

**Frontend:**
- HTML5
- CSS3 (Glassmorphism)
- Vanilla JavaScript
- Bootstrap Icons

**Deployment:**
- Gunicorn (WSGI Server)
- Passenger (cPanel)
- Nginx (VPS)
- Heroku Ready

---

<div align="center">

**Made with ❤️ using Flask & PostgreSQL**

**Designed with ✨ inspired by Apple's aesthetic**

[⬆ Back to top](#-liquid-glass-todo-app)

</div> 
