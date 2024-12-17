from flask import Flask, render_template, request, redirect, url_for, jsonify
from datetime import datetime

app = Flask(__name__)

# In-memory database for active tasks and deleted tasks
tasks = []
deleted_tasks = []

@app.route('/')
def index():
    return render_template('index.html', tasks=tasks, deleted_tasks=deleted_tasks)

@app.route('/add', methods=['POST'])
def add_task():
    task = request.form.get('task')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    priority = request.form.get('priority')  # Get priority from form
    if task:
        tasks.append({
            'task': task,
            'status': 'Incomplete',
            'created_at': datetime.now(),
            'start_date': start_date,
            'end_date': end_date,
            'priority': priority,
            'done': False
        })
    return redirect(url_for('index'))

@app.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    if 0 <= task_id < len(tasks):
        deleted_task = tasks.pop(task_id)
        deleted_tasks.append(deleted_task)
    return jsonify(success=True)

@app.route('/restore/<int:task_id>', methods=['POST'])
def restore_task(task_id):
    if 0 <= task_id < len(deleted_tasks):
        restored_task = deleted_tasks.pop(task_id)
        tasks.append(restored_task)
    return jsonify(success=True)

@app.route('/toggle/<int:task_id>', methods=['POST'])
def toggle_task(task_id):
    if 0 <= task_id < len(tasks):
        tasks[task_id]['done'] = not tasks[task_id]['done']
        tasks[task_id]['status'] = 'Complete' if tasks[task_id]['done'] else 'Incomplete'
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True)
