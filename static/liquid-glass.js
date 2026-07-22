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
    
    // ShadCN-style selects + filter functionality
    initializeShadSelects();
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

// ===== SHADCN-STYLE SELECT =====
function initializeShadSelects() {
    document.querySelectorAll('.shad-select').forEach((selectEl) => {
        const trigger = selectEl.querySelector('.shad-select-trigger');
        const popover = selectEl.querySelector('.shad-select-popover');
        const hiddenInput = selectEl.querySelector('input[type="hidden"]');
        if (!trigger || !popover || !hiddenInput) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = selectEl.classList.contains('is-open');
            closeAllShadSelects();
            if (!isOpen) openShadSelect(selectEl);
        });

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!selectEl.classList.contains('is-open')) {
                    openShadSelect(selectEl);
                }
                if (e.key === 'ArrowUp') {
                    highlightShadItem(selectEl, 'last');
                } else {
                    highlightShadItem(selectEl, 'selected');
                }
            }
        });

        popover.addEventListener('click', (e) => e.stopPropagation());

        selectEl.querySelectorAll('.shad-select-item').forEach((option) => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                setShadSelectValue(selectEl, option.dataset.value, true);
                closeShadSelect(selectEl);
                trigger.focus();
            });

            option.addEventListener('mouseenter', () => {
                setHighlightedShadItem(selectEl, option);
            });
        });
    });

    document.addEventListener('click', closeAllShadSelects);

    document.addEventListener('keydown', (e) => {
        const openSelect = document.querySelector('.shad-select.is-open');
        if (!openSelect) return;

        const items = Array.from(openSelect.querySelectorAll('.shad-select-item'));
        const current = openSelect.querySelector('.shad-select-item.is-highlighted')
            || openSelect.querySelector('.shad-select-item.is-selected');
        const currentIndex = items.indexOf(current);

        if (e.key === 'Escape') {
            e.preventDefault();
            closeShadSelect(openSelect);
            openSelect.querySelector('.shad-select-trigger')?.focus();
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = items[(currentIndex + 1) % items.length];
            setHighlightedShadItem(openSelect, next);
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = items[(currentIndex - 1 + items.length) % items.length];
            setHighlightedShadItem(openSelect, prev);
            return;
        }

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const target = openSelect.querySelector('.shad-select-item.is-highlighted') || current;
            if (target) {
                setShadSelectValue(openSelect, target.dataset.value, true);
                closeShadSelect(openSelect);
                openSelect.querySelector('.shad-select-trigger')?.focus();
            }
        }
    });
}

function openShadSelect(selectEl) {
    const trigger = selectEl.querySelector('.shad-select-trigger');
    const popover = selectEl.querySelector('.shad-select-popover');
    selectEl.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    popover.hidden = false;
    highlightShadItem(selectEl, 'selected');
}

function closeShadSelect(selectEl) {
    const trigger = selectEl.querySelector('.shad-select-trigger');
    const popover = selectEl.querySelector('.shad-select-popover');
    selectEl.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    popover.hidden = true;
    selectEl.querySelectorAll('.shad-select-item.is-highlighted').forEach((item) => {
        item.classList.remove('is-highlighted');
    });
}

function closeAllShadSelects() {
    document.querySelectorAll('.shad-select.is-open').forEach(closeShadSelect);
}

function highlightShadItem(selectEl, mode) {
    const items = Array.from(selectEl.querySelectorAll('.shad-select-item'));
    if (!items.length) return;
    let target;
    if (mode === 'last') target = items[items.length - 1];
    else target = selectEl.querySelector('.shad-select-item.is-selected') || items[0];
    setHighlightedShadItem(selectEl, target);
}

function setHighlightedShadItem(selectEl, item) {
    selectEl.querySelectorAll('.shad-select-item').forEach((el) => {
        el.classList.toggle('is-highlighted', el === item);
    });
    item?.scrollIntoView({ block: 'nearest' });
}

function setShadSelectValue(selectEl, value, dispatchChange = false) {
    const label = selectEl.querySelector('.shad-select-value');
    const hiddenInput = selectEl.querySelector('input[type="hidden"]');
    const options = selectEl.querySelectorAll('.shad-select-item');
    let matched = null;

    options.forEach((option) => {
        const isSelected = option.dataset.value === value;
        option.classList.toggle('is-selected', isSelected);
        option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        if (isSelected) matched = option;
    });

    if (!matched) return;

    const textEl = matched.querySelector('.shad-select-item-text');
    label.textContent = textEl ? textEl.textContent.trim() : matched.textContent.trim();
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

// Close modal on Escape (selects handle Escape themselves while open)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (document.querySelector('.shad-select.is-open')) return;
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
