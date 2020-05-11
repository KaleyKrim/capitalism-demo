<template>
	<div class="card text-center" style="width: 300px;">
		<div class="card-header">
			<img :src="getFullImgPath()" />
			{{ businessName }}
			<img :src="getFullImgPath()" />
		</div>
		<div class="card-body">
			<p class="card-text">
				earns ${{ stats.coinsEarnedPerHarvest }} every {{ stats.msPerHarvest / 1000 }} seconds
			</p>
			<button 
				type="button" 
				class="btn btn-info" 
				v-bind:class="{ disabled: notReadyToCollect}"
				@click="emitEarnedCoins"
			>
				{{ stats.isAutomated ? "automated♪" : "Collect" }}
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
		<div class="card-footer text-muted">
			<div v-if="stats.isAutomated">
				Manager: <img :src="getFullManagerImgPath()" />
			</div>
			<button
				v-else
				type="button"
				:disabled="totalCoins < costToHireManager"
				@click="hireManager"
				>
				Hire manager for ${{ costToHireManager }}
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import * as localStorageTools from "../modules/localStorage";
import { BusinessStats } from "../types";
import { BUSINESS_MASTER_DATA } from "../types/constants";
import { getNewStatsForLevelUp, calculateEarnedWhileAway } from "../modules/calculation";

@Component
export default class Business extends Vue {
	@Prop()
	private businessId!: string;
	@Prop()
	private totalCoins!: number;
	private businessName = BUSINESS_MASTER_DATA[this.businessId].name;
	private costToHireManager = BUSINESS_MASTER_DATA[this.businessId].costToHireManager;
	private stats: BusinessStats = {
		...BUSINESS_MASTER_DATA[this.businessId].baseBusinessStats, 
		collectedAt: 0,
	};
	private notReadyToCollect = false;

	async mounted() {
		const businessStats = localStorageTools.getSingleBusinessState(this.businessId);
		if (!businessStats) {
			return;
		}

		for (const key of Object.keys(businessStats)) {
			this.stats[key] = businessStats[key];
		}

		const earnedWhileAway = calculateEarnedWhileAway(businessStats);
		const isNotReadyToCollect = earnedWhileAway.msUntilNextHarvest > 0;


		if (this.stats.isAutomated) {
			this.startTimer(this.stats.msPerHarvest);
		}

		if (isNotReadyToCollect) {
			this.notReadyToCollect = true;
			this.startTimer(earnedWhileAway.msUntilNextHarvest + 1000);
			return;
		}

		// if (this.stats.isAutomated && !isNotReadyToCollect) {
		// 	this.emitEarnedCoins();
		// }
	}

	private getFullImgPath() {
		return require(`../assets/businesses/${this.businessId}.png`);
	}

	private getFullManagerImgPath() {
		return require(`../assets/managers/${this.businessId}Manager.gif`);
	}

	private startTimer(time: number) {
		setTimeout(() => {
			this.notReadyToCollect = false;
			if (this.stats.isAutomated) {
				this.emitEarnedCoins();
			}
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
		localStorageTools.updateGameState({ [this.businessId]: this.stats });
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

	private hireManager() {
		this.stats.isAutomated = true;
		localStorageTools.updateGameState({ [this.businessId]: this.stats });
		this.$emit("updateCoins", (this.costToHireManager * -1));
		const untilNextHarvest = this.stats.collectedAt ? 
			Math.round((this.stats.msPerHarvest - (Date.now() - (this.stats.collectedAt * 1000)))/ 1000) :
			this.stats.msPerHarvest;

		this.startTimer(untilNextHarvest);
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
