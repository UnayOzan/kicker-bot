import express from "express";
import cors from "cors";
import gameState from "./game/gameState.js";

const PORT = process.env.PORT || 3000;
const HOST_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
const clients = [];

export const startServer = () => {
  //#region setup
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));

  app.get("/", (req, res) => {
    res.send("🚀 Kickable Bot API is active!");
  });
  //#endregion

  //#region streams
  app.get("/players-stream", (req, res) => {
    // Set SSE headers
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });
    res.flushHeaders();

    // Yeni client ekle
    clients.push(res);
    console.log(`🟢 Connected observers: ${clients.length}`);

    // İlk data gönder (opsiyonel)
    res.write(`data: ${JSON.stringify({ gameState })}\n\n`);

    // Client disconnect
    req.on("close", () => {
      clients.splice(clients.indexOf(res), 1);
      console.log(`🔴 Client disconnected. Remaining: ${clients.length}`);
    });
  });

  app.get("/game-stream", (req, res) => {
    clients.push(res);
    console.log(`🟢 Connected observers: ${clients.length}`);

    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    req.on("close", () => {
      clients.splice(clients.indexOf(res), 1);
      console.log(`🔴 Client disconnected. Remaining: ${clients.length}`);
    });
  });
  //#endregion

  //#region kick
  app.post("/kick-event", (req, res) => {
    const payload = req.body;
    console.log("📩 Incoming Kick event:");
    console.dir(payload, { depth: null });

    res.sendStatus(200);
  });
  //#endregion

  app.get("/game-state", (req, res) => {
    res.json({ gameState });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Webhook server running at: ${HOST_URL}`);
  });
};

export function broadcast(data) {
  const json = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    client.write(json);
  }
}
