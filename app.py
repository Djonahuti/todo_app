from flask import Flask, render_template, request, redirect, url_for, jsonify, session, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from functools import wraps
import os
import json

app = Flask(__name__)

# Database configuration
# For local development, use SQLite. For production, use PostgreSQL
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL or 'sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SESSION_TYPE'] = 'filesystem'

db = SQLAlchemy(app)

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'

# Database Models
class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationship to tasks
    tasks = db.relationship('Task', backref='owner', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else None,
            'last_login': self.last_login.strftime('%Y-%m-%d %H:%M') if self.last_login else None,
            'task_count': len(self.tasks)
        }

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Null for guest tasks (shouldn't happen in DB)
    title = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), default='General')
    priority = db.Column(db.String(20), default='Medium')
    status = db.Column(db.String(20), default='Incomplete')
    done = db.Column(db.Boolean, default=False)
    is_deleted = db.Column(db.Boolean, default=False)
    tags = db.Column(db.String(500))
    start_date = db.Column(db.String(20))
    end_date = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'priority': self.priority,
            'status': self.status,
            'done': self.done,
            'is_deleted': self.is_deleted,
            'tags': self.tags.split(',') if self.tags else [],
            'start_date': self.start_date,
            'end_date': self.end_date,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else None,
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M') if self.updated_at else None
        }

# Flask-Login user loader
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Admin required decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            flash('You need administrator privileges to access this page.', 'danger')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

# Guest task management helpers
def get_guest_tasks():
    """Get tasks from session for guest users"""
    return session.get('guest_tasks', [])

def save_guest_tasks(tasks):
    """Save tasks to session for guest users"""
    session['guest_tasks'] = tasks
    session.modified = True

def get_guest_deleted_tasks():
    """Get deleted tasks from session for guest users"""
    return session.get('guest_deleted_tasks', [])

def save_guest_deleted_tasks(tasks):
    """Save deleted tasks to session for guest users"""
    session['guest_deleted_tasks'] = tasks
    session.modified = True

def generate_guest_task_id():
    """Generate unique ID for guest tasks"""
    guest_tasks = get_guest_tasks()
    if not guest_tasks:
        return 1
    return max(task['id'] for task in guest_tasks) + 1


# Initialize database
with app.app_context():
    db.create_all()
    # Create default admin user if not exists
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(
            username='admin',
            email='admin@todoapp.com',
            is_admin=True
        )
        admin.set_password('admin123')  # Change this in production!
        db.session.add(admin)
        db.session.commit()
        print("Default admin user created: username='admin', password='admin123'")

# ============= AUTHENTICATION ROUTES =============

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        # Validation
        if not username or not email or not password:
            flash('All fields are required.', 'danger')
            return render_template('register.html')
        
        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('register.html')
        
        if len(password) < 6:
            flash('Password must be at least 6 characters long.', 'danger')
            return render_template('register.html')
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            flash('Username already exists.', 'danger')
            return render_template('register.html')
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered.', 'danger')
            return render_template('register.html')
        
        # Create new user
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        
        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        remember = request.form.get('remember', False)
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            login_user(user, remember=remember)
            flash(f'Welcome back, {user.username}!', 'success')
            
            # Redirect to next page or index
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('index'))
        else:
            flash('Invalid username or password.', 'danger')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

# ============= ADMIN ROUTES =============

@app.route('/admin')
@login_required
@admin_required
def admin_dashboard():
    users = User.query.order_by(User.created_at.desc()).all()
    total_users = User.query.count()
    total_tasks = Task.query.count()
    completed_tasks = Task.query.filter_by(done=True).count()
    deleted_tasks = Task.query.filter_by(is_deleted=True).count()
    
    # Recent activity
    recent_users = User.query.order_by(User.last_login.desc()).limit(10).all()
    recent_tasks = Task.query.order_by(Task.created_at.desc()).limit(10).all()
    
    stats = {
        'total_users': total_users,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'deleted_tasks': deleted_tasks,
        'active_tasks': total_tasks - deleted_tasks
    }
    
    return render_template('admin.html', 
                         users=users, 
                         stats=stats,
                         recent_users=recent_users,
                         recent_tasks=recent_tasks)

@app.route('/admin/user/<int:user_id>/toggle-admin', methods=['POST'])
@login_required
@admin_required
def toggle_admin(user_id):
    if user_id == current_user.id:
        return jsonify({'success': False, 'error': 'Cannot modify your own admin status'}), 400
    
    user = User.query.get_or_404(user_id)
    user.is_admin = not user.is_admin
    db.session.commit()
    
    return jsonify({'success': True, 'is_admin': user.is_admin})

