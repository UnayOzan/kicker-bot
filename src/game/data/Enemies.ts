import { Participant, ParticipantActions, ParticipantClasses } from "../models/Participant.js";


export const enemies: Participant[] = [
    {
        name: "Orc Savaşçı",
        class: ParticipantClasses.Defender,  // Uygun class varsa yoksa 'defender' gibi eşdeğer seçin
        stats: { hp: 150, atk: 20, def: 10 },
        icon: "🪓",
        lastAction: ParticipantActions.Idle,
    },
    {
        name: "Orc Okçu",
        class: ParticipantClasses.Archer,
        stats: { hp: 100, atk: 25, def: 5 },
        icon: "🏹",
        lastAction: ParticipantActions.Idle,
    },
    {
        name: "Orc Şaman",
        class: ParticipantClasses.Healer,
        stats: { hp: 80, atk: 30, def: 3 },
        icon: "🔮",
        lastAction: ParticipantActions.Idle,
    },
    {
        name: "Orc Dev",
        class: ParticipantClasses.Defender,
        stats: { hp: 200, atk: 15, def: 20 },
        icon: "👹",
        lastAction: ParticipantActions.Idle,
    },
];