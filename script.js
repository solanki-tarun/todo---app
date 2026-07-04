// =========================
// Advanced To-Do App
// Part 3A
// =========================

// DOM Elements
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const emptyState = document.getElementById("emptyState");

// Data
let tasks = [];

// -------------------------
// Event Listeners
// -------------------------

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// -------------------------
// Add Task
// -------------------------

function addTask() {

    const text = taskInput.value.trim();
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };

    tasks.push(task);

    renderTasks();

    clearInputs();
}

// -------------------------
// Clear Inputs
// -------------------------

function clearInputs() {

    taskInput.value = "";
    priorityInput.value = "Medium";
    dueDateInput.value = "";

}

// -------------------------
// Render Tasks
// -------------------------

function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `

<div class="task-left">

<div>

<div class="task-text">
${task.text}
</div>

<small>
📅 ${task.dueDate || "No Due Date"}
</small>

</div>

<span class="priority ${task.priority.toLowerCase()}">
${task.priority}
</span>

</div>

<div class="task-right">

<button class="complete" onclick="toggleComplete(${task.id})">
<i class="fa-solid fa-check"></i>
</button>

<button class="edit" onclick="editTask(${task.id})">
<i class="fa-solid fa-pen"></i>
</button>

<button class="delete" onclick="deleteTask(${task.id})">
<i class="fa-solid fa-trash"></i>
</button>

</div>

`;

        taskList.appendChild(li);

    });

    updateStats();

}

// -------------------------
// Statistics
// -------------------------

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}

// -------------------------
// Placeholder Functions
// (Implemented in Part 3B)
// -------------------------
// =========================
// COMPLETE TASK
// =========================

function toggleComplete(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;

    });

    renderTasks();
}


// =========================
// EDIT TASK
// =========================

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) return;

    if (newText.trim() === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.text = newText.trim();

    renderTasks();

}


// =========================
// DELETE TASK
// =========================

function deleteTask(id) {

    const confirmDelete = confirm("Delete this task?");

    if (!confirmDelete) return;

    tasks = tasks.filter(task => task.id !== id);

    renderTasks();

}


// =========================
// SEARCH TASKS
// =========================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {

    const value = searchInput.value.toLowerCase();

    document.querySelectorAll("#taskList .task").forEach(task => {

        const text = task.querySelector(".task-text")
            .textContent
            .toLowerCase();

        if (text.includes(value)) {

            task.style.display = "flex";

        } else {

            task.style.display = "none";

        }

    });

});


// =========================
// FILTER TASKS
// =========================

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        const filter = this.dataset.filter;

        document.querySelectorAll("#taskList .task").forEach((element, index) => {

            const task = tasks[index];

            if (filter === "all") {

                element.style.display = "flex";

            }

            else if (filter === "active") {

                element.style.display =
                    task.completed ? "none" : "flex";

            }

            else if (filter === "completed") {

                element.style.display =
                    task.completed ? "flex" : "none";

            }

        });

    });

});

// ===============================
// LOCAL STORAGE
// ===============================

// Save Tasks
function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Load Tasks
function loadTasks() {

    const storedTasks = localStorage.getItem("todoTasks");

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }

    renderTasks();
}

// Save whenever tasks change
const oldRenderTasks = renderTasks;

renderTasks = function () {
    oldRenderTasks();
    saveTasks();
};

// ===============================
// DARK MODE
// ===============================

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});

// Load Theme

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}

// ===============================
// CLEAR COMPLETED
// ===============================

const clearCompletedBtn =
document.getElementById("clearCompleted");

clearCompletedBtn.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    renderTasks();

});

// ===============================
// DELETE ALL TASKS
// ===============================

const deleteAllBtn =
document.getElementById("deleteAll");

deleteAllBtn.addEventListener("click", () => {

    if (tasks.length === 0) {

        alert("No tasks available.");

        return;

    }

    const confirmDelete =
    confirm("Delete all tasks?");

    if (!confirmDelete) return;

    tasks = [];

    renderTasks();

});

// ===============================
// AUTO LOAD TASKS
// ===============================

loadTasks();