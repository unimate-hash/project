const userId = localStorage.getItem("loggedInUser");
if (!userId) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
}

const STORAGE_KEY = `assignments_${userId}`;
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  const container = document.getElementById("taskList");
  container.innerHTML = "";

  const sorted = [...tasks].sort((a, b) => new Date(a.due) - new Date(b.due));

  for (const task of sorted) {
    const div = document.createElement("div");
    let importanceClass =
      task.importance === "높음" ? "high"
      : task.importance === "보통" ? "medium"
      : "low";

    let statusClass = task.done ? "done" : "";

    div.className = `task-card ${importanceClass} ${statusClass}`;
    div.innerHTML = `
      <div class="task-title">${task.subject}</div>
      <div class="task-meta">마감일: ${task.due}</div>
      <div class="task-meta">메모: ${task.memo}</div>
      <div class="task-meta">
        <label>
          <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleDone('${task.id}')"> 완료
        </label>
        <button onclick="deleteTask('${task.id}')" class="delete-button">삭제</button>
      </div>
    `;
    container.appendChild(div);
  }
}

function toggleDone(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function addTask() {
  const subject = document.getElementById("subject").value.trim();
  const due = document.getElementById("due").value;
  const importance = document.getElementById("importance").value;
  const memo = document.getElementById("memo").value.trim();

  if (!subject || !due) {
    alert("과목명과 마감일을 입력해주세요.");
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    subject,
    due,
    importance,
    memo,
    done: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  document.getElementById("subject").value = "";
  document.getElementById("due").value = "";
  document.getElementById("importance").value = "보통";
  document.getElementById("memo").value = "";
}

window.onload = renderTasks;