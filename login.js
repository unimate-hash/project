function login() {
  const id = document.getElementById('loginId').value.trim();
  const pw = document.getElementById('loginPw').value;

  if (!id || !pw) {
    return alert("아이디와 비밀번호를 모두 입력해주세요.");
  }

  const users = JSON.parse(localStorage.getItem('users') || '{}');

  // ✅ 존재하지 않는 아이디 검사
  if (!users[id]) {
    return alert("존재하지 않는 아이디입니다.");
  }

  // ✅ 비밀번호 일치 여부 검사
  if (users[id].pw !== pw) {
    return alert("비밀번호가 일치하지 않습니다.");
  }

  // 로그인 성공
  localStorage.setItem("loggedInUser", id);              // 학번 저장
  localStorage.setItem("loggedInName", users[id].name);  // 이름 저장

  alert(`${users[id].name}님 환영합니다!`);
  location.href = "index.html";
}
