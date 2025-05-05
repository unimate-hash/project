document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("button[data-link]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const url = button.getAttribute("data-link");
        window.open(url, "_blank");
      });
    });
  });
  