@app.route('/admin/user/<int:user_id>/delete', methods=['POST'])
@login_required
@admin_required
def delete_user(user_id):
    if user_id == current_user.id:
        return jsonify({'success': False, 'error': 'Cannot delete your own account'}), 400
    
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/admin/stats')
@login_required
@admin_required
def admin_stats():
    """API endpoint for admin statistics"""
    total_users = User.query.count()
    admin_users = User.query.filter_by(is_admin=True).count()
    total_tasks = Task.query.count()
    completed_tasks = Task.query.filter_by(done=True).count()
    
    # Tasks by priority
    high_priority = Task.query.filter_by(priority='High', is_deleted=False).count()
    medium_priority = Task.query.filter_by(priority='Medium', is_deleted=False).count()
    low_priority = Task.query.filter_by(priority='Low', is_deleted=False).count()
    
    # Get category distribution
    categories = db.session.query(Task.category, db.func.count(Task.id)).filter_by(is_deleted=False).group_by(Task.category).all()
    
    return jsonify({
        'users': {
            'total': total_users,
            'admin': admin_users,
            'regular': total_users - admin_users
        },
        'tasks': {
            'total': total_tasks,
            'completed': completed_tasks,
            'incomplete': total_tasks - completed_tasks,
            'high_priority': high_priority,
            'medium_priority': medium_priority,
            'low_priority': low_priority
        },
        'categories': [{'name': cat[0], 'count': cat[1]} for cat in categories]
    })


# ============= MAIN ROUTES =============

@app.route('/')
def index():
    # Check if user is authenticated or guest
    if current_user.is_authenticated:
        # Logged in user - get from database
        tasks = Task.query.filter_by(user_id=current_user.id, is_deleted=False).order_by(Task.created_at.desc()).all()
        deleted_tasks = Task.query.filter_by(user_id=current_user.id, is_deleted=True).order_by(Task.updated_at.desc()).all()
        categories = db.session.query(Task.category).filter_by(user_id=current_user.id).distinct().all()
        categories = [cat[0] for cat in categories if cat[0]]
        is_guest = False
    else:
        # Guest user - get from session
        guest_tasks = get_guest_tasks()
        guest_deleted = get_guest_deleted_tasks()
        
        # Convert to objects for template compatibility
        tasks = guest_tasks
        deleted_tasks = guest_deleted
        categories = list(set(task['category'] for task in guest_tasks if task.get('category')))
        is_guest = True
    
    return render_template('index.html', 
                         tasks=tasks, 
                         deleted_tasks=deleted_tasks, 
                         categories=categories,
                         is_guest=is_guest)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    category = request.args.get('category')
    priority = request.args.get('priority')
    search = request.args.get('search', '')
    
    if current_user.is_authenticated:
        # Database query for logged-in users
        query = Task.query.filter_by(user_id=current_user.id, is_deleted=False)
        
        if category and category != 'all':
            query = query.filter_by(category=category)
        if priority and priority != 'all':
            query = query.filter_by(priority=priority)
        if search:
            query = query.filter(Task.title.ilike(f'%{search}%'))
        
        tasks = query.order_by(Task.created_at.desc()).all()
        return jsonify([task.to_dict() for task in tasks])
    else:
        # Session storage for guests
        guest_tasks = get_guest_tasks()
        filtered = guest_tasks
        
        if category and category != 'all':
            filtered = [t for t in filtered if t.get('category') == category]
        if priority and priority != 'all':
            filtered = [t for t in filtered if t.get('priority') == priority]
        if search:
            filtered = [t for t in filtered if search.lower() in t.get('title', '').lower()]
        
        return jsonify(filtered)

