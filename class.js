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

function getDayOfWeek() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
}

function updateClassroomStatus(classrooms) {
    const currentTime = getCurrentTime();
    const currentDay = getDayOfWeek();
    
    classrooms.forEach(classroom => {
        const todaySchedule = classroom.schedule[currentDay];
        if (todaySchedule) {
            const currentTimeSlot = todaySchedule.find(slot => slot.time === currentTime);
            if (currentTimeSlot) {
                classroom.inUse = currentTimeSlot.used;
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
    const currentTime = getCurrentTime();
    const occupiedRooms = classrooms.filter(room => room.inUse).length;
    const emptyRooms = classrooms.length - occupiedRooms;

    let html = `<p>현재 시각: ${currentTime}</p>`;
    html += `<p>수업 중인 강의실: ${occupiedRooms}개</p>`;
    html += `<p>비어있는 강의실: ${emptyRooms}개</p>`;
    html += '<h2>강의실 상태:</h2>';

    classrooms.forEach(classroom => {
        const status = classroom.inUse ? '수업 중' : '비어있음';
        html += `<p>${classroom.name}: ${status}</p>`;
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
