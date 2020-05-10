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
import { getNewStatsForLevelUp } from "../modules/calculation";

@Component
export default class Business extends Vue {
	@Prop()
	private businessId!: string;
	@Prop()
	private totalCoins!: number;
	private businessName = BUSINESS_MASTER_DATA[this.businessId].name;

	private stats: BusinessStats =  { 
		...BUSINESS_MASTER_DATA[this.businessId].baseBusinessStats, 
		collectedAt: 0,
	};
	private notReadyToCollect = false;


	mounted() {
		const businessStats = localStorageTools.getSingleBusinessState(this.businessId);
		if (!businessStats) {
			return;
		}

		for (const key of Object.keys(businessStats)) {
			this.stats[key] = businessStats[key];
		}

		const timeSinceLastCollected = Math.round(Date.now() / 1000) - this.stats.collectedAt;
		const msPerHarvestInSec = Math.round(this.stats.msPerHarvest / 1000);
		const isNotReadyToCollect = timeSinceLastCollected < msPerHarvestInSec;
		if (isNotReadyToCollect) {
			this.notReadyToCollect = true;
			this.startTimer((msPerHarvestInSec - timeSinceLastCollected) * 1000);
		}
	}

	private getFullImgPath() {
		return require(`../assets/businesses/${this.businessId}.png`);
	}

	private startTimer(time: number) {
		setTimeout(() => {
			this.notReadyToCollect = false;
		}, time);
	}

	private levelUp() {
		if (this.totalCoins < this.stats.coinsToLevelUp) {
			throw new Error("can't level up yet!");
		}

		const newStats = getNewStatsForLevelUp(this.businessId, this.stats);

		this.emitLevelUp();
		for (const key of Object.keys(newStats)) {
			this.stats[key] = newStats[key];
		}
		localStorageTools.updateGameState({ [this.businessId]: newStats });
	}

	private emitLevelUp() {
		this.$emit("updateCoins", (parseFloat((this.stats.coinsToLevelUp * -1).toFixed(2))));
		this.$emit("levelUp");
	}

	private emitEarnedCoins() {
		this.stats.collectedAt = Math.round(Date.now() / 1000);
		localStorageTools.updateGameState({ [this.businessId]: this.stats });
		this.notReadyToCollect = true;
		this.$emit("updateCoins", this.stats.coinsEarnedPerHarvest);
		this.startTimer(this.stats.msPerHarvest);
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
