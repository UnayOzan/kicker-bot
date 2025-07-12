import WebSocket from "ws";
import axios from "axios";

const channelId = "86901";
const webhookURL = "http://localhost:3000/kick-event";

export const startListener = () => {
  const ws = new WebSocket(`wss://chat.kick.com/${channelId}`);

  ws.on("open", () => {
    console.log("✅ WebSocket bağlantısı kuruldu!");
  });

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === "message") {
        console.log(`💬 ${msg.sender.username}: ${msg.content}`);
        axios.post(webhookURL, {
          type: msg.type,
          user: msg.sender.username,
          content: msg.content,
        });
      } else if (msg.type === "systemMessage") {
        console.log("🎉 Sistem Mesajı:", msg.message);
        axios.post(webhookURL, {
          type: msg.type,
          message: msg.message,
          raw: msg,
        });
      }
    } catch (err) {
      console.error("❌ Veri parse hatası:", err);
    }
  });

  ws.on("close", () => {
    console.log("🔌 WebSocket bağlantısı kapandı.");
  });
};
