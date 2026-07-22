// ===== STATE MANAGEMENT =====
let currentEditingTask = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateStats();
});

function initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Custom selects + filter functionality
    initializeCustomSelects();
    initializePrioritySegmented();

    const categoryFilter = document.getElementById('category-filter');
    const priorityFilter = document.getElementById('priority-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleFilters);
    }
    if (priorityFilter) {
        priorityFilter.addEventListener('change', handleFilters);
    }
}

// ===== CUSTOM SELECT =====
function initializeCustomSelects() {
    document.querySelectorAll('.custom-select').forEach((selectEl) => {
        const trigger = selectEl.querySelector('.custom-select-trigger');
        const menu = selectEl.querySelector('.custom-select-menu');
        const hiddenInput = selectEl.querySelector('input[type="hidden"]');
        if (!trigger || !menu || !hiddenInput) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = selectEl.classList.contains('is-open');
            closeAllCustomSelects();
            if (!isOpen) {
                openCustomSelect(selectEl);
            }
        });

        menu.querySelectorAll('[role="option"]').forEach((option) => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                setCustomSelectValue(selectEl, option.dataset.value, true);
                closeCustomSelect(selectEl);
            });
        });
    });

    document.addEventListener('click', closeAllCustomSelects);
}

function openCustomSelect(selectEl) {
    const trigger = selectEl.querySelector('.custom-select-trigger');
    const menu = selectEl.querySelector('.custom-select-menu');
    selectEl.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    menu.hidden = false;
}

function closeCustomSelect(selectEl) {
    const trigger = selectEl.querySelector('.custom-select-trigger');
    const menu = selectEl.querySelector('.custom-select-menu');
    selectEl.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
}

function closeAllCustomSelects() {
    document.querySelectorAll('.custom-select.is-open').forEach(closeCustomSelect);
}

