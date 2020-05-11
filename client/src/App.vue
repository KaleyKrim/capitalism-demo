<template>
	<div id="app">
		<div class="row">
			<div class="col">
				<img alt="" src="./assets/managers/businessOneManager.gif" />
				<img alt="" src="./assets/managers/businessTwoManager.gif" />
				<img alt="" src="./assets/managers/businessThreeManager.gif" />
				<h1>✨Jellyfish Capitalist✨</h1>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<ul class="list-group">
					<li class="list-group-item">Current Score: {{ totalScore }} </li>
					<li class="list-group-item">Bank Balance: ${{ totalCoins }}</li>
				</ul>
			</div>
		</div>
		<div class="row mt-4">
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
			<div class="col">
				<h2>Top Jellyfish Capitalists:</h2>
				<table id="ranking" class="table table-striped table-dark">
					<thead>
						<tr>
							<th scope="col">Rank</th>
							<th scope="col">Name</th>
							<th scope="col">Score</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(rank, index) in ranking" :key="index">
							<th scope="row">{{ index + 1 }}</th>
							<td>{{ rank.name }}</td>
							<td>{{ rank.score }}</td>
						</tr>
					</tbody>
				</table>
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
	private ranking: { name: string; score: number }[] = [];
	@Watch('totalScore')
	onTotalScoreChanged() {
		localStorageTools.updateGameState({ totalScore: this.totalScore });
	}

	@Watch('totalCoins')
	onTotalCoinsChanged() {
		localStorageTools.updateGameState({ totalCoins: this.totalCoins });
	}

	async mounted() {
		const gameState = localStorageTools.getGameState();

		if (gameState.totalScore) {
			this.totalScore = Number(gameState.totalScore);
		}

		if (gameState.totalCoins) {
			this.totalCoins = Number(gameState.totalCoins);
		}

		try {
			const api = new Api();
			this.ranking = await api.getScores();
		} catch (e) {
			console.error("server is offline");
		}

		const businessStats = Object.keys(gameState).filter(key => key.includes("business"));
		let totalEarned = 0;
		for (const business of businessStats) {
			const earnedWhileAway = calculateEarnedWhileAway(gameState[business]);
			if (earnedWhileAway.earnedWhileAway > 0 ) {
				totalEarned = parseFloat((totalEarned + earnedWhileAway.earnedWhileAway).toFixed(2));
			}
		}
		await this.$alert(`You earned $${totalEarned} while you were away!`);
		this.updateCoins(totalEarned);

		if (!gameState.userId) {
			const nickname = await this.$prompt("Please enter a nickname for rankings");
			try {
				const api = new Api();
				const userId = await api.registerUser(nickname);
				localStorageTools.updateGameState({ userId });
			} catch (e) {
				console.error("server is offline");
			}
		}
	}

	updateCoins(amtToUpdate: number) {
		this.totalCoins = parseFloat((this.totalCoins + amtToUpdate).toFixed(2));
	}

	async levelUp() {
		this.totalScore++;
		const api = new Api();
		await api.postScore(this.totalScore);
		this.ranking = await api.getScores();
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
