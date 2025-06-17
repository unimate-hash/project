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

// 드롭다운 변경 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    const classroomSelect = document.getElementById('classroom');
    const customInput = document.getElementById('customClassroom');
    
    if (classroomSelect && customInput) {
        classroomSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customInput.style.display = 'block';
                customInput.focus();
            } else {
                customInput.style.display = 'none';
                customInput.value = '';
            }
        });
    }
    
    generateEmptyTable();
    loadTimetable();
});

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
    startTimeSelect.innerHTML = ``;
    endTimeSelect.innerHTML = ``;
    
    TIME_OPTIONS.forEach(time => {
        const opt1 = new Option(time, time);
        const opt2 = new Option(time, time);
        startTimeSelect.appendChild(opt1);
        endTimeSelect.appendChild(opt2);
    });
}

function addToTimetable() {
    const course = document.getElementById("courseName").value.trim();
    const classroomSelect = document.getElementById("classroom");
    const customInput = document.getElementById("customClassroom");
    
    // 핵심: 수업 장소 결정 로직
    let room;
    if (classroomSelect.value === 'custom') {
        room = customInput.value.trim();
        if (!room) {
            alert("직접 입력을 선택했을 때는 수업 장소를 입력해주세요.");
            customInput.focus();
            return;
        }
    } else {
        room = classroomSelect.value;
    }
    
    if (!course) {
        alert("과목명을 입력해주세요.");
        return;
    }
    
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
            <div class="class-cell ${color}" onclick="openModal(this)">
                <div>${course}</div>
                <div class="room">${room}</div>
            </div>
        `;
    }
    
    // 폼 초기화
    document.getElementById("courseName").value = "";
    classroomSelect.selectedIndex = 0;
    customInput.style.display = 'none';
    customInput.value = '';
    document.getElementById("startTime").selectedIndex = 0;
    document.getElementById("endTime").selectedIndex = 0;
    document.getElementById("day").selectedIndex = 0;
    
    saveTimetable();
}

function openModal(element) {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
    modal.currentElement = element;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function deleteClass() {
    const modal = document.getElementById("modal");
    if (modal.currentElement) {
        modal.currentElement.innerHTML = "";
        closeModal();
        saveTimetable();
    }
}

function saveTimetable() {
    const tableData = [];
    const rows = document.querySelectorAll("#timetableBody tr");
    
    rows.forEach((row, timeIndex) => {
        const cells = row.querySelectorAll("td");
        for (let dayIndex = 1; dayIndex < cells.length; dayIndex++) {
            const cell = cells[dayIndex];
            const classDiv = cell.querySelector(".class-cell");
            if (classDiv) {
                const course = classDiv.querySelector("div:first-child").textContent;
                const room = classDiv.querySelector(".room").textContent;
                const color = Array.from(classDiv.classList).find(cls => cls.startsWith("bg-color"));
                
                tableData.push({
                    timeIndex,
                    dayIndex,
                    course,
                    room,
                    color
                });
            }
        }
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tableData));
}

function loadTimetable() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        const tableData = JSON.parse(savedData);
        const rows = document.querySelectorAll("#timetableBody tr");
        
        tableData.forEach(item => {
            const cell = rows[item.timeIndex].children[item.dayIndex];
            cell.innerHTML = `
                <div class="class-cell ${item.color}" onclick="openModal(this)">
                    <div>${item.course}</div>
                    <div class="room">${item.room}</div>
                </div>
            `;
        });
    }
}
