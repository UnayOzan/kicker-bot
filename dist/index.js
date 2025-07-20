import { startServer } from "./api/Server.js";
import { startListener } from "./api/Listener.js";
import { prepareRPG } from "./game/listeners/CommandListener.js";
startServer();
startListener(() => {
    prepareRPG();
});
console.log("Sistem başlatıldı.");
