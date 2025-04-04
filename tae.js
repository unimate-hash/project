document.addEventListener("DOMContentLoaded", function () {
    function findEmptyRooms() {
      const buildings = {
        "본관": ["101호", "102호", "103호"],
        "사회교육관": ["201호", "202호", "203호"],
        "예체능관": ["301호", "302호", "303호"],
        "공학관": ["401호", "402호", "403호"]
      };
      let resultHTML = "";
      for (let building in buildings) {
        const availableRooms = buildings[building].filter(() => Math.random() > 0.5);
        resultHTML += `<strong>${building}</strong>: ${availableRooms.length ? availableRooms.join(", ") : "빈 강의실 없음"}<br>`;
      }
      document.getElementById("empty-rooms-result").innerHTML = resultHTML;
    }
    window.findEmptyRooms = findEmptyRooms;
  
    function openGradeCalculator() {
      document.getElementById("grade-calculator-modal").style.display = "block";
      let inputsHTML = "";
      for (let i = 1; i <= 10; i++) {
        inputsHTML += `<input type="text" id="grade${i}" placeholder="성적" maxlength="2" style="width: 40px; text-align: center; margin: 2px; font-size: 12px;">`;
      }
      document.getElementById("grade-inputs").innerHTML = inputsHTML;
    }
  
    function calculateGPA() {
      const gradeMap = {
        "A+": 4.5, "A": 4.0, "A-": 3.7,
        "B+": 3.3, "B": 3.0, "B-": 2.7,
        "C+": 2.3, "C": 2.0, "C-": 1.7,
        "D": 1.0, "F": 0.0
      };
      let totalGrades = 0, count = 0;
      for (let i = 1; i <= 10; i++) {
        const gradeInput = document.getElementById(`grade${i}`).value.trim().toUpperCase();
        if (gradeInput && gradeMap.hasOwnProperty(gradeInput)) {
          totalGrades += gradeMap[gradeInput];
          count++;
        }
      }
      const result = count ? (totalGrades / count).toFixed(2) : "올바른 성적을 입력하세요.";
      document.getElementById("gpa-result").innerText = "성적 평균: " + result;
    }
  
    function generateTimetable() {
      const days = ["월", "화", "수", "목", "금", "토", "일"];
      let timetableHTML = `<div style="margin-bottom: 0.5rem; font-size: 12px;">
        <label>강의명: <input id="lecture-name" type="text" style="width: 100px; font-size: 12px;"></label>
        <label>요일:
          <select id="lecture-day" style="font-size: 12px;">
            ${days.map(day => `<option value="${day}">${day}</option>`).join("")}
          </select>
        </label>
        <label>시작: <input id="start-time" class="flatpickr-time" style="font-size: 12px; width: 80px; padding: 12px 4px;"></label>
        <label>종료: <input id="end-time" class="flatpickr-time" style="font-size: 12px; width: 80px; padding: 12px 4px;"></label>
        <button onclick="insertLecture()" style="font-size: 12px; padding: 4px 8px;">추가</button>
      </div>`;
  
      timetableHTML += "<table border='1' style='border-collapse: collapse; width: 100%; font-size: 11px;'>";
      timetableHTML += "<tr><th>시간</th>";
      days.forEach(day => timetableHTML += `<th>${day}</th>`);
      timetableHTML += "</tr>";
  
      for (let hour = 9; hour <= 18; hour++) {
        timetableHTML += `<tr><td>${hour}:00</td>`;
        for (let i = 0; i < 7; i++) {
          timetableHTML += `<td id="${days[i]}-${hour}" style="height: 30px;"></td>`;
        }
        timetableHTML += "</tr>";
      }
  
      timetableHTML += "</table>";
      document.getElementById("timetable-result").innerHTML = timetableHTML;
  
      flatpickr("#start-time", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        minuteIncrement: 10,
        minTime: "09:00",
        maxTime: "18:00"
      });
      flatpickr("#end-time", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        minuteIncrement: 10,
        minTime: "09:00",
        maxTime: "18:00"
      });
    }
  
    function insertLecture() {
      const name = document.getElementById("lecture-name").value;
      const day = document.getElementById("lecture-day").value;
      const startRaw = document.getElementById("start-time").value;
      const endRaw = document.getElementById("end-time").value;
  
      if (!name || !startRaw || !endRaw) {
        alert("모든 입력값을 채워주세요.");
        return;
      }
  
      const start = parseInt(startRaw.split(":")[0]);
      const end = parseInt(endRaw.split(":")[0]);
  
      if (isNaN(start) || isNaN(end) || start > end || start < 9 || end > 18) {
        alert("시간은 09:00~18:00 사이여야 하며 시작 시간이 종료 시간보다 빨라야 합니다.");
        return;
      }
  
      for (let hour = start; hour <= end; hour++) {
        const cell = document.getElementById(`${day}-${hour}`);
        if (cell) cell.innerText = name;
      }
    }
  
    window.goToSchool = function () {
      window.open("https://www.mjc.ac.kr/mjcIntro.do", "_blank");
    };
  
    window.openGradeCalculator = openGradeCalculator;
    window.calculateGPA = calculateGPA;
    window.generateTimetable = generateTimetable;
    window.insertLecture = insertLecture;
  
    // ✅ 카드 위치 교체
    const allCards = Array.from(document.querySelectorAll('.card'));
    const timetableCard = allCards.find(card => card.querySelector('h3')?.innerText.includes("시간표"));
    const schoolCard = allCards.find(card => card.querySelector('h3')?.innerText.includes("학교 홈페이지"));
  
    if (timetableCard && schoolCard) {
      const container = timetableCard.parentElement;
      container.insertBefore(schoolCard, timetableCard.nextSibling);
    }
  });
  
