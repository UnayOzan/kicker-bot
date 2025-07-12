// server.js
import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const HOST_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;

export const startServer = () => {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("🚀 Kick Bot API Aktif!");
  });

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
