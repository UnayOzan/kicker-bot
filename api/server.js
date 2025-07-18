import express from "express";
import cors from "cors";
import { players, gameState, startNextTurn, endTurn, handleAction } from "./game/game.js";

const PORT = process.env.PORT || 3000;
const HOST_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;

export const startServer = () => {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.static('public'));

  app.get("/", (req, res) => {
    res.send("🚀 Kickable Bot API Aktif!");
  });

  //#region - game events
  app.get("/players-stream", (req, res) => {
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const sendData = () => {
      res.write(`data: ${JSON.stringify({ players, gameState })}\n\n`);
    };

    sendData();

    const interval = setInterval(sendData, 1000);

    req.on("close", () => {
      clearInterval(interval);
    });
  });

  app.post("/start-turn", (req, res) => {
    startNextTurn();
    res.json({ message: `Tur ${gameState.turn} başladı.` });
  });

  app.post("/end-turn", (req, res) => {
    endTurn();
    res.json({ message: `Tur ${gameState.turn} sona erdi.` });
  });
  //#endregion

  app.post("/kick-event", (req, res) => {
    const payload = req.body;
    console.log("📩 Webhook event geldi:");
    console.dir(payload, { depth: null });

    res.sendStatus(200);
  });

  app.listen(PORT, () => {
    console.log(`🚀 Webhook server ayakta: ${HOST_URL}`);
  });
};
