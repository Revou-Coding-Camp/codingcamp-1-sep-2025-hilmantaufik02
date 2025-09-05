const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const todoList = document.getElementById("todo-list");
const filterBtn = document.getElementById("filter-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Simpan ke localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Render list
function renderTodos(filter = false) {
  todoList.innerHTML = "";

  let filtered = filter ? todos.filter(todo => !todo.done) : todos;

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
      <td class="p-2">${todo.date}</td>
      <td class="p-2">${todo.done ? "✅ Done" : "⏳ Pending"}</td>
      <td class="p-2">
        <button onclick="toggleStatus(${index})" class="bg-green-500 hover:bg-green-600 px-2 py-1 rounded">Toggle</button>
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

  if (!task || !date) {
    alert("Please enter a task and a date.");
    return;
  }

  todos.push({ task, date, done: false });
  saveTodos();
  taskInput.value = "";
  dateInput.value = "";

  renderTodos();
});

// Toggle status
function toggleStatus(index) {
  todos[index].done = !todos[index].done;
  saveTodos();
  renderTodos();
}

// Delete single task
function deleteTodo(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  }
}

// Delete all
deleteAllBtn.addEventListener("click", () => {
  if (confirm("Delete all tasks?")) {
    todos = [];
    saveTodos();
    renderTodos();
  }
});

// Filter pending
filterBtn.addEventListener("click", () => {
  renderTodos(true);
});

// Initial render
renderTodos();
