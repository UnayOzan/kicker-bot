export enum ParticipantActions {
    Idle = "idle",
    Attack = "attack",
    Heal = "heal",
    Defend = "defend",
}

export enum ParticipantClasses {
    Archer = "archer",
    Healer = "healer",
    Defender = "defender",
}

export interface ParticipantStats {
    hp: number;
    atk: number;
    def: number;
}

export const participantDefaultStats: Record<ParticipantClasses, ParticipantStats> = {
    [ParticipantClasses.Archer]: { hp: 80, atk: 15, def: 5 },
    [ParticipantClasses.Healer]: { hp: 70, atk: 10, def: 5 },
    [ParticipantClasses.Defender]: { hp: 120, atk: 10, def: 15 },
};

export const participantDefaultIcons: Record<ParticipantClasses, string> = {
    [ParticipantClasses.Archer]: "🏹",
    [ParticipantClasses.Healer]: "🔮",
    [ParticipantClasses.Defender]: "🛡️",
};

export interface Participant {
    name: string;
    icon?: string;
    class: ParticipantClasses;
    stats: ParticipantStats;
    lastAction?: ParticipantActions;
}