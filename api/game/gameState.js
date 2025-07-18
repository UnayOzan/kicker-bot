const gameState = {
    // Game phases: Lobby, Preparation, InTurn, Processing, BossFight, Finished
    status: "Idle",

    lobby: {
        players: {}, // username -> player object
        createdAt: Date.now(),
    },

    round: {
        turn: 0,
        startTimestamp: null,
        actions: {},   // username -> action
        enemies: {},   // username -> enemy object or shared boss
    },

    dungeon: {
        floor: 1,
        boss: null, // active boss object if exists
    },

    stats: {
        totalPlayersJoined: 0,
        totalRoundsPlayed: 0,
    },

    log: [], // system messages
};

export default gameState;