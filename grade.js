function calculateGPA() {
    const rows = document.querySelectorAll('.grade-row');
    let totalPoints = 0;
    let totalSubjects = 0;
  
    const gradeMap = {
      'A+': 4.5, 'A': 4.0,
      'B+': 3.5, 'B': 3.0,
      'C+': 2.5, 'C': 2.0,
      'D+': 1.5, 'D': 1.0,
      'F': 0.0
    };
  
    rows.forEach(row => {
      const grade = row.querySelector('.grade').value;
      if (grade in gradeMap) {
        totalPoints += gradeMap[grade];
        totalSubjects++;
      }
    });
  
    const gpa = (totalSubjects === 0) ? 0 : (totalPoints / totalSubjects).toFixed(2);
    document.getElementById('result').textContent = `평균 평점: ${gpa}`;
  }
  
  function addRow() {
    const container = document.getElementById('gradeContainer');
    const row = document.createElement('div');
    row.className = 'grade-row';
    row.innerHTML = `
      <input type="text" placeholder="과목명">
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
      <button onclick="this.parentElement.remove()">삭제</button>
    `;
    container.appendChild(row);
  }
  