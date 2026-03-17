/* ===============================
   GLOBAL STATE
================================ */

const state = {
  zIndex: 1,
  activeWindow: null,
  offsetX: 0,
  offsetY: 0,
};

/* ===============================
   DOM REFERENCES
================================ */

const desktop = document.getElementById("desktop");
const windowsContainer = document.getElementById("windows");

const menu = document.getElementById("contextMenu");

const startBtn = document.querySelector(".start-btn");
const startPanel = document.getElementById("startPanel");

const powerBtn = document.querySelector(".power-btn");
const powerMenu = document.getElementById("powerMenu");

const taskLinks = document.querySelectorAll(".task-link");

const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

/* ===============================
   APP CONFIGURATION
================================ */

const apps = {
  computer: {
    title: "This PC",
    content: "<p>System files and drives</p>",
  },

  folder: {
    title: "Documents",
    content: "<p>Your saved files appear here</p>",
  },
};

/* ===============================
   OPEN WINDOW
================================ */

function openWindow(appName) {
  const app = apps[appName];

  if (!app) return;

  const win = document.createElement("div");
  win.className = "window";

  win.style.top = 120 + Math.random() * 120 + "px";
  win.style.left = 200 + Math.random() * 200 + "px";
  win.style.zIndex = state.zIndex++;

  win.innerHTML = `
  <div class="titlebar">
    <span>${app.title}</span>
    <button class="close">X</button>
  </div>

  <div class="window-content">
    ${app.content}
  </div>
  `;

  windowsContainer.appendChild(win);
}

/* ===============================
   ICON DOUBLE CLICK
================================ */

desktop.addEventListener("dblclick", (e) => {
  const icon = e.target.closest(".icon[data-app]");

  if (!icon) return;

  openWindow(icon.dataset.app);
});

/* ===============================
   WINDOW DRAG SYSTEM
================================ */

document.addEventListener("mousedown", (e) => {
  const titlebar = e.target.closest(".titlebar");

  if (!titlebar) return;

  state.activeWindow = titlebar.parentElement;

  state.activeWindow.style.zIndex = state.zIndex++;

  state.offsetX = e.clientX - state.activeWindow.offsetLeft;
  state.offsetY = e.clientY - state.activeWindow.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!state.activeWindow) return;

  const maxX = window.innerWidth - state.activeWindow.offsetWidth;
  const maxY = window.innerHeight - state.activeWindow.offsetHeight;

  let x = e.clientX - state.offsetX;
  let y = e.clientY - state.offsetY;

  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));

  state.activeWindow.style.left = x + "px";
  state.activeWindow.style.top = y + "px";
});

document.addEventListener("mouseup", () => {
  state.activeWindow = null;
});

/* ===============================
   RIGHT CLICK MENU
================================ */

desktop.addEventListener("contextmenu", (e) => {
  e.preventDefault();

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

  menu.style.display = "block";
  menu.style.left = posX + "px";
  menu.style.top = posY + "px";
});

/* ===============================
   START MENU
================================ */

startBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  startPanel.classList.toggle("active");
});

/* ===============================
   TASKBAR LINKS
================================ */

taskLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.stopPropagation();

    window.open(link.dataset.link, "_blank");
  });
});

/* ===============================
   POWER MENU
================================ */

powerBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  powerMenu.style.display =
    powerMenu.style.display === "block" ? "none" : "block";
});

/* ===============================
   POWER OPTIONS
================================ */

powerMenu.addEventListener("click", (e) => {
  const action = e.target.innerText;

  if (action === "Restart") location.reload();

  if (action === "Sleep") alert("Sleep Mode Activated");

  if (action === "Shut down") {
    document.body.innerHTML = `
      <div class="shutdown-screen">
        <div class="loader"></div>
        <h2>Shutting down</h2>
      </div>
    `;

    setTimeout(() => {
      document.body.innerHTML = `
      <div style="background:black;height:100vh;"></div>
      `;
    }, 5000);
  }
});

/* ===============================
   GLOBAL CLICK HANDLER
================================ */

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("close")) {
    e.target.closest(".window").remove();
  }

  menu.style.display = "none";

  if (!startPanel.contains(e.target) && !startBtn.contains(e.target)) {
    startPanel.classList.remove("active");
  }

  if (!powerMenu.contains(e.target) && !powerBtn.contains(e.target)) {
    powerMenu.style.display = "none";
  }
});

/* ===============================
   CLOCK SYSTEM
================================ */

function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const date = now.toLocaleDateString("en-GB");

  timeEl.textContent = time;
  dateEl.textContent = date;
}

updateClock();

setInterval(updateClock, 1000);
