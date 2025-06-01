function register() {
  const id = document.getElementById('signupId').value.trim();
  const name = document.getElementById('signupName').value.trim();
  const pw = document.getElementById('signupPw').value;

  if (!id || !name || !pw) {
    return alert("모든 정보를 입력해주세요.");
  }

  // ✅ 학번은 숫자만 허용
  const idRegex = /^[0-9]+$/;
  if (!idRegex.test(id)) {
    return alert("학번은 숫자만 입력 가능합니다.");
  }

  // ✅ 이름은 한글/영어만 허용
  const nameRegex = /^[가-힣a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return alert("이름은 한글 또는 영어만 입력 가능합니다.");
  }

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[id]) return alert("이미 존재하는 아이디입니다.");

  users[id] = { name, pw };
  localStorage.setItem('users', JSON.stringify(users));
  alert("회원가입이 완료되었습니다.");
  location.href = "login.html";
}