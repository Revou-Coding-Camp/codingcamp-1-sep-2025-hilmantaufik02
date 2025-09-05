const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const todoList = document.getElementById("todo-list");
const filterSelect = document.getElementById("filter-select");
const deleteAllBtn = document.getElementById("delete-all-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Simpan ke localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Render list
function renderTodos(filter = "all") {
  todoList.innerHTML = "";

  let filtered = todos;

  if (filter === "done") {
    filtered = todos.filter(todo => todo.done === true);
  } else if (filter === "pending") {
    filtered = todos.filter(todo => todo.done === false);
  } else if (filter === "nostatus") {
    filtered = todos.filter(todo => todo.done === undefined);
  }

  if (filtered.length === 0) {
    todoList.innerHTML = `
      <tr><td colspan="4" class="p-4 text-gray-400">No task found</td></tr>
    `;
    return;
  }

  filtered.forEach((todo, index) => {
    const row = document.createElement("tr");
    row.className = "border-b border-gray-700";

    row.innerHTML = `
      <td class="p-2">${todo.task}</td>
      <td class="p-2">${todo.date || "-"}</td>
      <td class="p-2">
        ${todo.done === undefined ? "❌ No Status" : todo.done ? "✅ Done" : "⏳ Pending"}
      </td>
      <td class="p-2 flex gap-1 justify-center">
        <button onclick="setStatus(${index}, true)" class="bg-green-500 hover:bg-green-600 px-2 py-1 rounded">Done</button>
        <button onclick="setStatus(${index}, false)" class="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded">Pending</button>
        <button onclick="setStatus(${index}, 'nostatus')" class="bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded">No Status</button>
        <button onclick="deleteTodo(${index})" class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded">Delete</button>
      </td>
    `;
    todoList.appendChild(row);
  });
}

// Add new task
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = taskInput.value.trim();
  const date = dateInput.value;

  if (!task) {
    alert("Please enter a task.");
    return;
  }

  todos.push({ task, date, done: undefined }); // default no status
  saveTodos();
  taskInput.value = "";
  dateInput.value = "";

  renderTodos(filterSelect.value);
});

// Set specific status
function setStatus(index, status) {
  if (status === "nostatus") {
    todos[index].done = undefined;
  } else {
    todos[index].done = status; // true = done, false = pending
  }
  saveTodos();
  renderTodos(filterSelect.value);
}

// Delete single task
function deleteTodo(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos(filterSelect.value);
  }
}

// Delete all
deleteAllBtn.addEventListener("click", () => {
  if (confirm("Delete all tasks?")) {
    todos = [];
    saveTodos();
    renderTodos(filterSelect.value);
  }
});

// Filter dropdown change
filterSelect.addEventListener("change", () => {
  renderTodos(filterSelect.value);
});

// Initial render
renderTodos();
