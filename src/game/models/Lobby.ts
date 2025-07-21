import { Participant } from "./Participant.js";

export interface Lobby {
    players: Record<string, Participant>;
    createdAt: number;
    waitTime: number;
}

export function createDefaultLobby(): Lobby {
    return {
        players: {},
        createdAt: Date.now(),
        waitTime: 15,
    };
}