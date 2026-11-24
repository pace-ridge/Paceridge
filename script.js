
// ==================================
// PACERIDGE - MAIN JAVASCRIPT
// ==================================

// LOAD SAVED DATA

let tasks = JSON.parse(localStorage.getItem("paceridgeTasks") || "[]");
let goals = JSON.parse(localStorage.getItem("paceridgeGoals") || "[]");

const taskList = document.getElementById("taskList");
const goalList = document.getElementById("goalList");

function saveData() {
  localStorage.setItem("paceridgeTasks", JSON.stringify(tasks));
  localStorage.setItem("paceridgeGoals", JSON.stringify(goals));
}

// DATE

const todayDate = document.getElementById("todayDate");

todayDate.textContent = new Date().toLocaleDateString("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric"
});

// ==================================
// TASK SYSTEM
// ==================================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

taskForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = taskInput.value.trim();

  if (!name) return;

  tasks.push({
    id: Date.now() + Math.random(),
    name: name,
    completed: false
  });

  taskInput.value = "";

  saveData();
  renderTasks();
});

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML =
      '<p class="empty-message">No tasks yet. Add your first task!</p>';
  }

  tasks.forEach(function(task) {
    const item = document.createElement("div");

    item.className = "task-item" +
      (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Complete task");

    checkbox.addEventListener("change", function() {
      task.completed = checkbox.checked;
      saveData();
      renderTasks();
    });

    const name = document.createElement("span");
    name.className = "task-name";
    name.textContent = task.name;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function() {
      tasks = tasks.filter(function(t) {
        return t.id !== task.id;
      });

      saveData();
      renderTasks();
    });

    item.append(checkbox, name, deleteButton);
    taskList.appendChild(item);
  });

  updateStatistics();
}

function updateStatistics() {
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  const progress = tasks.length === 0
    ? 0
    : Math.round((completed / tasks.length) * 100);

  document.getElementById("completedCount").textContent = completed;

  document.getElementById("pendingCount").textContent = pending;

  document.getElementById("progressPercent").textContent =
    progress + "%";

  document.getElementById("progressBar").style.width =
    progress + "%";

  document.getElementById("taskBadge").textContent =
    tasks.length + (tasks.length === 1 ? " task" : " tasks");
}

// ==================================
// GOALS SYSTEM
// ==================================

const goalForm = document.getElementById("goalForm");
const goalInput = document.getElementById("goalInput");

goalForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = goalInput.value.trim();

  if (!name) return;

  goals.push({
    id: Date.now() + Math.random(),
    name: name,
    completed: false
  });

  goalInput.value = "";

  saveData();
  renderGoals();
});

function renderGoals() {
  goalList.innerHTML = "";

  if (goals.length === 0) {
    goalList.innerHTML =
      '<p class="empty-message">Your goals will appear here.</p>';
  }

  goals.forEach(function(goal) {
    const item = document.createElement("div");

    item.className = "goal-item" +
      (goal.completed ? " completed" : "");

    const name = document.createElement("span");
    name.textContent = goal.name;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = goal.completed;
    checkbox.setAttribute("aria-label", "Complete goal");

    checkbox.addEventListener("change", function() {
      goal.completed = checkbox.checked;
      saveData();
      renderGoals();
    });

    item.append(name, checkbox);
    goalList.appendChild(item);
  });
}

// ==================================
// FOCUS TIMER
// ==================================

let timeLeft = 25 * 60;
let timerInterval = null;

const timerDisplay = document.getElementById("timerDisplay");
const startButton = document.getElementById("startTimer");
const resetButton = document.getElementById("resetTimer");

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.textContent =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}

startButton.addEventListener("click", function() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
    startButton.textContent = "Resume";
    return;
  }

  if (timeLeft <= 0) return;

  startButton.textContent = "Pause";

  timerInterval = setInterval(function() {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      startButton.textContent = "Start";
      alert("Focus session complete! Great work!");
    }
  }, 1000);
});

resetButton.addEventListener("click", function() {
  clearInterval(timerInterval);
  timerInterval = null;

  timeLeft = 25 * 60;

  startButton.textContent = "Start";

  updateTimerDisplay();
});

// ==================================
// INITIALISE APP
// ==================================

renderTasks();
renderGoals();
updateTimerDisplay();

console.log("PACERIDGE is ready!");
