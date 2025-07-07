const socket = io();
const statusEl = document.getElementById("status");
const shapeEl = document.getElementById("shape");
const scoreEl = document.getElementById("score");
const leaderboardEl = document.getElementById("leaderboard");

let localClicks = 0;
let username = window.prompt("Enter a username:") || "Guest";
let scaleFactor = 1;

socket.emit("join_game", { username });

socket.on("joined", ({ id, username: serverName }) => {
  statusEl.textContent = `You are ${serverName} (id: ${id})`;
});

// Default negative-emotion words
const words = [
  "anger",
  "stress",
  "anxiety",
  "doubt",
  "fear",
  "guilt",
  "sadness",
  "envy",
  "regret",
  "loneliness",
];

// Allow user to add custom words via input
const customWordInput = document.getElementById("custom-word-input");
const addWordBtn = document.getElementById("add-word-btn");

addWordBtn?.addEventListener("click", () => {
  const val = customWordInput.value.trim();
  if (val) {
    words.push(val);
    customWordInput.value = "";
  }
});

// Random bright colors for word boxes
const colors = [
  "#ff4d4d",
  "#ff924d",
  "#ffe94d",
  "#4dff4d",
  "#4dffea",
  "#4da6ff",
  "#7f4dff",
  "#ff4dff",
];

function createWordExplosion(x, y, count = 16) {
  for (let i = 0; i < count; i++) {
    const word = words[Math.floor(Math.random() * words.length)];
    const span = document.createElement("span");
    span.className = "word-box";
    span.textContent = word;
    span.contentEditable = "true";
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;

    // Assign random color
    span.style.background = colors[Math.floor(Math.random() * colors.length)];

    // Travel trajectory
    const dx = (Math.random() - 0.5) * 300;
    const dy = (Math.random() - 0.5) * 300;
    span.style.setProperty("--dx", `${dx}px`);
    span.style.setProperty("--dy", `${dy}px`);

    document.getElementById("app").appendChild(span);

    // When a user clicks the word, fade it out then remove
    span.addEventListener("click", () => {
      span.classList.add("fade-out");
      span.addEventListener(
        "animationend",
        () => {
          span.remove();
        },
        { once: true }
      );
    });
  }
}

shapeEl.addEventListener("click", (e) => {
  localClicks += 1;
  scaleFactor = 1 + localClicks * 0.05;
  shapeEl.style.setProperty("--scale", scaleFactor);
  shapeEl.classList.add("shake");

  socket.emit("click_shape");
  const rect = shapeEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  createWordExplosion(centerX, centerY);

  if (localClicks >= 10) {
    // Explosion!
    socket.emit("explode_shape");
    shapeEl.classList.remove("shake");
    shapeEl.classList.add("burst");
    shapeEl.addEventListener(
      "animationend",
      () => shapeEl.classList.remove("burst"),
      { once: true }
    );

    localClicks = 0;
    scaleFactor = 1;
    shapeEl.style.setProperty("--scale", scaleFactor);
  }

  scoreEl.textContent = localClicks;
});

socket.on("shape_clicked", ({ totalClicks }) => {
  // Optionally show global clicks
  console.log("Total clicks: ", totalClicks);
});

socket.on("shape_exploded", ({ id, totalExplosions }) => {
  console.log(`Boom by ${id}! Total explosions: ${totalExplosions}`);
});

socket.on("leaderboard_update", (leaderboard) => {
  leaderboardEl.innerHTML = "";
  leaderboard.forEach((player, idx) => {
    const li = document.createElement("li");
    li.textContent = `${player.username}: ${player.score}`;
    leaderboardEl.appendChild(li);
  });
}); 