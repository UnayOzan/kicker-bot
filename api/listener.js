import WebSocket from "ws";

const channelId = process.env.KICK_CHANNEL_ID || "86901";

export const startListener = () => {
  const ws = new WebSocket(
    `wss://chat-server.kick.com/ws/v2?channel_id=${channelId}`
  );

  ws.on("open", () => {
    console.log("✅ WebSocket bağlantısı kuruldu!");
  });

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === "message" && msg.content?.trim()) {
        console.log(`💬 ${msg.sender.username}: ${msg.content}`);
      }
    } catch (err) {
      console.error("❌ Veri parse hatası:", err.message);
    }
  });

  ws.on("close", () => {
    console.log("🔌 WebSocket bağlantısı kapandı.");
  });

  ws.on("error", (err) => {
    console.error("🚨 WebSocket Hatası:", err.message);
  });
};
