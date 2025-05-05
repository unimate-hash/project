function calculateGPA() {
    const rows = document.querySelectorAll('.grade-row');
    const programType = document.getElementById('programType').value;
  
    let totalPoints = 0;
    let totalCredits = 0;
    let majorCredits = 0;
  
    const gradeMap = {
      'A+': 4.5, 'A': 4.0,
      'B+': 3.5, 'B': 3.0,
      'C+': 2.5, 'C': 2.0,
      'D+': 1.5, 'D': 1.0,
      'F': 0.0
    };
  
    rows.forEach(row => {
      const grade = row.querySelector('.grade').value;
      const credit = parseFloat(row.querySelector('.credit').value);
      const isMajor = row.querySelector('.major').checked;
  
      if (grade in gradeMap && !isNaN(credit)) {
        totalPoints += gradeMap[grade] * credit;
        totalCredits += credit;
        if (isMajor) {
          majorCredits += credit;
        }
      }
    });
  
    // 졸업 요건 설정
    let requiredTotal = 110;
    let requiredMajor = 81;
    if (programType === "2") {
      requiredTotal = 75;
      requiredMajor = 45;
    }
  
    const gpa = (totalCredits === 0) ? 0 : (totalPoints / totalCredits).toFixed(2);
    const graduationEligible = totalCredits >= requiredTotal && majorCredits >= requiredMajor;
  
    const resultEl = document.getElementById('result');
    resultEl.innerHTML = `
      평균 평점: ${gpa}<br>
      총 이수 학점: ${totalCredits} / ${requiredTotal}<br>
      전공 이수 학점: ${majorCredits} / ${requiredMajor}<br>
      상태: <strong>${graduationEligible ? '졸업 가능' : '졸업 불가'}</strong>
    `;
  }
  
  function addRow() {
    const container = document.getElementById('gradeContainer');
    const row = document.createElement('div');
    row.className = 'grade-row';
    row.innerHTML = `
      <input type="text" placeholder="과목명">
      <input type="number" class="credit" placeholder="학점" min="0" step="0.5">
      <select class="grade">
        <option value="A+">A+</option>
        <option value="A">A</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="D+">D+</option>
        <option value="D">D</option>
        <option value="F">F</option>
      </select>
      <label><input type="checkbox" class="major"> 전공</label>
      <button onclick="this.parentElement.remove()">삭제</button>
    `;
    container.appendChild(row);
  }