@app.route('/add', methods=['POST'])
def add_task():
    data = request.form if request.form else request.json
    
    title = data.get('task') or data.get('title')
    if not title:
        return jsonify({'success': False, 'error': 'Title is required'}), 400
    
    if current_user.is_authenticated:
        # Save to database for logged-in users
        new_task = Task(
            user_id=current_user.id,
            title=title,
            description=data.get('description', ''),
            category=data.get('category', 'General'),
            priority=data.get('priority', 'Medium'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            tags=data.get('tags', '')
        )
        
        db.session.add(new_task)
        db.session.commit()
        
        if request.is_json:
            return jsonify({'success': True, 'task': new_task.to_dict()})
    else:
        # Save to session for guests
        guest_tasks = get_guest_tasks()
        new_task = {
            'id': generate_guest_task_id(),
            'title': title,
            'description': data.get('description', ''),
            'category': data.get('category', 'General'),
            'priority': data.get('priority', 'Medium'),
            'status': 'Incomplete',
            'done': False,
            'is_deleted': False,
            'tags': data.get('tags', ''),
            'start_date': data.get('start_date'),
            'end_date': data.get('end_date'),
            'created_at': datetime.utcnow().strftime('%Y-%m-%d %H:%M'),
            'updated_at': datetime.utcnow().strftime('%Y-%m-%d %H:%M')
        }
        guest_tasks.append(new_task)
        save_guest_tasks(guest_tasks)
        
        if request.is_json:
            return jsonify({'success': True, 'task': new_task})
    
    return redirect(url_for('index'))

@app.route('/update/<int:task_id>', methods=['POST'])
def update_task(task_id):
    data = request.json
    
    if current_user.is_authenticated:
        task = Task.query.filter_by(id=task_id, user_id=current_user.id).first_or_404()
        
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'category' in data:
            task.category = data['category']
        if 'priority' in data:
            task.priority = data['priority']
        if 'start_date' in data:
            task.start_date = data['start_date']
        if 'end_date' in data:
            task.end_date = data['end_date']
        if 'tags' in data:
            task.tags = data['tags']
        
        task.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'success': True, 'task': task.to_dict()})
    else:
        # Update guest task
        guest_tasks = get_guest_tasks()
        task = next((t for t in guest_tasks if t['id'] == task_id), None)
        
        if not task:
            return jsonify({'success': False, 'error': 'Task not found'}), 404
        
        if 'title' in data:
            task['title'] = data['title']
        if 'description' in data:
            task['description'] = data['description']
        if 'category' in data:
            task['category'] = data['category']
        if 'priority' in data:
            task['priority'] = data['priority']
        if 'start_date' in data:
            task['start_date'] = data['start_date']
        if 'end_date' in data:
            task['end_date'] = data['end_date']
        if 'tags' in data:
            task['tags'] = data['tags']
        
        task['updated_at'] = datetime.utcnow().strftime('%Y-%m-%d %H:%M')
        save_guest_tasks(guest_tasks)
        
        return jsonify({'success': True, 'task': task})

@app.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    if current_user.is_authenticated:
        task = Task.query.filter_by(id=task_id, user_id=current_user.id).first_or_404()
        task.is_deleted = True
        task.updated_at = datetime.utcnow()
        db.session.commit()
    else:
        # Guest task deletion
        guest_tasks = get_guest_tasks()
        guest_deleted = get_guest_deleted_tasks()
        
        task = next((t for t in guest_tasks if t['id'] == task_id), None)
        if task:
            guest_tasks.remove(task)
            task['is_deleted'] = True
            task['updated_at'] = datetime.utcnow().strftime('%Y-%m-%d %H:%M')
            guest_deleted.append(task)
            save_guest_tasks(guest_tasks)
            save_guest_deleted_tasks(guest_deleted)
    
    return jsonify({'success': True})

@app.route('/restore/<int:task_id>', methods=['POST'])
def restore_task(task_id):
    if current_user.is_authenticated:
        task = Task.query.filter_by(id=task_id, user_id=current_user.id).first_or_404()
        task.is_deleted = False
        task.updated_at = datetime.utcnow()
        db.session.commit()
    else:
        # Guest task restoration
        guest_deleted = get_guest_deleted_tasks()
        guest_tasks = get_guest_tasks()
        
        task = next((t for t in guest_deleted if t['id'] == task_id), None)
        if task:
            guest_deleted.remove(task)
            task['is_deleted'] = False
            task['updated_at'] = datetime.utcnow().strftime('%Y-%m-%d %H:%M')
            guest_tasks.append(task)
            save_guest_tasks(guest_tasks)
            save_guest_deleted_tasks(guest_deleted)
    
    return jsonify({'success': True})

@app.route('/toggle/<int:task_id>', methods=['POST'])
def toggle_task(task_id):
    if current_user.is_authenticated:
        task = Task.query.filter_by(id=task_id, user_id=current_user.id).first_or_404()
        task.done = not task.done
        task.status = 'Complete' if task.done else 'Incomplete'
        task.updated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'success': True, 'done': task.done})
    else:
        # Guest task toggle
        guest_tasks = get_guest_tasks()
        task = next((t for t in guest_tasks if t['id'] == task_id), None)
        
        if task:
            task['done'] = not task.get('done', False)
            task['status'] = 'Complete' if task['done'] else 'Incomplete'
            task['updated_at'] = datetime.utcnow().strftime('%Y-%m-%d %H:%M')
            save_guest_tasks(guest_tasks)
            return jsonify({'success': True, 'done': task['done']})
        
        return jsonify({'success': False, 'error': 'Task not found'}), 404

@app.route('/permanent-delete/<int:task_id>', methods=['POST'])
def permanent_delete(task_id):
    if current_user.is_authenticated:
        task = Task.query.filter_by(id=task_id, user_id=current_user.id).first_or_404()
        db.session.delete(task)
        db.session.commit()
    else:
        # Guest permanent deletion
        guest_deleted = get_guest_deleted_tasks()
        task = next((t for t in guest_deleted if t['id'] == task_id), None)
        if task:
            guest_deleted.remove(task)
            save_guest_deleted_tasks(guest_deleted)
    
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
