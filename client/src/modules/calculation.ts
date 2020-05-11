import { BusinessStats } from "../types";
import { BUSINESS_MASTER_DATA } from "../types/constants";

export function calculateEarnedWhileAway(businessStats: Partial<BusinessStats>): { earnedWhileAway: number; msUntilNextHarvest: number } {
	const timeSinceLastCollected = (Date.now() - Math.round(businessStats.collectedAt * 1000));
	if (!businessStats.isAutomated) {
		const msUntilNextHarvest = businessStats.msPerHarvest - timeSinceLastCollected;
		return { earnedWhileAway: 0, msUntilNextHarvest: msUntilNextHarvest > 0 ? msUntilNextHarvest : 0 };
	}

	const harvestsMissed = Math.round(timeSinceLastCollected / businessStats.msPerHarvest);
	const untilNext = timeSinceLastCollected - (harvestsMissed * businessStats.msPerHarvest);
	return { earnedWhileAway: parseFloat((harvestsMissed * businessStats.coinsEarnedPerHarvest).toFixed(2)), msUntilNextHarvest: untilNext };
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