export function createDefaultLobby() {
    return {
        players: {},
        createdAt: Date.now(),
        waitTime: 15,
    };
}
