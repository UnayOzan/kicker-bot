import Pusher from "pusher-js";
import { eventBus } from "./misc/eventBus";

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

  //Bind all events globally
  channel.bind_global((event, data) => {
    console.log(`📨 Event: ${event}`, data);

    eventBus.emit(`kick_${event}`, data);
  });

  console.log(`📡 Dinleniyor: ${channelName}`);
};
