import { startServer } from "./api/Server.js";
import { startListener } from "./api/Listener.js";
import { prepareActionListener } from "./game/listeners/ActionListener.js";
import { prepareCommandListener } from "./game/listeners/CommandListener.js";
import { prepareEmoteCommandListener } from "./game/listeners/EmoteCommandListener.js";

startServer();

startListener(() => {
  prepareActionListener();
  prepareCommandListener();
  prepareEmoteCommandListener();
});

console.log("Sistem başlatıldı.");