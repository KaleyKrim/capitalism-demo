export interface GameState {
	updatedAt: number; // unix
	userId: string;
	totalCoins: number;
	totalScore: number;
	businessOne: BusinessStats;
	businessTwo: BusinessStats;
	businessThree: BusinessStats;
}

export interface BusinessStats {
	level: number;
	msPerHarvest: number;
	isAutomated: boolean;
	coinsEarnedPerHarvest: number;
	coinsToLevelUp: number;
	collectedAt: number; // unix
}