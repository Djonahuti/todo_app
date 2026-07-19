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
- **RESTful API** - JSON endpoints for all operations
- **Environment Config** - Secure configuration with .env
- **Production Ready** - Gunicorn WSGI server support
- **cPanel Compatible** - Passenger WSGI for shared hosting
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
- [ ] User authentication and accounts
- [ ] Task sharing and collaboration
- [ ] Due date reminders
- [ ] Subtasks and checklists
- [ ] Dark mode toggle
- [ ] Export tasks (CSV, JSON)
- [ ] Task templates
- [ ] Activity timeline
- [ ] Mobile app (React Native)

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
