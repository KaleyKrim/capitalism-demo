<template>
  <div id="app">
    <img alt="" src="./assets/managers/jelly1.gif" />
	<img alt="" src="./assets/managers/jelly2.gif" />
    <img alt="" src="./assets/managers/jelly3.gif" />
	<h1>✨Let's play Jellyfish Capitalist✨</h1>
	<div>total coins: {{ totalCoins }}</div>
	<div class="row">
		<div class="col">
			<Business 
				imgPath="businesses/gummy.png" 
				businessName="gummy shop" 
				:totalCoins="totalCoins"
				@updateCoins="updateCoins($event)"
			/>
		</div>
		<div class="col">
			<Business 
				imgPath="businesses/ice1.png" 
				businessName="shaved ice shop" 
				:totalCoins="totalCoins"
				@updateCoins="updateCoins($event)"
			/>
		</div>
		<div class="col">
			<Business 
				imgPath="businesses/gummy2.png" 
				businessName="fancy gummy shop" 
				:totalCoins="totalCoins"
				@updateCoins="updateCoins($event)"
			/>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Business from "./components/Business.vue";

@Component({
  components: {
    Business
  }
})
export default class App extends Vue {
	private totalCoins = 5;

	updateCoins(amtToUpdate: number) {
		this.totalCoins +=  amtToUpdate;
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