function setCustomSelectValue(selectEl, value, dispatchChange = false) {
    const label = selectEl.querySelector('.custom-select-label');
    const hiddenInput = selectEl.querySelector('input[type="hidden"]');
    const options = selectEl.querySelectorAll('[role="option"]');
    let matched = null;

    options.forEach((option) => {
        const isSelected = option.dataset.value === value;
        option.classList.toggle('is-selected', isSelected);
        option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        if (isSelected) matched = option;
    });

    if (!matched) return;

    const optionLabel = Array.from(matched.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .join(' ')
        .trim() || matched.textContent.trim();

    label.textContent = optionLabel;
    hiddenInput.value = value;

    if (dispatchChange) {
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

function initializePrioritySegmented() {
    const group = document.querySelector('.priority-segmented');
    if (!group) return;

    group.querySelectorAll('.priority-option').forEach((btn) => {
        btn.addEventListener('click', () => {
            setPrioritySegmentedValue(btn.dataset.value);
        });
    });
}

function setPrioritySegmentedValue(value) {
    const group = document.querySelector('.priority-segmented');
    const input = document.getElementById('task-priority');
    if (!group || !input) return;

    group.querySelectorAll('.priority-option').forEach((btn) => {
        const isActive = btn.dataset.value === value;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    input.value = value;
}

// ===== MODAL FUNCTIONS =====
function openAddModal() {
    const modal = document.getElementById('task-modal');
    const form = document.getElementById('task-form');
    const modalTitle = document.getElementById('modal-title');
    const submitText = document.getElementById('submit-text');
    
    currentEditingTask = null;
    form.reset();
    setPrioritySegmentedValue('Medium');
    modalTitle.textContent = 'Create New Task';
    submitText.textContent = 'Create Task';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openEditModal(taskId) {
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const submitText = document.getElementById('submit-text');
    
    currentEditingTask = taskId;
    modalTitle.textContent = 'Edit Task';
    submitText.textContent = 'Save Changes';
    
    // Fetch task data and populate form
    const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskCard) {
        document.getElementById('task-title').value = taskCard.querySelector('.task-title').textContent;
        const description = taskCard.querySelector('.task-description');
        if (description) {
            document.getElementById('task-description').value = description.textContent;
        }
        
        const category = taskCard.dataset.category;
        const priority = taskCard.dataset.priority;
        document.getElementById('task-category').value = category;
        setPrioritySegmentedValue(priority);
        
        // Set dates and tags if visible
        const dateInfo = taskCard.querySelector('.date-info');
        if (dateInfo) {
            const dates = dateInfo.textContent.trim().split('→');
            if (dates.length === 2) {
                document.getElementById('task-start-date').value = dates[0].trim();
                document.getElementById('task-end-date').value = dates[1].trim();
            }
        }
        
        const tags = taskCard.querySelectorAll('.tag');
        if (tags.length > 0) {
            const tagText = Array.from(tags).map(tag => tag.textContent.trim()).join(', ');
            document.getElementById('task-tags').value = tagText;
        }
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('task-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentEditingTask = null;
}

// Close modal on Escape key (after closing any open custom select)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openSelect = document.querySelector('.custom-select.is-open');
        if (openSelect) {
            closeCustomSelect(openSelect);
            return;
        }
        closeModal();
    }
});

// ===== TASK OPERATIONS =====
async function submitTask(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        if (currentEditingTask) {
            // Update existing task
            const data = {
                title: formData.get('task'),
                description: formData.get('description'),
                category: formData.get('category'),
                priority: formData.get('priority'),
                start_date: formData.get('start_date'),
                end_date: formData.get('end_date'),
                tags: formData.get('tags')
            };
            
            const response = await fetch(`/update/${currentEditingTask}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showToast('Task updated successfully!');
                closeModal();
                setTimeout(() => location.reload(), 500);
            }
        } else {
            // Create new task
            const response = await fetch('/add', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                showToast('Task created successfully!');
                closeModal();
                setTimeout(() => location.reload(), 500);
            }
        }
    } catch (error) {
        console.error('Error submitting task:', error);
        showToast('Error saving task. Please try again.', 'error');
    }
}

async function toggleTask(taskId) {
    try {
        const response = await fetch(`/toggle/${taskId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const data = await response.json();
            const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
            
            if (taskCard) {
                // Add completion animation
                taskCard.style.transition = 'all 0.3s ease';
                
                if (data.done) {
                    taskCard.classList.add('task-completed');
                    const checkbox = taskCard.querySelector('.task-checkbox');
                    checkbox.classList.add('checked');
                    checkbox.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
                    showToast('Task completed! 🎉');
                } else {
                    taskCard.classList.remove('task-completed');
                    const checkbox = taskCard.querySelector('.task-checkbox');
                    checkbox.classList.remove('checked');
                    checkbox.innerHTML = '<i class="bi bi-circle"></i>';
                    showToast('Task marked as incomplete');
                }
                
                updateStats();
            }
        }
    } catch (error) {
        console.error('Error toggling task:', error);
        showToast('Error updating task', 'error');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Move this task to recycle bin?')) {
        return;
    }
    
    try {
        const response = await fetch(`/delete/${taskId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskCard) {
                // Animate out
                taskCard.style.animation = 'scaleOut 0.3s ease-out';
                setTimeout(() => {
                    taskCard.remove();
                    updateStats();
                    showToast('Task moved to recycle bin');
                    
                    // Check if no tasks remain
                    const remainingTasks = document.querySelectorAll('.task-card').length;
                    if (remainingTasks === 0) {
                        location.reload();
                    }
                }, 300);
            }
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Error deleting task', 'error');
    }
}

async function restoreTask(taskId) {
    try {
        const response = await fetch(`/restore/${taskId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            showToast('Task restored successfully!');
            setTimeout(() => location.reload(), 500);
        }
    } catch (error) {
        console.error('Error restoring task:', error);
        showToast('Error restoring task', 'error');
    }
}

async function permanentDelete(taskId) {
    if (!confirm('Permanently delete this task? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/permanent-delete/${taskId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            showToast('Task permanently deleted');
            setTimeout(() => location.reload(), 500);
        }
    } catch (error) {
        console.error('Error permanently deleting task:', error);
        showToast('Error deleting task', 'error');
    }
}

// ===== SEARCH & FILTER =====
async function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const taskCards = document.querySelectorAll('.task-card');
    
    taskCards.forEach(card => {
        const title = card.querySelector('.task-title').textContent.toLowerCase();
        const description = card.querySelector('.task-description');
        const descText = description ? description.textContent.toLowerCase() : '';
        
        if (title.includes(searchTerm) || descText.includes(searchTerm)) {
            card.style.display = '';
            card.style.animation = 'scaleIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
    
    updateVisibleTasksCount();
}

function handleFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const priorityFilter = document.getElementById('priority-filter').value;
    const taskCards = document.querySelectorAll('.task-card');
    
    taskCards.forEach(card => {
        const category = card.dataset.category;
        const priority = card.dataset.priority;
        
        const categoryMatch = categoryFilter === 'all' || category === categoryFilter;
        const priorityMatch = priorityFilter === 'all' || priority === priorityFilter;
        
        if (categoryMatch && priorityMatch) {
            card.style.display = '';
            card.style.animation = 'scaleIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
    
    updateVisibleTasksCount();
}

function updateVisibleTasksCount() {
    const visibleTasks = document.querySelectorAll('.task-card:not([style*="display: none"])').length;
    const taskCountElement = document.querySelector('.section-title + .task-count');
    if (taskCountElement) {
        taskCountElement.textContent = `${visibleTasks} tasks`;
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    
    // Update icon and color based on type
    if (type === 'success') {
        toast.style.background = 'rgba(52, 199, 89, 0.9)';
        toastIcon.className = 'bi bi-check-circle-fill';
    } else if (type === 'error') {
        toast.style.background = 'rgba(255, 59, 48, 0.9)';
        toastIcon.className = 'bi bi-x-circle-fill';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function updateStats() {
    const taskCards = document.querySelectorAll('.task-card');
    const completedTasks = document.querySelectorAll('.task-card.task-completed').length;
    const totalTasks = taskCards.length;
    
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    
    if (totalTasksElement) {
        animateNumber(totalTasksElement, parseInt(totalTasksElement.textContent) || 0, totalTasks);
    }
    if (completedTasksElement) {
        animateNumber(completedTasksElement, parseInt(completedTasksElement.textContent) || 0, completedTasks);
    }
}

function animateNumber(element, start, end) {
    if (start === end) return;
    
    const duration = 500;
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// ===== ANIMATIONS =====
// Add scale out animation for deletions
const style = document.createElement('style');
style.textContent = `
    @keyframes scaleOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
    
    // Ctrl/Cmd + N to create new task
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openAddModal();
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load task cards on scroll
if ('IntersectionObserver' in window) {
    const taskObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.task-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        taskObserver.observe(card);
    });
}

// ===== SERVICE WORKER FOR OFFLINE SUPPORT (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable offline support
        // navigator.serviceWorker.register('/static/sw.js');
    });
}
