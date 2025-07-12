import { startServer } from "./api/server.js";
import { startListener } from "./api/listener.js";

startServer();
startListener();

console.log("Sistem başlatıldı.");
