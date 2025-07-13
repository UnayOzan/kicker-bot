import Pusher from "pusher-js";

const channelId = "55150469";
const appKey = "32cbd69e4b950bf97679"; // Kick'in sabit Pusher app key'i
const cluster = "us2";

export const startListener = () => {
  const pusher = new Pusher(appKey, {
    cluster,
    wsHost: "ws-us2.pusher.com",
    wsPort: 443,
    forceTLS: true,
    encrypted: true,
  });

  const channelName = `chatrooms.${channelId}.v2`;
  const channel = pusher.subscribe(channelName);

  channel.bind("new_message", (data) => {
    const username = data?.sender?.username;
    const content = data?.content;
    if (username && content) {
      console.log(`💬 ${username}: ${content}`);
    }
  });

  channel.bind("message_deleted", (data) => {
    console.log(`❌ Mesaj silindi:`, data);
  });

  //Tüm event'leri görmek istersen:
  channel.bind_global((event, data) => {
    console.log(`📨 Event: ${event}`, data);
  });

  console.log(`📡 Dinleniyor: ${channelName}`);
};
