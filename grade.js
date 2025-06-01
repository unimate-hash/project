const userId = localStorage.getItem("loggedInUser");
const userName = localStorage.getItem("loggedInName");
const userInfo = document.getElementById("userInfo");

if (!userId || !userName) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
} else if (userInfo) {
  userInfo.textContent = `${userId} ${userName}님 환영합니다!`;
}


const STORAGE_KEY = `grades_${userId}`;
let toggleSide = 0;  // ✅ 반드시 먼저 선언되어야 함

function addRow(subject = '', grade = 'A+', credit = '', isMajor = false, semester = '1-1') {
  const row = document.createElement('div');
  row.className = 'grade-row';
  const type = isMajor ? '전공' : '교양';

  row.innerHTML = `
    <input type="text" placeholder="과목명" value="${subject}">
    <input type="number" class="credit" placeholder="학점" min="0" step="0.5" value="${credit}">
    <select class="grade">
      ${['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'].map(g => `<option value="${g}" ${g === grade ? 'selected' : ''}>${g}</option>`).join('')}
    </select>
    <select class="type">
      <option value="전공" ${type === '전공' ? 'selected' : ''}>전공</option>
      <option value="교양" ${type === '교양' ? 'selected' : ''}>교양</option>
    </select>
    <select class="semester">
      ${['1-1','1-2','2-1','2-2','3-1','3-2'].map(s => `<option value="${s}" ${s === semester ? 'selected' : ''}>${s}학기</option>`).join('')}
    </select>
    <button onclick="this.parentElement.remove()">삭제</button>
  `;

  const column = toggleSide === 0 ? document.getElementById('leftColumn') : document.getElementById('rightColumn');
  column.appendChild(row);
  toggleSide = 1 - toggleSide;
}

function calculateGPA() {
  const rows = document.querySelectorAll('.grade-row');
  const programType = document.getElementById('programType').value;

  let totalPoints = 0;
  let totalCredits = 0;
  let majorCredits = 0;
  const semesterCredits = {};

  const gradeMap = {
    'A+': 4.5, 'A': 4.0,
    'B+': 3.5, 'B': 3.0,
    'C+': 2.5, 'C': 2.0,
    'D+': 1.5, 'D': 1.0,
    'F': 0.0
  };

  const savedRows = [];

  rows.forEach(row => {
    const subject = row.querySelector('input[type=text]').value;
    const grade = row.querySelector('.grade').value;
    const credit = parseFloat(row.querySelector('.credit').value);
    const isMajor = row.querySelector('.type').value === "전공";
    const semester = row.querySelector('.semester').value;

    savedRows.push({ subject, grade, credit, isMajor, semester });

    if (grade in gradeMap && !isNaN(credit)) {
      totalPoints += gradeMap[grade] * credit;
      totalCredits += credit;
      if (isMajor) majorCredits += credit;

      if (!semesterCredits[semester]) semesterCredits[semester] = 0;
      semesterCredits[semester] += credit;
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRows));

  let requiredTotal = 110;
  let requiredMajor = 81;
  if (programType === "2") {
    requiredTotal = 75;
    requiredMajor = 45;
  }

  const gpa = (totalCredits === 0) ? 0 : (totalPoints / totalCredits).toFixed(2);
  const graduationEligible = totalCredits >= requiredTotal && majorCredits >= requiredMajor;

  const eligibilityText = graduationEligible
    ? '<span style="color: #3b82f6; font-weight: bold;">가능</span>'
    : '<span style="color: red; font-weight: bold;">불가능</span>';

  const lackCredit = Math.max(0, requiredTotal - totalCredits);
  const lackMajor = Math.max(0, requiredMajor - majorCredits);

  document.getElementById('result').innerHTML = `
    <table class="result-table">
      <tr><th>평균 평점</th><td>${gpa}</td></tr>
      <tr><th>총 이수 학점</th><td>${totalCredits} / ${requiredTotal}</td></tr>
      <tr><th>전공 이수 학점</th><td>${majorCredits} / ${requiredMajor}</td></tr>
      <tr><th>졸업 가능 여부</th><td>${eligibilityText}</td></tr>
      <tr><th>부족한 총 학점</th><td>${lackCredit}학점</td></tr>
      <tr><th>부족한 전공 학점</th><td>${lackMajor}학점</td></tr>
    </table>
  `;

  const semesterOrder = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];
  const sortedSemesterRows = semesterOrder
    .map(sem => {
      const credit = semesterCredits[sem] || 0;
      return `<tr><td>${sem}학기</td><td>${credit}학점</td></tr>`;
    })
    .join('');

  document.getElementById('semesterBreakdown').innerHTML = `
    <table class="result-table">
      <thead>
        <tr><th>학기</th><th>수강 학점</th></tr>
      </thead>
      <tbody>${sortedSemesterRows}</tbody>
    </table>
  `;
}

window.onload = () => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  saved.forEach(item => addRow(item.subject, item.grade, item.credit, item.isMajor, item.semester));
};
