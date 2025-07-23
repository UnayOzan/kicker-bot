export var ParticipantActions;
(function (ParticipantActions) {
    ParticipantActions["Idle"] = "idle";
    ParticipantActions["Attack"] = "attack";
    ParticipantActions["Heal"] = "heal";
    ParticipantActions["Defend"] = "defend";
})(ParticipantActions || (ParticipantActions = {}));
export var ParticipantClasses;
(function (ParticipantClasses) {
    ParticipantClasses["Archer"] = "archer";
    ParticipantClasses["Healer"] = "healer";
    ParticipantClasses["Defender"] = "defender";
})(ParticipantClasses || (ParticipantClasses = {}));
export const participantDefaultStats = {
    [ParticipantClasses.Archer]: { hp: 80, atk: 15, def: 5 },
    [ParticipantClasses.Healer]: { hp: 70, atk: 10, def: 5 },
    [ParticipantClasses.Defender]: { hp: 120, atk: 10, def: 15 },
};
export const participantDefaultIcons = {
    [ParticipantClasses.Archer]: "🏹",
    [ParticipantClasses.Healer]: "🔮",
    [ParticipantClasses.Defender]: "🛡️",
};
