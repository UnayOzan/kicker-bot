import { eventBus } from "../misc/eventBus.js";
import * as commands from "./commands.js";
import * as lobby from "./lobby.js";

export function prepareRPG() {
    eventBus.subscribe("chat_message", (data) => {
        const { content } = data;
        const { username } = data.sender;

        const [cmd, ...args] = content.trim().split(" ");
        const command = cmd.toLowerCase();

        switch (command) {
            // game flow commands
            case "!startrpg":
                lobby.openLobby();
                break;
            case "!join":
                lobby.handleJoin(username, args[0]);
                break;
            case "!leave":
                lobby.handleLeave(username);
                break;

            // player commands
            case "!attack": // Attack beats heal, but is beaten by defend
                commands.handleAttack(username);
                break;
            case "!defend": // Defend beats attack, but is beaten by heal
                commands.handleDefend(username);
                break;
            case "!heal": // Heal beats defend, but is beaten by attack
                commands.handleHeal(username);
                break;

            //common commands
            case "!stats":
                commands.handleStats(username);
                break;
            case "!players":
                commands.handlePlayers();
                break;
            case "!help":
                commands.handleHelp();
                break;

            default:
                // Unknown command, do nothing
                // console.log("Unknown command: ", content)
                break;
        }
    });
}
