function allowDrop(event) {
    event.preventDefault();
}

function dragStart(event) {
    event.dataTransfer.setData("task-id", event.target.dataset.taskId);
}

function dropTask(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("task-id");
    deleteTask(taskId);
    zoomOutRecycleBin(); // Zoom out after dropping the task
}

function deleteTask(taskId) {
    fetch(`/delete/${taskId}`, { method: 'POST' })
        .then(() => {
            updateRecycleBinIcon();
            location.reload();
        });
}

function restoreTask(taskId) {
    fetch(`/restore/${taskId}`, { method: 'POST' })
        .then(() => {
            updateRecycleBinIcon();
            location.reload();
        });
}

function toggleTask(taskId) {
    fetch(`/toggle/${taskId}`, { method: 'POST' })
        .then(() => location.reload());
}

function updateRecycleBinIcon() {
    const recycleBinIcon = document.getElementById("recycle-bin-icon");
    const deletedCount = parseInt(document.getElementById("deleted-count").innerText);

    if (deletedCount > 0) {
        recycleBinIcon.classList.replace("bi-trash3-fill", "bi-recycle");
    } else {
        recycleBinIcon.classList.replace("bi-recycle", "bi-trash3-fill");
    }
}

// Zoom in effect on recycle bin
function zoomInRecycleBin() {
    const recycleBin = document.querySelector(".recycle-bin");
    recycleBin.classList.add("zoomed");
}

// Zoom out effect on recycle bin
function zoomOutRecycleBin() {
    const recycleBin = document.querySelector(".recycle-bin");
    recycleBin.classList.remove("zoomed");
}

// Event listeners for drag over and leave on recycle bin
const recycleBin = document.querySelector(".recycle-bin");
recycleBin.addEventListener("dragover", (event) => {
    event.preventDefault();
    zoomInRecycleBin(); // Zoom in when a task is dragged over the recycle bin
});
recycleBin.addEventListener("dragleave", zoomOutRecycleBin); // Zoom out when the task is dragged away

// Attach drag start event to all tasks
document.querySelectorAll('[draggable="true"]').forEach(item => {
    item.addEventListener("dragstart", dragStart);
});
