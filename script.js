// ---------- 1. Grab elements from the page ----------
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const emptyMessage = document.getElementById("empty-message");

// ---------- 2. Load tasks (or start with an empty array) ----------
// localStorage only stores text, so we save tasks as a JSON string
// and convert them back with JSON.parse when loading.
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ---------- 3. Save tasks ----------
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---------- 4. Draw the tasks on the page ----------
function render() {
  list.innerHTML = ""; // clear the list, then rebuild it

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.textContent = task.title; // textContent is safe against HTML injection

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, text, deleteBtn);
    list.appendChild(li);
  });

  // Update the counter and the empty message
  const remaining = tasks.filter((t) => !t.completed).length;
  counter.textContent = tasks.length ? `${remaining} of ${tasks.length} tasks left` : "";
  emptyMessage.style.display = tasks.length ? "none" : "block";
}

// ---------- 5. The CRUD functions ----------
function addTask(title) {
  tasks.push({ id: Date.now(), title: title, completed: false });
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

// ---------- 6. Handle the form ----------
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  const title = input.value.trim();
  if (title === "") return;
  addTask(title);
  input.value = "";
  input.focus();
});

// ---------- 7. First draw when the page opens ----------
render();