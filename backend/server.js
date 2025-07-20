import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
app.use(cors());

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
app.use(express.static(path.resolve(dirname, "../public")));

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" }, allowEIO3: true });
const PORT = process.env.PORT || 3000;

const highScoresPath = path.resolve(dirname, "highScores.json");
let highScores = {};
try {
  if (fs.existsSync(highScoresPath)) highScores = JSON.parse(fs.readFileSync(highScoresPath, "utf-8"));
} catch (err) {
  console.error("Failed to load high scores:", err);
}

const saveHighScores = () => {
  try {
    fs.writeFileSync(highScoresPath, JSON.stringify(highScores, null, 2));
  } catch (err) {
    console.error("Failed to save high scores:", err);
  }
};

const gameState = { players: {}, clicks: 0, explosions: 0 };

const getLeaderboard = () =>
  Object.entries(highScores)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

const updateHighScore = (player) => {
  const { username, score } = player;
  if (!highScores[username] || highScores[username] < score) {
    highScores[username] = score;
    saveHighScores();
  }
};

const broadcastProblems = () => {
  io.emit("problems_update", Object.values(problems));
};

const problems = {};
const uid = () => Math.random().toString(36).substring(2, 10);

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  socket.on("join_game", ({ username } = {}) => {
    if (!username) username = `Player-${socket.id.slice(0, 4)}`;
    gameState.players[socket.id] = { username, clicks: 0, explosions: 0, score: 0 };
    socket.emit("joined", { id: socket.id, username });
    io.emit("leaderboard_update", getLeaderboard());
    broadcastProblems();
  });

  socket.on("click_shape", () => {
    const player = gameState.players[socket.id];
    if (!player) return;
    player.clicks += 1;
    player.score += 1;
    gameState.clicks += 1;
    updateHighScore(player);
    io.emit("shape_clicked", { id: socket.id, clicks: player.clicks, totalClicks: gameState.clicks });
  });

  socket.on("explode_shape", () => {
    const player = gameState.players[socket.id];
    if (!player) return;
    player.explosions += 1;
    player.score += 10;
    gameState.explosions += 1;
    updateHighScore(player);
    io.emit("shape_exploded", { id: socket.id, explosions: player.explosions, totalExplosions: gameState.explosions });
    io.emit("leaderboard_update", getLeaderboard());
  }); 

  socket.on("new_problem", ({ label }) => {
    label = (label || "Problem").trim();
    if (!label) return;
    const colors = ["#ee6c4d", "#e9ac4d", "#d4a373", "#a7c957", "#57c6a1", "#6da9e4", "#c29def", "#f28585"];
    const shapes = ["circle", "square", "hex", "triangle", "pentagon"];
    const id = uid();
    problems[id] = { id, label, color: pick(colors), shape: pick(shapes), remaining: new Set(Object.keys(gameState.players)) };
    broadcastProblems();
  });

  socket.on("solved_problem", (id) => {
    const thing = problems[id];
    if (!thing) return;
    thing.remaining.delete(socket.id);
    if (thing.remaining.size === 0) {
      delete problems[id];
      io.emit("remove_problem", id);
    } else {
      broadcastProblems();
    }
  });

  socket.on("disconnect", () => {
    delete gameState.players[socket.id];
    Object.values(problems).forEach(thing => thing.remaining.delete(socket.id));
  });
});