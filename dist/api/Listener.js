import { eventBus, eventAlias } from "../game/misc/EventBus.js";
import PusherImport from "pusher-js";
const Pusher = (PusherImport && PusherImport.default) ? PusherImport.default : PusherImport;
const channelId = "55150469";
const appKey = "32cbd69e4b950bf97679";
const cluster = "us2";
export const startListener = (onConnected) => {
    const pusher = new Pusher(appKey, {
        cluster,
        wsHost: "ws-us2.pusher.com",
        wsPort: 443,
        forceTLS: true,
    });
    pusher.connection.bind("connected", () => {
        console.log("✅ Pusher bağlantısı açıldı.");
        if (onConnected)
            onConnected();
    });
    const channelName = `chatrooms.${channelId}.v2`;
    const channel = pusher.subscribe(channelName);
    channel.bind_global((event, data) => {
        const alias = eventAlias[event];
        if (alias) {
            eventBus.emit(alias, data);
        }
        else {
            console.log(`❔ Bilinmeyen event: ${event}`, data);
        }
    });
    console.log(`📡 Dinleniyor: ${channelName}`);
};
