import { BusinessStats } from "../types";
import { BUSINESS_MASTER_DATA } from "../types/constants";

export function calculateEarnedWhileAway(businessStats: BusinessStats[]) {
	let earned = 0;
	for (const business of businessStats) {
		if (!business.isAutomated) {
			continue;
		}
		const timeSinceLastCollected = Math.round((Date.now() / 1000)) - business.collectedAt;
		const harvestsMissed = Math.floor(timeSinceLastCollected / business.msPerHarvest);
		earned += (harvestsMissed * business.coinsEarnedPerHarvest);
	}
	return earned;
}

export function getNewStatsForLevelUp(businessId: string, currentStats: BusinessStats): Partial<BusinessStats> {
	const newLevel = currentStats.level + 1;
	const speedBonusFactor = BUSINESS_MASTER_DATA[businessId].speedBonusLevels[newLevel];
	const newStats = {
		level: newLevel,
		coinsEarnedPerHarvest: parseFloat((currentStats.coinsEarnedPerHarvest * BUSINESS_MASTER_DATA[businessId].increasedEarningsPerLevelUp).toFixed(2)),
		coinsToLevelUp: parseFloat((currentStats.coinsToLevelUp * BUSINESS_MASTER_DATA[businessId].levelUpCostIncrease).toFixed(2)),
	};

	if (speedBonusFactor) {
		newStats["msPerHarvest"] = parseFloat((currentStats.msPerHarvest * speedBonusFactor).toFixed(2));
	}

	return newStats;
}