import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import gameState from "../game/models/GameState.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
const clients: Response[] = [];

export const startServer = (): void => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "../../public")));

  app.get("/players-stream", (_req: Request, res: Response) => {
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });
    res.flushHeaders();

    clients.push(res);
    console.log(`🟢 Connected observers: ${clients.length}`);

    res.write(`data: ${JSON.stringify({ gameState })}\n\n`);

    _req.on("close", () => {
      clients.splice(clients.indexOf(res), 1);
      console.log(`🔴 Client disconnected. Remaining: ${clients.length}`);
    });
  });

  app.get("/game-stream", (_req: Request, res: Response) => {
    clients.push(res);
    console.log(`🟢 Connected observers: ${clients.length}`);

    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    _req.on("close", () => {
      clients.splice(clients.indexOf(res), 1);
      console.log(`🔴 Client disconnected. Remaining: ${clients.length}`);
    });
  });

  app.post("/kick-event", (req: Request, res: Response) => {
    const payload = req.body;
    console.log("📩 Incoming Kick event:");
    console.dir(payload, { depth: null });

    res.sendStatus(200);
  });

  app.get("/", (_req, res) => {
    console.log("WTFFFFFFFFF");
    res.sendFile(path.join(__dirname, "../../public/index.html"));
  });

  app.get("/game-state", (_req: Request, res: Response) => {
    res.json({ gameState });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Webhook server running at: ${HOST_URL}`);
  });
};

export function broadcast(data: unknown): void {
  const json = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    client.write(json);
  }
}
