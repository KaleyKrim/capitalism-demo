export const BUSINESS_MASTER_DATA = {
	"businessOne": {
		name: "Gummy Shop",
		speedBonusLevels: {
			10: .50,
			20: .85,
			30: .90,
			40: .95,
		},
		increasedEarningsPerLevelUp: 1.3,
		levelUpCostIncrease: 1.5,
		baseBusinessStats: {
			level: 0,
			msPerHarvest: 5000,
			coinsEarnedPerHarvest: 1,
			isAutomated: false,
			coinsToLevelUp: 5,
		},
		costToHireManager: 10,
	},
	"businessTwo": {
		name: "Shaved Ice Shop",
		speedBonusLevels: {
			10: .75,
			20: .85,
			30: .90,
			40: .95,
		},
		increasedEarningsPerLevelUp: 1.3,
		levelUpCostIncrease: 1.6,
		baseBusinessStats: {
			level: 0,
			msPerHarvest: 10000,
			coinsEarnedPerHarvest: 5,
			isAutomated: false,
			coinsToLevelUp: 15,
		},
		costToHireManager: 100,
	},
	"businessThree": {
		name: "Fancy Gummy Shop",
		speedBonusLevels: {
			10: .75,
			20: .85,
			30: .90,
			40: .95,
		},
		increasedEarningsPerLevelUp: 1.2,
		levelUpCostIncrease: 1.9,
		baseBusinessStats: {
			level: 0,
			msPerHarvest: 20000,
			coinsEarnedPerHarvest: 20,
			isAutomated: false,
			coinsToLevelUp: 20,
		},
		costToHireManager: 110,
	}
}