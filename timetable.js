const COLORS = [
    "bg-color-1", "bg-color-2", "bg-color-3",
    "bg-color-4", "bg-color-5", "bg-color-6", "bg-color-7"
  ];
  
  function generateEmptyTable() {
    const times = [
      "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00"
    ];
    const tbody = document.getElementById("timetableBody");
    tbody.innerHTML = "";
  
    for (let time of times) {
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
  }
  
  function addToTimetable() {
    const course = document.getElementById("courseName").value;
    const room = document.getElementById("classroom").value;
    const start = document.getElementById("startTime").value;
    const end = document.getElementById("endTime").value;
    const day = document.getElementById("day").value;
  
    const times = [
      "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00"
    ];
    const startIdx = times.indexOf(start);
    const endIdx = times.indexOf(end);
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
    localStorage.setItem("timetableBody", tbody.innerHTML);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    generateEmptyTable();
    const saved = localStorage.getItem("timetableBody");
    if (saved) {
      document.getElementById("timetableBody").innerHTML = saved;
    }
  });
  
  // 🎯 수정/삭제 팝업 기능
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
  