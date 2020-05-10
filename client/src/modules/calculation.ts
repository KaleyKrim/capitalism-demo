import { BusinessStats } from "./localStorage";

export function calculateEarnedWhileAway(timePassed: number, businessStats: BusinessStats[]) {
	let earned = 0;
	for (const business of businessStats) {
		if (!business.isAutomated) {
			continue;
		}

		const harvestsMissed = Math.floor(timePassed / business.msPerHarvest);
		earned += (harvestsMissed * business.coinsEarnedPerHarvest);
	}
	return earned;
}