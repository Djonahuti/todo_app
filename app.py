from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

# Database configuration
# For local development, use SQLite. For production, use PostgreSQL
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL or 'sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

db = SQLAlchemy(app)

# Database Models
class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
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

# Initialize database
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    tasks = Task.query.filter_by(is_deleted=False).order_by(Task.created_at.desc()).all()
    deleted_tasks = Task.query.filter_by(is_deleted=True).order_by(Task.updated_at.desc()).all()
    categories = db.session.query(Task.category).distinct().all()
    categories = [cat[0] for cat in categories if cat[0]]
    return render_template('index.html', tasks=tasks, deleted_tasks=deleted_tasks, categories=categories)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    category = request.args.get('category')
    priority = request.args.get('priority')
    search = request.args.get('search', '')
    
    query = Task.query.filter_by(is_deleted=False)
    
    if category and category != 'all':
        query = query.filter_by(category=category)
    if priority and priority != 'all':
        query = query.filter_by(priority=priority)
    if search:
        query = query.filter(Task.title.ilike(f'%{search}%'))
    
    tasks = query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/add', methods=['POST'])
def add_task():
    data = request.form if request.form else request.json
    
    title = data.get('task') or data.get('title')
    if not title:
        return jsonify({'success': False, 'error': 'Title is required'}), 400
    
    new_task = Task(
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
    return redirect(url_for('index'))

@app.route('/update/<int:task_id>', methods=['POST'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json
    
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

@app.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.is_deleted = True
    task.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'success': True})

@app.route('/restore/<int:task_id>', methods=['POST'])
def restore_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.is_deleted = False
    task.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'success': True})

@app.route('/toggle/<int:task_id>', methods=['POST'])
def toggle_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.done = not task.done
    task.status = 'Complete' if task.done else 'Incomplete'
    task.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'success': True, 'done': task.done})

@app.route('/permanent-delete/<int:task_id>', methods=['POST'])
def permanent_delete(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
