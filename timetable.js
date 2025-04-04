<script>
const COLORS = [
  "bg-red-100", "bg-green-100", "bg-yellow-100",
  "bg-indigo-100", "bg-pink-100", "bg-purple-100", "bg-teal-100"
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
    timeCell.className = "border px-1 py-1";
    timeCell.textContent = time;
    tr.appendChild(timeCell);

    for (let i = 0; i < 6; i++) {
      const td = document.createElement("td");
      td.className = "border h-12";
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
}

function addToTimetable() {
  const course = document.getElementById('courseName').value;
  const room = document.getElementById('classroom').value;
  const start = document.getElementById('startTime').value;
  const end = document.getElementById('endTime').value;
  const day = document.getElementById('day').value;

  const times = [
    "09:00","10:00","11:00","12:00","13:00",
    "14:00","15:00","16:00","17:00","18:00","19:00","20:00"
  ];
  const startIdx = times.indexOf(start);
  const endIdx = times.indexOf(end);
  const dayMap = {"월":1, "화":2, "수":3, "목":4, "금":5, "토":6};
  const colIdx = dayMap[day];

  if (startIdx === -1 || endIdx === -1 || colIdx === undefined || startIdx >= endIdx) {
    alert("유효한 입력을 확인해주세요");
    return;
  }

  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const rows = document.querySelectorAll("#timetableBody tr");

  for (let i = startIdx; i < endIdx; i++) {
    const cell = rows[i].children[colIdx];
    cell.innerHTML = `<div class='text-xs leading-tight'>${course}<br><span class='text-gray-500'>${room}</span></div>`;
    cell.className = `border h-12 ${color}`;
  }

  saveToLocalStorage();
}

function saveToLocalStorage() {
  const tableHTML = document.querySelector("table").outerHTML;
  localStorage.setItem("timetable", tableHTML);
}

document.addEventListener("DOMContentLoaded", () => {
  generateEmptyTable();
  const saved = localStorage.getItem("timetable");
  if (saved) {
    document.querySelector("table").outerHTML = saved;
  }
});
</script>