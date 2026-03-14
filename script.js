const icons = document.querySelectorAll(".icon[data-app]");
const desktop = document.getElementById("desktop");
const menu = document.getElementById("contextMenu");
const windowsContainer = document.getElementById("windows");

const startBtn = document.querySelector(".start-btn");
const startPanel = document.getElementById("startPanel");

const powerBtn = document.querySelector(".power-btn");
const powerMenu = document.getElementById("powerMenu");

const taskLinks = document.querySelectorAll(".task-link");

let zIndex = 1;
let activeWindow = null;
let offsetX = 0;
let offsetY = 0;

/* ---------------- DESKTOP ICON DOUBLE CLICK ---------------- */

icons.forEach((icon) => {
  icon.addEventListener("dblclick", () => {
    const appName = icon.dataset.app;
    openWindow(appName);
  });
});

/* ---------------- CREATE WINDOW ---------------- */

function openWindow(app) {
  const win = document.createElement("div");

  win.classList.add("window");

  win.style.top = 120 + Math.random() * 120 + "px";
  win.style.left = 200 + Math.random() * 200 + "px";
  win.style.zIndex = zIndex++;

  let content = "";

  if (app === "computer") {
    content = "<h3>This PC</h3><p>System files and drives</p>";
  }

  if (app === "folder") {
    content = "<h3>Documents</h3><p>Your saved files appear here</p>";
  }

  win.innerHTML = `

<div class="titlebar">
<span>${app}</span>
<button class="close">X</button>
</div>

<div class="window-content">
${content}
</div>

`;

  windowsContainer.appendChild(win);
}

/* ---------------- CLOSE WINDOW ---------------- */

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("close")) {
    e.target.closest(".window").remove();
  }
});

/* ---------------- WINDOW DRAG ---------------- */

document.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("titlebar")) {
    activeWindow = e.target.parentElement;

    activeWindow.style.zIndex = zIndex++;

    offsetX = e.clientX - activeWindow.offsetLeft;
    offsetY = e.clientY - activeWindow.offsetTop;
  }
});

document.addEventListener("mousemove", (e) => {
  if (activeWindow) {
    activeWindow.style.left = e.clientX - offsetX + "px";
    activeWindow.style.top = e.clientY - offsetY + "px";
  }
});

document.addEventListener("mouseup", () => {
  activeWindow = null;
});

/* ---------------- RIGHT CLICK MENU ---------------- */

desktop.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  menu.style.display = "block";

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const menuWidth = menu.offsetWidth;
  const menuHeight = menu.offsetHeight;

  let posX = e.pageX;
  let posY = e.pageY;

  if (posX + menuWidth > screenWidth) {
    posX = screenWidth - menuWidth - 10;
  }

  if (posY + menuHeight > screenHeight) {
    posY = screenHeight - menuHeight - 10;
  }

  menu.style.left = posX + "px";
  menu.style.top = posY + "px";
});

/* ---------------- START MENU ---------------- */

startBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  startPanel.classList.toggle("active");
});

/* ---------------- TASKBAR LINKS ---------------- */

document.addEventListener("DOMContentLoaded", function () {
  taskLinks.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.stopPropagation();

      const link = icon.dataset.link;

      window.open(link, "_blank");
    });
  });
});

/* ---------------- POWER MENU ---------------- */

powerBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  powerMenu.style.display =
    powerMenu.style.display === "block" ? "none" : "block";
});

/* ---------------- POWER OPTIONS ---------------- */

document.querySelectorAll(".power-menu p").forEach((item) => {
  item.addEventListener("click", () => {
    const action = item.innerText;

    if (action === "Restart") {
      location.reload();
    }

    if (action === "Shut down") {
      document.body.innerHTML =
        "<div style='background:black;color:white;height:100vh;display:flex;align-items:center;justify-content:center;font-size:30px'>Shutting Down...</div>";
    }

    if (action === "Sleep") {
      alert("Sleep Mode Activated");
    }
  });
});

/* ---------------- GLOBAL CLICK HANDLER ---------------- */

document.addEventListener("click", (e) => {
  menu.style.display = "none";

  if (!startPanel.contains(e.target) && !startBtn.contains(e.target)) {
    startPanel.classList.remove("active");
  }

  if (!powerMenu.contains(e.target) && !powerBtn.contains(e.target)) {
    powerMenu.style.display = "none";
  }
});
