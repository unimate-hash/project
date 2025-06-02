async function fetchJsonData() {
  try {
    const response = await fetch('class.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getCurrentTimeSlot() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  return `${hours}:00`;
}

function getDayOfWeek() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

function updateClassroomStatus(classrooms) {
  const currentTimeSlot = getCurrentTimeSlot();
  const currentDay = getDayOfWeek();
  
  classrooms.forEach(classroom => {
    const todaySchedule = classroom.schedule[currentDay];
    if (todaySchedule) {
      const currentTimeSlotInfo = todaySchedule.find(slot => slot.time === currentTimeSlot);
      if (currentTimeSlotInfo) {
        classroom.inUse = currentTimeSlotInfo.used;
      } else {
        classroom.inUse = false;
      }
    } else {
      classroom.inUse = false;
    }
  });
  
  return classrooms;
}

function displayClassroomStatus(classrooms) {
  const outputDiv = document.getElementById('output');
  const now = new Date();
  const currentTime = getCurrentTime();
  const currentDay = getDayOfWeek();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dateString = `${month}/${date}`;  // 예: 6/2

  const occupiedRooms = classrooms.filter(room => room.inUse).length;
  const emptyRooms = classrooms.length - occupiedRooms;

  let html = `
    <p>현재 시각: ${dateString} (${currentDay}) ${currentTime}</p>
    <p>수업 중인 강의실: ${occupiedRooms}개</p>
    <p>비어있는 강의실: ${emptyRooms}개</p>
  `;

  // ✅ 카드 형식으로 출력
  classrooms.forEach(classroom => {
    const status = classroom.inUse ? '수업 중' : '비어 있음';
    const statusClass = classroom.inUse ? 'occupied' : 'empty';
    
    html += `
      <div class="room-card ${statusClass}">
        <h3>🏫 ${classroom.name}</h3>
        <p>${status}</p>
      </div>
    `;
  });

  outputDiv.innerHTML = html;
}


async function updateStatus() {
  const classrooms = await fetchJsonData();
  if (classrooms) {
    const updatedClassrooms = updateClassroomStatus(classrooms);
    displayClassroomStatus(updatedClassrooms);
  } else {
    document.getElementById('output').innerHTML = '<p>데이터를 불러오는데 실패했습니다.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const updateButton = document.getElementById('updateButton');
  updateButton.addEventListener('click', updateStatus);
  updateStatus(); // 초기 상태 표시
});

if (!localStorage.getItem('loggedInUser') || !localStorage.getItem('loggedInName')) {
  alert('로그인이 필요합니다.');
  location.href = 'login.html';
}

const userId = localStorage.getItem("loggedInUser");
const userName = localStorage.getItem("loggedInName");
const userArea = document.getElementById("userArea");

if (userId && userName && userArea) {
  userArea.textContent = `${userId} ${userName}님 환영합니다!`;
}
