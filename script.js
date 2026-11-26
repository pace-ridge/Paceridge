// ==================================
// PACERIDGE V2 - MAIN JAVASCRIPT
// ==================================

// AUTHENTICATION & USER STATE
const authScreen = document.getElementById("authScreen");
const appContainer = document.getElementById("appContainer");
const authForm = document.getElementById("authForm");
const authIdentifier = document.getElementById("authIdentifier");
const authPassword = document.getElementById("authPassword");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const toggleAuthMode = document.getElementById("toggleAuthMode");
const guestBtn = document.getElementById("guestBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authMessage = document.getElementById("authMessage");
const userDisplay = document.getElementById("userDisplay");
const userAvatar = document.getElementById("userAvatar");

let isSignupMode = false;
let currentUser = localStorage.getItem("paceridgeCurrentUser") || null;
let tasks = [];
let goals = [];

function getUsers() {
  return JSON.parse(localStorage.getItem("paceridgeUsers") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("paceridgeUsers", JSON.stringify(users));
}

toggleAuthMode.addEventListener("click", function () {
  isSignupMode = !isSignupMode;
  authMessage.textContent = "";
  if (isSignupMode) {
    authSubmitBtn.textContent = "Create Account";
    toggleAuthMode.textContent = "Back to Log in";
  } else {
    authSubmitBtn.textContent = "Log in";
    toggleAuthMode.textContent = "Create an account";
  }
});

authForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const id = authIdentifier.value.trim();
  const pw = authPassword.value;
  if (!id || !pw) return;

  const users = getUsers();

  if (isSignupMode) {
    if (users[id]) {
      authMessage.textContent = "An account with this email/phone already exists.";
      return;
    }
    users[id] = { password: pw };
    saveUsers(users);
    loginUser(id);
  } else {
    if (!users[id] || users[id].password !== pw) {
      authMessage.textContent = "Invalid credentials. Try again or create an account.";
      return;
    }
    loginUser(id);
  }
});

guestBtn.addEventListener("click", function () {
  loginUser("guest");
});

logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("paceridgeCurrentUser");
  currentUser = null;
  authForm.reset();
  authMessage.textContent = "";
  appContainer.classList.add("hidden");
  authScreen.classList.remove("hidden");
});

function loginUser(userId) {
  currentUser = userId;
  localStorage.setItem("paceridgeCurrentUser", userId);

  if (userId === "guest") {
    userDisplay.textContent = "My Workspace";
    userAvatar.textContent = "G";
  } else {
    userDisplay.textContent = userId;
    userAvatar.textContent = userId.charAt(0).toUpperCase();
  }

  loadUserData();
  renderTasks();
  renderGoals();

  authScreen.classList.add("hidden");
  appContainer.classList.remove("hidden");
}

// LOAD & SAVE DATA PER USER
function loadUserData() {
  const keyPrefix = "paceridge_" + currentUser + "_";
  tasks = JSON.parse(localStorage.getItem(keyPrefix + "tasks") || "[]");
  goals = JSON.parse(localStorage.getItem(keyPrefix + "goals") || "[]");
}

function saveData() {
  if (!currentUser) return;
  const keyPrefix = "paceridge_" + currentUser + "_";
  localStorage.setItem(keyPrefix + "tasks", JSON.stringify(tasks));
  localStorage.setItem(keyPrefix + "goals", JSON.stringify(goals));
}

// DATE
const todayDate = document.getElementById("todayDate");
if (todayDate) {
  todayDate.textContent = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// ==================================
// TASK SYSTEM
// ==================================

const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

taskForm.addEventListener("submit", function (event) {
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
    taskList.innerHTML = '<p class="empty-message">No tasks yet. Add your first task!</p>';
  }

  tasks.forEach(function (task) {
    const item = document.createElement("div");
    item.className = "task-item" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Complete task");

    checkbox.addEventListener("change", function () {
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

    deleteButton.addEventListener("click", function () {
      tasks = tasks.filter(t => t.id !== task.id);
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
  const progress = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  document.getElementById("completedCount").textContent = completed;
  document.getElementById("pendingCount").textContent = pending;
  document.getElementById("progressPercent").textContent = progress + "%";
  document.getElementById("progressBar").style.width = progress + "%";
  document.getElementById("taskBadge").textContent =
    tasks.length + (tasks.length === 1 ? " task" : " tasks");
}

// ==================================
// GOALS SYSTEM
// ==================================

const goalList = document.getElementById("goalList");
const goalForm = document.getElementById("goalForm");
const goalInput = document.getElementById("goalInput");

goalForm.addEventListener("submit", function (event) {
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
    goalList.innerHTML = '<p class="empty-message">Your goals will appear here.</p>';
  }

  goals.forEach(function (goal) {
    const item = document.createElement("div");
    item.className = "goal-item" + (goal.completed ? " completed" : "");

    const name = document.createElement("span");
    name.textContent = goal.name;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = goal.completed;
    checkbox.setAttribute("aria-label", "Complete goal");

    checkbox.addEventListener("change", function () {
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

let selectedMinutes = 25;
let timeLeft = selectedMinutes * 60;
let timerInterval = null;

const timerDisplay = document.getElementById("timerDisplay");
const startButton = document.getElementById("startTimer");
const resetButton = document.getElementById("resetTimer");
const minutesInput = document.getElementById("minutesInput");
const setTimeBtn = document.getElementById("setTimeBtn");
const timerNote = document.getElementById("timerNote");

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

setTimeBtn.addEventListener("click", function () {
  const mins = parseInt(minutesInput.value, 10);
  if (isNaN(mins) || mins < 1 || mins > 180) return;

  clearInterval(timerInterval);
  timerInterval = null;
  selectedMinutes = mins;
  timeLeft = selectedMinutes * 60;
  startButton.textContent = "Start";
  timerNote.textContent = selectedMinutes + "-minute focus session";
  updateTimerDisplay();
});

startButton.addEventListener("click", function () {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
    startButton.textContent = "Resume";
    return;
  }

  if (timeLeft <= 0) return;
  startButton.textContent = "Pause";

  timerInterval = setInterval(function () {
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

resetButton.addEventListener("click", function () {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = selectedMinutes * 60;
  startButton.textContent = "Start";
  updateTimerDisplay();
});

// ==================================
// INITIALISE APP
// ==================================

updateTimerDisplay();
if (currentUser) {
  loginUser(currentUser);
}
