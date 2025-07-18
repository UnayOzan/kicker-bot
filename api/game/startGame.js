import { eventBus } from "../misc/eventBus.js";
import { handleJoin, handleStats } from "./game.js";

export function startRPG() {
    eventBus.subscribe("chat_message", (data) => {
        const { content } = data;
        const { username } = data.sender;

        if (content.startsWith("!join ")) {
            const className = content.split(" ")[1];
            handleJoin(username, className);
        }

        if (content === "!stats") {
            handleStats(username);
        }
    });
}