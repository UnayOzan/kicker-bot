import { Participant } from "./Participant.js";

export interface Lobby {
    players: Record<string, Participant>;
    createdAt: number;
    waitTime: WaitDuration;
}

export enum WaitDuration {
    Pause = -1,
    Fast = 10,
    Short = 30,
    Long = 60,
}

export function createDefaultLobby(): Lobby {
    return {
        players: {},
        createdAt: Date.now(),
        waitTime: WaitDuration.Short,
    };
}