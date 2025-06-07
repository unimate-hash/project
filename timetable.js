const STORAGE_KEY = "timetable_data";

const TIME_OPTIONS = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 9;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const COLORS = ["bg-color-1", "bg-color-2", "bg-color-3", "bg-color-4", "bg-color-5", "bg-color-6", "bg-color-7"];

function generateEmptyTable() {
  const tbody = document.getElementById("timetableBody");
  tbody.innerHTML = "";

  for (let time of TIME_OPTIONS) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${time}</td>` + "<td></td>".repeat(6);
    tbody.appendChild(tr);
  }

  const start = document.getElementById("startTime");
  const end = document.getElementById("endTime");
  TIME_OPTIONS.forEach(t => {
    const o1 = new Option(t, t);
    const o2 = new Option(t, t);
    start.add(o1);
    end.add(o2);
  });
}

function addToTimetable() {
  const course = document.getElementById("courseName").value;
  const room = document.getElementById("classroom").value;
  const custom = document.getElementById("customRoom").value;
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;
  const day = document.getElementById("day").value;

  const useRoom = room === "직접 입력" ? custom : room;
  const dayMap = { "월": 1, "화": 2, "수": 3, "목": 4, "금": 5, "토": 6 };
  const startIdx = TIME_OPTIONS.indexOf(start);
  const endIdx = TIME_OPTIONS.indexOf(end);
  const col = dayMap[day];

  if (!course || !start || !end || !day || startIdx >= endIdx) {
    alert("입력을 다시 확인해주세요");
    return;
  }

  const rows = document.querySelectorAll("#timetableBody tr");
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  for (let i = startIdx; i < endIdx; i++) {
    const td = rows[i].children[col];
    td.innerHTML = `<div class="class-cell ${color}">${course}<br><span class="room">${useRoom}</span></div>`;
  }

  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, document.getElementById("timetableBody").innerHTML);
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    document.getElementById("timetableBody").innerHTML = saved;
  }
}

let selectedCell = null;

document.addEventListener("click", function (e) {
  const cell = e.target.closest("td");
  if (cell && cell.querySelector(".class-cell")) {
    selectedCell = cell;
    document.getElementById("editCourse").value = cell.querySelector(".class-cell").childNodes[0]?.textContent?.trim() || "";
    document.getElementById("editRoom").value = cell.querySelector(".room")?.textContent?.trim() || "";
    document.getElementById("editModal").style.display = "flex";
  }
});

function applyEdit() {
  if (!selectedCell) return;
  const course = document.getElementById("editCourse").value;
  const room = document.getElementById("editRoom").value;
  selectedCell.innerHTML = `<div class="class-cell">${course}<br><span class="room">${room}</span></div>`;
  closeModal();
  saveToLocalStorage();
}

function deleteCell() {
  if (!selectedCell) return;
  selectedCell.innerHTML = "";
  closeModal();
  saveToLocalStorage();
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
  selectedCell = null;
}

document.addEventListener("DOMContentLoaded", () => {
  generateEmptyTable();
  loadFromLocalStorage();
  const uid = localStorage.getItem("loggedInUser");
  const uname = localStorage.getItem("loggedInName");
  if (!uid || !uname) {
    alert("로그인이 필요합니다.");
    location.href = "login.html";
  } else {
    document.getElementById("userInfo").textContent = `${uid} ${uname}님 환영합니다!`;
  }
});
