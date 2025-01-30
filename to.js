// Get DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Function to add a task
const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    let tasks = getTasksFromStorage();
    tasks.push(task);
    saveTasksToStorage(tasks);
    renderTask(task);
    taskInput.value = '';
};

// Function to render a task
const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.innerHTML = `
        <span class="task ${task.completed ? 'completed' : ''}">${task.text}</span>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

    // Toggle completion
    li.querySelector('.task').addEventListener('click', () => toggleComplete(task.id));

    // Edit task
    li.querySelector('.edit-btn').addEventListener('click', () => editTask(task.id));

    // Delete task
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(li);
};

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(renderTask);
}

// Function to get tasks from localStorage
function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Function to save tasks to localStorage
function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to toggle task completion
function toggleComplete(id) {
    let tasks = getTasksFromStorage();
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    saveTasksToStorage(tasks);
    refreshTaskList();
}

// Function to edit a task
function editTask(id) {
    let tasks = getTasksFromStorage();
    const task = tasks.find(task => task.id === id);

    const newText = prompt('Edit task:', task.text);
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasksToStorage(tasks);
        refreshTaskList();
    }
}

// Function to delete a task
function deleteTask(id) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage(tasks);
    refreshTaskList();
}

// Function to clear all tasks
const clearAllTasks = () => {
    localStorage.removeItem('tasks');
    taskList.innerHTML = '';
};

// Function to refresh task list (for updating UI)
function refreshTaskList() {
    taskList.innerHTML = '';
    loadTasks();
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
clearAllBtn.addEventListener('click', clearAllTasks);
taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});