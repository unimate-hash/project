const userId = localStorage.getItem("loggedInUser");
const userName = localStorage.getItem("loggedInName");

if (!userId || !userName) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
} else {
  const userInfo = document.getElementById("userInfo");
  if (userInfo) {
    userInfo.textContent = `${userId} ${userName}님 환영합니다!`;
  }
}

const COLORS = ["bg-color-1", "bg-color-2", "bg-color-3", "bg-color-4", "bg-color-5", "bg-color-6", "bg-color-7"];
const TIME_OPTIONS = Array.from({ length: 13 }, (_, i) => `${(i + 9).toString().padStart(2, '0')}:00`);
const STORAGE_KEY = "timetableData";

function generateEmptyTable() {
  const tbody = document.getElementById("timetableBody");
  tbody.innerHTML = "";

  for (let time of TIME_OPTIONS) {
    const tr = document.createElement("tr");
    const timeCell = document.createElement("td");
    timeCell.textContent = time;
    tr.appendChild(timeCell);

    for (let i = 0; i < 6; i++) {
      const td = document.createElement("td");
      td.className = "timetable-cell";
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  const startTimeSelect = document.getElementById("startTime");
  const endTimeSelect = document.getElementById("endTime");
  startTimeSelect.innerHTML = `<option value="" disabled selected>수업 시작 시각</option>`;
  endTimeSelect.innerHTML = `<option value="" disabled selected>수업 종료 시각</option>`;

  TIME_OPTIONS.forEach(time => {
    const opt1 = new Option(time, time);
    const opt2 = new Option(time, time);
    startTimeSelect.appendChild(opt1);
    endTimeSelect.appendChild(opt2);
  });
}

function addToTimetable() {
  const course = document.getElementById("courseName").value;
  const room = document.getElementById("classroom").value;
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;
  const day = document.getElementById("day").value;

  const startIdx = TIME_OPTIONS.indexOf(start);
  const endIdx = TIME_OPTIONS.indexOf(end);
  const colIdx = { "월": 1, "화": 2, "수": 3, "목": 4, "금": 5, "토": 6 }[day];

  if (startIdx === -1 || endIdx === -1 || colIdx === undefined || startIdx >= endIdx) {
    alert("유효한 입력을 확인해주세요");
    return;
  }

  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const rows = document.querySelectorAll("#timetableBody tr");

  for (let i = startIdx; i < endIdx; i++) {
    const cell = rows[i].children[colIdx];
    cell.innerHTML = `
      <div class="class-cell ${color}">
        ${course}<br><span class="room">${room}</span>
      </div>`;
  }

  saveToLocalStorage();
}

function saveToLocalStorage() {
  const tbody = document.getElementById("timetableBody");
  localStorage.setItem(STORAGE_KEY, tbody.innerHTML);
}

document.addEventListener("DOMContentLoaded", () => {
  generateEmptyTable();
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    document.getElementById("timetableBody").innerHTML = saved;
  }
});

let selectedCell = null;

document.addEventListener("click", function (e) {
  const cell = e.target.closest("td");
  if (cell && cell.querySelector(".class-cell")) {
    selectedCell = cell;
    const courseText = cell.querySelector(".class-cell")?.childNodes[0]?.textContent?.trim() || "";
    const roomText = cell.querySelector(".room")?.textContent?.trim() || "";
    document.getElementById("editCourse").value = courseText;
    document.getElementById("editRoom").value = roomText;
    document.getElementById("editModal").style.display = "flex";
  }
});

function applyEdit() {
  if (!selectedCell) return;
  const course = document.getElementById("editCourse").value;
  const room = document.getElementById("editRoom").value;
  const classDiv = document.createElement("div");
  classDiv.className = "class-cell";
  classDiv.innerHTML = `${course}<br><span class="room">${room}</span>`;
  selectedCell.innerHTML = "";
  selectedCell.appendChild(classDiv);
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
