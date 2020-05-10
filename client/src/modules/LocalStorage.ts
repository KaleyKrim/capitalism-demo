export const GAME_STATE_PROPERTIES = [
	"updatedAt",
	"userId",
	"totalCoins",
	"updatedAt",
	"businessOneLevel",
	"businessTwoLevel",
	"businessThreeLevel",
	"businessOneIsAutomated",
	"businessTwoIsAutomated",
	"businessThreeIsAutomated",
	"businessOneMsPerHarvest",
	"businessTwoMsPerHarvest",
	"businessThreeMsPerHarvest",
	"businessOneCoinsEarnedPerHarvest",
	"businessTwoCoinsEarnedPerHarvest",
	"businessThreeCoinsEarnedPerHarvest",
	"businessOneCoinsToLevelUp",
	"businessTwoCoinsToLevelUp",
	"businessThreeCoinsToLevelUp",
];

export interface GameState {
	updatedAt: number; // unix
	totalCoins: number, 
	businessOneLevel: number,
	businessTwoLevel: number,
	businessThreeLevel: number,
	businessOneIsAutomated: boolean,
	businessTwoIsAutomated: boolean,
	businessThreeIsAutomated: boolean,
	businessOneMsPerHarvest: number,
	businessTwoMsPerHarvest: number,
	businessThreeMsPerHarvest: number,
	businessOneCoinsEarnedPerHarvest: number,
	businessTwoCoinsEarnedPerHarvest: number,
	businessThreeCoinsEarnedPerHarvest: number,
	businessOneCoinsToLevelUp: number,
	businessTwoCoinsToLevelUp: number,
	businessThreeCoinsToLevelUp: number,
}

export interface BusinessStats {
	level: number;
	msPerHarvest: number;
	isAutomated: boolean;
	coinsEarnedPerHarvest: number;
	coinsToLevelUp: number;
}

function getLocalStorageKeyName(objectKey: string): string {
	const firstLetter = objectKey.slice(0, 1);
	const firstLetterCapitalized = firstLetter[0].toUpperCase();
	const otherLetters = objectKey.slice(1);
	return `jfc${firstLetterCapitalized}${otherLetters}`;
}

// function getAppObjectKeyName(localStorageKey: string): string {
// 	const withoutPrefix = localStorageKey.slice(3);
// 	const firstLetter = withoutPrefix[0].toLowerCase();
// 	return `${firstLetter}${withoutPrefix.slice(1)}`;
// }

export function getJfcUserId(): string | null {
	return localStorage.getItem(getLocalStorageKeyName("userId"));
}

export function setJfcUserId(userId: string): void {
	localStorage.setItem(getLocalStorageKeyName("userId"), userId);
}

export function updateGameState(gameState: Partial<GameState>) {
	for (const key of Object.keys(gameState)) {
		localStorage.setItem(getLocalStorageKeyName(key), String(gameState[key]));
	}

	localStorage.setItem(getLocalStorageKeyName("updatedAt"), `${Date.now() / 1000}`);
}

export function getGameState(keysToGet: string[] = GAME_STATE_PROPERTIES): Partial<GameState> {
	const gameState: Partial<GameState> = {};
	for (const key of keysToGet) {
		const property = localStorage.getItem(getLocalStorageKeyName(key));
		if (!property) {
			continue;
		}
		gameState[key] = property;
	}
	return gameState;
}

export function getSingleBusinessState(businessId: string): Partial<BusinessStats> {
	const gameState = getGameState(GAME_STATE_PROPERTIES.filter(property => property.includes(businessId)));
	const startIndex = businessId.length;
	const singleBusinessStats: Partial<BusinessStats> = {};
	for (const key of Object.keys(gameState)) {
		const removePrefix = key.slice(startIndex);
		const firstLetter = removePrefix[0].toLowerCase();
		const newKey = `${firstLetter}${removePrefix.slice(1)}`;
		singleBusinessStats[newKey] = gameState[key];
	}
	return singleBusinessStats;
}