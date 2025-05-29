const userId = localStorage.getItem("loggedInUser");
if (!userId) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
}
const STORAGE_KEY = `timetable_${userId}`;

const COLORS = ["bg-color-1", "bg-color-2", "bg-color-3", "bg-color-4", "bg-color-5", "bg-color-6", "bg-color-7"];

// ✅ 시간 목록 생성 (09:00 ~ 20:00)
const TIME_OPTIONS = Array.from({ length: 13 }, (_, i) => {
  const hour = (i + 9).toString().padStart(2, '0');
  return `${hour}:00`;
});

function generateEmptyTable() {
  const tbody = document.getElementById("timetableBody");
  tbody.innerHTML = "";

  for (let time of TIME_OPTIONS) {
    const tr = document.createElement("tr");
    const timeCell = document.createElement("td");
    timeCell.textContent = time;
    timeCell.className = "time-cell";
    tr.appendChild(timeCell);

    for (let i = 0; i < 6; i++) {
      const td = document.createElement("td");
      td.className = "timetable-cell";
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  // ✅ 드롭다운 시간 옵션 적용
  const startTimeSelect = document.getElementById("startTime");
  const endTimeSelect = document.getElementById("endTime");
  startTimeSelect.innerHTML = "";
  endTimeSelect.innerHTML = "";

  TIME_OPTIONS.forEach(time => {
    const startOpt = document.createElement("option");
    startOpt.value = time;
    startOpt.textContent = time;
    startTimeSelect.appendChild(startOpt);

    const endOpt = document.createElement("option");
    endOpt.value = time;
    endOpt.textContent = time;
    endTimeSelect.appendChild(endOpt);
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
  const dayMap = { "월": 1, "화": 2, "수": 3, "목": 4, "금": 5, "토": 6 };
  const colIdx = dayMap[day];

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