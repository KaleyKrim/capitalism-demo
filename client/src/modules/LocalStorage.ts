export enum GAME_STATE_PROPERTIES {
	"userId",
	"totalCoins",
	"updatedAt",
	"businessOneLevel",
	"businessTwoLevel",
	"businessThreeLevel",
	"businessOneIsAutomated",
	"businessTwoIsAutomated",
	"businessThreeIsAutomated",
}

export interface GameState {
	updatedAt: number; // unix
	totalCoins: number, 
	businessOneLevel: number,
	businessTwoLevel: number,
	businessThreeLevel: number,
	businessOneIsAutomated: boolean,
	businessTwoIsAutomated: boolean,
	businessThreeIsAutomated: boolean,
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

export function getGameState(): Partial<GameState> {
	const gameState: Partial<GameState> = {};
	for (const key of Object.keys(GAME_STATE_PROPERTIES)) {
		const property = localStorage.getItem(getLocalStorageKeyName(key));
		if (!property) {
			continue;
		}
		gameState[key] = property;
	}
	return gameState;
}