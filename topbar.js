document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("loggedInUser");
  const name = localStorage.getItem("loggedInName");
  const topBar = document.getElementById("topBar");

  if (topBar) {
    if (user && name) {
      topBar.innerHTML = `
        <span class="user-text">${user} ${name}님</span>
        <button onclick="logout()" class="login-button logout-button">로그아웃</button>
      `;
    } else {
      topBar.innerHTML = `
        <button onclick="location.href='login.html'" class="login-button">로그인</button>
      `;
    }
  }
});

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loggedInName");
  location.href = "index.html"; // 로그아웃 후 이동할 페이지
}
