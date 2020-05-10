<template>
	<div class="card text-center" style="width: 300px;">
		<div class="card-header">
			<img :src="getFullImgPath()" />
			{{ businessName }}
			<img :src="getFullImgPath()" />
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
import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import * as localStorageTools from "../modules/localStorage";
import { BusinessStats } from "../types";
import { BUSINESS_MASTER_DATA } from "../types/constants";

@Component
export default class Business extends Vue {
	@Prop()
	private businessId!: string;
	@Prop()
	private totalCoins!: number;
	private businessName = BUSINESS_MASTER_DATA[this.businessId].name;
	private notReadyToCollect = false;
	// we will get this dynamically
	private stats: BusinessStats = {
		level: 0,
		msPerHarvest: 10000,
		coinsEarnedPerHarvest: 1,
		isAutomated: false,
		coinsToLevelUp: 5,
	}

	mounted() {
		const businessStats = localStorageTools.getSingleBusinessState(this.businessId);
		if (businessStats) {
			for (const key of Object.keys(businessStats)) {
				this.stats[key] = businessStats[key];
			}
		}
	}

	private getFullImgPath() {
		return require(`../assets/businesses/${this.businessId}.png`);
	}

	private startTimer() {
		setTimeout(() => {
			this.notReadyToCollect = false;
		}, this.stats.msPerHarvest);
	}

	// move to calculation module
	private getNewStatsForLevelUp(): Partial<BusinessStats> {
		const newLevel = this.stats.level + 1;
		const speedBonusFactor = BUSINESS_MASTER_DATA[this.businessId].speedBonusLevels[newLevel];
		const newStats = {
			level: newLevel,
			coinsEarnedPerHarvest: parseFloat((this.stats.coinsEarnedPerHarvest * BUSINESS_MASTER_DATA[this.businessId].increasedEarningsPerLevelUp).toFixed(2)),
			coinsToLevelUp: parseFloat((this.stats.coinsToLevelUp * BUSINESS_MASTER_DATA[this.businessId].levelUpCostIncrease).toFixed(2)),
		};

		if (speedBonusFactor) {
			newStats["msPerHarvest"] = this.stats.msPerHarvest * speedBonusFactor;
		}

		return newStats;
	}

	private levelUp() {
		if (this.totalCoins < this.stats.coinsToLevelUp) {
			throw new Error("can't level up yet!");
		}

		const newStats = this.getNewStatsForLevelUp();

		this.emitLevelUp();
		for (const key of Object.keys(newStats)) {
			this.stats[key] = newStats[key];
		}
		localStorageTools.updateGameState({ [this.businessId]: newStats });
	}

	private emitLevelUp() {
		this.$emit("updateCoins", (this.stats.coinsToLevelUp * -1));
		this.$emit("levelUp");
	}

	private emitEarnedCoins() {
		this.notReadyToCollect = true;
		this.$emit("updateCoins", this.stats.coinsEarnedPerHarvest);
		console.log("update coins!");
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
