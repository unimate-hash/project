// 페이지 로드 시 기능 버튼 링크 처리
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button[data-link]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const url = button.getAttribute("data-link");
      window.open(url, "_blank");
    });
  });

  // 로그인 상태 표시 처리
  const user = localStorage.getItem("loggedInUser");  // 학번
  const name = localStorage.getItem("loggedInName");  // 이름
  const topBar = document.getElementById("topBar");

  if (user && name) {
    topBar.innerHTML = `
      <span class="user-text">${user} ${name}님 환영합니다!</span>
      <button onclick="logout()" class="login-button logout-button">로그아웃</button>
    `;
  } else {
    topBar.innerHTML = `
      <button onclick="location.href='login.html'" class="login-button">로그인</button>
    `;
  }
});

// 로그아웃 함수: 학번 + 이름 모두 제거
function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loggedInName");
  location.reload();
}
