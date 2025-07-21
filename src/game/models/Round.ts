
import { Participant } from "./Participant.js";

export type RoundType = "normal" | "boss";

export interface RoundPair {
  id: number;
  player: Participant;
  enemy: Participant;
}

export interface Round {
    turn: number;
    waitTime: number;
    isBossFight: boolean;
    pairs: Record<string, RoundPair>;
    startTimestamp: number;
    log: string[];
}