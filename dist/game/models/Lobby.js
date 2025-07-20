export var WaitDuration;
(function (WaitDuration) {
    WaitDuration[WaitDuration["Pause"] = -1] = "Pause";
    WaitDuration[WaitDuration["Fast"] = 10] = "Fast";
    WaitDuration[WaitDuration["Short"] = 30] = "Short";
    WaitDuration[WaitDuration["Long"] = 60] = "Long";
})(WaitDuration || (WaitDuration = {}));
export function createDefaultLobby() {
    return {
        players: {},
        createdAt: Date.now(),
        waitTime: WaitDuration.Short,
    };
}
