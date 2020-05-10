<template>
	<div id="app">
		<img alt="" src="./assets/managers/jelly1.gif" />
		<img alt="" src="./assets/managers/jelly2.gif" />
		<img alt="" src="./assets/managers/jelly3.gif" />
		<h1>✨Let's play Jellyfish Capitalist✨</h1>
		<ul class="list-group">
			<li class="list-group-item">Current Score: {{ totalScore }} </li>
			<li class="list-group-item">Bank Balance: ${{ totalCoins }}</li>
		</ul>
	<div class="row">
		<div class="col">
			<Business 
				businessId="businessOne"
				:totalCoins="totalCoins"
				@updateCoins="updateCoins($event)"
				@levelUp="levelUp('businessOne')"
			/>
		</div>
		<div class="col">
			<Business 
				businessId="businessTwo"
				:totalCoins="totalCoins"
				@updateCoins="updateCoins($event)"
				@levelUp="levelUp('businessTwo')"
			/>
		</div>
		<div class="col">
			<Business 
				businessId="businessThree"
				:totalCoins="totalCoins"
				@updateCoins="updateCoins($event)"
				@levelUp="levelUp('businessThree')"
			/>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Business from "./components/Business.vue";
import { Api } from "./modules/requester";
import * as localStorageTools from "./modules/localStorage";
import { calculateEarnedWhileAway } from "./modules/calculation";

@Component({
  components: {
    Business
  }
})
export default class App extends Vue {
	private totalCoins = 5;
	private totalScore = 0;

	@Watch('totalScore')
	onTotalScoreChanged() {
		// const api = new Api();
		// api.postScore(this.totalScore);
		localStorageTools.updateGameState({ totalScore: this.totalScore });

	}

	@Watch('totalCoins')
	onTotalCoinsChanged() {
		localStorageTools.updateGameState({ totalCoins: this.totalCoins });
	}

	async mounted() {
		// check for userId. if it's not there, ask for nickname. post nickname

		// const api = new Api();
		// const ranking = await api.getScores();
		// get scores from api

		const gameState = localStorageTools.getGameState();
		if (!gameState.updatedAt) {
			return;
		}

		if (gameState.totalScore) {
			this.totalScore = Number(gameState.totalScore);
		}

		if (gameState.totalCoins) {
			this.totalCoins = Number(gameState.totalCoins);
		}

		const businessKeys = Object.keys(gameState).filter(key => key.includes("business"));
		const earnedWhileAway = calculateEarnedWhileAway(businessKeys.map(key => ({ ...gameState[key] })));
		// TODO: notify user
		this.updateCoins(earnedWhileAway);
	}

	updateCoins(amtToUpdate: number) {
		this.totalCoins = parseFloat((this.totalCoins + amtToUpdate).toFixed(2));
	}

	levelUp() {
		this.totalScore++;
	}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
