import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static front-end files
app.use(express.static(path.resolve(__dirname, "../public")));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  allowEIO3: true,
});

const PORT = process.env.PORT || 3000;

// ---------------- High Scores (persistent) ----------------
const highScorePath = path.resolve(__dirname, "highScores.json");
let highScores = {};
try {
  if (fs.existsSync(highScorePath)) {
    highScores = JSON.parse(fs.readFileSync(highScorePath, "utf-8"));
  }
} catch (err) {
  console.error("Failed to load high scores:", err);
}

function saveHighScores() {
  try {
    fs.writeFileSync(highScorePath, JSON.stringify(highScores, null, 2));
  } catch (err) {
    console.error("Failed to save high scores:", err);
  }
}

// ---------------- Game State ----------------
const gameState = {
  players: {}, // { socketId: { username, clicks, explosions, score } }
  clicks: 0,
  explosions: 0,
};

function sendLeaderboard() {
  const leaderboard = Object.entries(highScores)
    .map(([username, score]) => ({ username, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  io.emit("leaderboard_update", leaderboard);
}

function updateHighScore(player) {
  if (!player) return;
  const currentBest = highScores[player.username] || 0;
  if (player.score > currentBest) {
    highScores[player.username] = player.score;
    saveHighScores();
    sendLeaderboard();
  }
}

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join_game", ({ username } = {}) => {
    if (!username) {
      username = `Player-${socket.id.substring(0, 4)}`;
    }
    gameState.players[socket.id] = {
      username,
      clicks: 0,
      explosions: 0,
      score: 0,
    };
    socket.emit("joined", { id: socket.id, username });
    sendLeaderboard();
  });

  socket.on("click_shape", () => {
    const player = gameState.players[socket.id];
    if (!player) return;
    player.clicks += 1;
    player.score += 1; // 1 point per click
    gameState.clicks += 1;
    updateHighScore(player);

    io.emit("shape_clicked", {
      id: socket.id,
      clicks: player.clicks,
      totalClicks: gameState.clicks,
    });
  });

  socket.on("explode_shape", () => {
    const player = gameState.players[socket.id];
    if (!player) return;
    player.explosions += 1;
    player.score += 10; // 10 points per explosion
    gameState.explosions += 1;
    updateHighScore(player);

    io.emit("shape_exploded", {
      id: socket.id,
      explosions: player.explosions,
      totalExplosions: gameState.explosions,
    });

    sendLeaderboard();
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    delete gameState.players[socket.id];
    sendLeaderboard();
  });
});

// Periodically broadcast leaderboard to keep clients in sync
setInterval(sendLeaderboard, 30000); // every 30 seconds

app.get("/stats", (_req, res) => {
  res.json({
    playersOnline: Object.keys(gameState.players).length,
    totalClicks: gameState.clicks,
    totalExplosions: gameState.explosions,
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 EMPLODE backend listening on http://localhost:${PORT}`);
}); 