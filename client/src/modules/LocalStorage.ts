import { GameState, BusinessStats } from "../types";

export const GAME_STATE_PROPERTIES = [
	"updatedAt",
	"userId",
	"totalCoins",
	"totalScore",
	"businessOne",
	"businessTwo",
	"businessThree",
];

export function getJfcUserId(): string | null {
	return localStorage.getItem("userId");
}

export function setJfcUserId(userId: string): void {
	localStorage.setItem("userId", userId);
}

export function getGameState(keysToGet: string[] = GAME_STATE_PROPERTIES): Partial<GameState> {
	const gameState: Partial<GameState> = {};
	for (const key of keysToGet) {
		let property = localStorage.getItem(key);
		if (!property) {
			continue;
		}
		if (key.includes("business")) {
			property = JSON.parse(property);
		}
		gameState[key] = property;
	}
	return gameState;
}

export function updateGameState(gameState: Partial<GameState>) {
	for (const key of Object.keys(gameState)) {
		const property = typeof gameState[key] === 'object' ? JSON.stringify(gameState[key]) : String(gameState[key]);
		localStorage.setItem(key, property);
	}

	localStorage.setItem("updatedAt", `${Math.floor(Date.now() / 1000)}`);
}

export function getSingleBusinessState(businessId: string): Partial<BusinessStats> {
	const singleBusinessStats = getGameState([businessId]);
	return singleBusinessStats[businessId];
}