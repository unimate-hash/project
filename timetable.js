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

// 페이지 로드 시 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    generateEmptyTable();
    loadTimetable();
    setupCustomInput();
});

function setupCustomInput() {
    const classroomSelect = document.getElementById("classroom");
    
    // 직접 입력 필드를 동적으로 생성
    const customInput = document.createElement('input');
    customInput.type = 'text';
    customInput.id = 'customClassroom';
    customInput.className = 'form-input';
    customInput.placeholder = '수업 장소를 입력하세요';
    customInput.style.display = 'none';
    customInput.style.marginTop = '0.5rem';
    
    // select 요소 다음에 input 추가
    classroomSelect.parentNode.appendChild(customInput);
    
    // 드롭다운 변경 이벤트 리스너
    classroomSelect.addEventListener('change', function() {
        if (this.value === '직접 입력') {
            customInput.style.display = 'block';
            customInput.focus();
        } else {
            customInput.style.display = 'none';
            customInput.value = '';
        }
    });
}

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
    
    if (startTimeSelect && endTimeSelect) {
        startTimeSelect.innerHTML = ``;
        endTimeSelect.innerHTML = ``;
        
        TIME_OPTIONS.forEach(time => {
            const opt1 = new Option(time, time);
            const opt2 = new Option(time, time);
            startTimeSelect.appendChild(opt1);
            endTimeSelect.appendChild(opt2);
        });
    }
}

function addToTimetable() {
    const course = document.getElementById("courseName").value.trim();
    const classroomSelect = document.getElementById("classroom");
    const customInput = document.getElementById("customClassroom");
    const start = document.getElementById("startTime").value;
    const end = document.getElementById("endTime").value;
    const day = document.getElementById("day").value;

    // 수업 장소 결정 로직
    let room;
    if (classroomSelect.value === '직접 입력') {
        room = customInput.value.trim();
        if (!room) {
            alert("직접 입력을 선택했을 때는 수업 장소를 입력해주세요.");
            customInput.focus();
            return;
        }
    } else {
        room = classroomSelect.value;
    }

    // 입력 값 검증
    if (!course) {
        alert("과목명을 입력해주세요.");
        return;
    }

    const startIdx = TIME_OPTIONS.indexOf(start);
    const endIdx = TIME_OPTIONS.indexOf(end);
    const colIdx = { "월": 1, "화": 2, "수": 3, "목": 4, "금": 5, "토": 6 }[day];

    if (startIdx === -1 || endIdx === -1 || colIdx === undefined || startIdx >= endIdx) {
        alert("유효한 입력을 확인해주세요");
        return;
    }

    // 시간 충돌 검사
    const rows = document.querySelectorAll("#timetableBody tr");
    for (let i = startIdx; i < endIdx; i++) {
        const cell = rows[i].children[colIdx];
        if (cell.innerHTML.trim() !== '') {
            alert("해당 시간에 이미 수업이 있습니다.");
            return;
        }
    }

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
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
    if (customInput) {
        customInput.style.display = 'none';
        customInput.value = '';
    }
    document.getElementById("startTime").selectedIndex = 0;
    document.getElementById("endTime").selectedIndex = 0;
    document.getElementById("day").selectedIndex = 0;
    
    saveTimetable();
}

function openModal(element) {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
    modal.dataset.target = element;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function deleteClass() {
    const modal = document.getElementById("modal");
    const target = modal.dataset.target;
    
    if (target) {
        // 모든 class-cell을 찾아서 target과 비교
        const allCells = document.querySelectorAll('.class-cell');
        for (let cell of allCells) {
            if (cell === target) {
                cell.parentElement.innerHTML = '';
                break;
            }
        }
    }
    
    closeModal();
    saveTimetable();
}

function saveTimetable() {
    const tbody = document.getElementById("timetableBody");
    const data = [];
    
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row, timeIndex) => {
        const cells = row.querySelectorAll("td");
        cells.forEach((cell, dayIndex) => {
            if (dayIndex > 0 && cell.innerHTML.trim() !== '') {
                const classDiv = cell.querySelector('.class-cell');
                if (classDiv) {
                    const course = classDiv.children[0].textContent;
                    const room = classDiv.children[1].textContent;
                    const color = classDiv.className.split(' ').find(c => c.startsWith('bg-color-'));
                    
                    data.push({
                        timeIndex,
                        dayIndex,
                        course,
                        room,
                        color
                    });
                }
            }
        });
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadTimetable() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const rows = document.querySelectorAll("#timetableBody tr");
    
    data.forEach(item => {
        const cell = rows[item.timeIndex].children[item.dayIndex];
        cell.innerHTML = `
            <div class="class-cell ${item.color}" onclick="openModal(this)">
                <div>${item.course}</div>
                <div class="room">${item.room}</div>
            </div>
        `;
    });
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        closeModal();
    }
}
