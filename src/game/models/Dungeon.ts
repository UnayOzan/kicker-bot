
export type DungeonDifficulty = "easy" | "normal" | "hard" | "nightmare";
export type DungeonBiome = "forest" | "desert" | "cave" | "volcano" | "swamp";

export interface Dungeon {
    roundCount: number;
    difficulty: DungeonDifficulty;
    biome: DungeonBiome;
}

export function createDefaultDungeon(): Dungeon {
    return {
        roundCount: 10,
        difficulty: "easy",
        biome: "forest",
    };
}