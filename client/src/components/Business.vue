<template>
	<div class="card text-center" style="width: 300px;">
		<div class="card-header">
			<img :src="getFullImgPath(imgPath)" />
			{{ businessName }}
			<img :src="getFullImgPath(imgPath)" />
		</div>
		<div class="card-body">
			<p class="card-text">
				earns ${{ stats.coinsEarnedPerHarvest }} per {{ stats.msPerHarvest / 1000 }} seconds
			</p>
			<button 
				type="button" 
				class="btn btn-info" 
				:disabled="notReadyToCollect"
				@click="emitEarnedCoins"
			>
				Collect
			</button>

			<button 
				type="button" 
				class="btn btn-success" 
				:disabled="!(totalCoins >= stats.coinsToLevelUp)"
				@click="levelUp"
				>
					Level Up (Costs ${{ stats.coinsToLevelUp }})
				</button>
		</div>
		<div class="card-footer text-muted">
			Level: {{ stats.level }}
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

interface BusinessStats {
	level?: number;
	msPerHarvest?: number;
	isAutomatic?: boolean;
	coinsEarnedPerHarvest?: number;
	coinsToLevelUp?: number;
}

const SPEED_BONUS_LEVELS = {
	10: .75,
	20: .85,
	30: .90,
	40: .95,
};
const increasedEarningsPerLevelUp = 1.05;
const levelUpCostIncrease = 1.5;

@Component
export default class Business extends Vue {
	@Prop()
	private imgPath!: string;
	@Prop()
	private businessName!: string;
	@Prop()
	private totalCoins!: number;
	private notReadyToCollect = false;
	// we will get this dynamically
	private stats: BusinessStats = {
		level: 0,
		msPerHarvest: 10000,
		coinsEarnedPerHarvest: 1,
		isAutomatic: false,
		coinsToLevelUp: 5,
	}

	private getFullImgPath(imgPath: string) {
		return require(`../assets/${imgPath}`);
	}

	private startTimer() {
		setTimeout(() => {
			this.notReadyToCollect = false;
		}, this.stats.msPerHarvest);
	}

	private getNewStatsForLevelUp(): BusinessStats {
		const newLevel = this.stats.level + 1;
		const isSpeedBonusLevel = SPEED_BONUS_LEVELS[newLevel] ? true : false;
		const newStats = {
			level: newLevel,
			coinsEarnedPerHarvest: this.stats.coinsEarnedPerHarvest * increasedEarningsPerLevelUp,
			coinsToLevelUp: this.stats.coinsToLevelUp * levelUpCostIncrease,
		};

		if (isSpeedBonusLevel) {
			newStats["msPerHarvest"] = this.stats.msPerHarvest * SPEED_BONUS_LEVELS[newLevel];
		}

		return newStats;
	}

	private levelUp() {
		if (this.totalCoins < this.stats.coinsToLevelUp) {
			throw new Error("can't level up yet!");
		}

		const newStats = this.getNewStatsForLevelUp();
		this.emitLevelUp(newStats);
		for (const key of Object.keys(newStats)) {
			this.stats[key] = newStats[key];
		}
	}

	private emitLevelUp(newStats: BusinessStats) {
		this.$emit("updateCoins", (this.stats.coinsToLevelUp * -1));
		this.$emit("updateState", { businessName: this.businessName, ...newStats });
	}

	private emitEarnedCoins() {
		console.log("hello!", this.notReadyToCollect);
		this.notReadyToCollect = true;
		console.log(this.notReadyToCollect);
		this.$emit("updateCoins", this.stats.coinsEarnedPerHarvest);
		this.startTimer();
	}
}
</script>

<style scoped>
.business-block {
	border: 1px;
}

/* h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>
