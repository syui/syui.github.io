<template>
	<div id="app">
		<div class="tarot-card-list">
			<Loading v-show="loading">
				<vue-loading type="barsCylon" color="#99892b" :size="{ width: '50px', height: '50px' }"></vue-loading>    
			</Loading>
			<button @click="picker" ><i class="far fa-play-circle"></i> START</button>
				<h3 v-if="cName.h">{{ cName.h }}</h3>
			<p v-if="random === 1 && cName.gif === 'true'">
				<img v-show="!loading" :src="'/ai/card/card_' + cName.id + '.gif'" /> 
			</p>
			<p v-else-if="cName.id">
				<img v-show="!loading" :src="'/ai/card/card_' + cName.id + '.webp'" />
			</p>
			<p v-else><img :src="tarotz" /></p>

		<blockquote>
			<p v-if="cName.p">{{ cName.p }}</p>
			<p v-else><strong></strong></p>
		</blockquote>

	</div>
</div>
</template>

<script>
//import items from '/static/json/card.json';
import axios from 'axios'
import { VueLoading } from 'vue-loading-template';
export default {
	data() {
		return {
			items: null,
			cName: "",
			cnt: "",
			loading: false,
			tarotz:"/ai/card/card_0.png",
			random:null
		}
	},
	mounted() {
		axios
			.get('/json/card.json')
			.then(response => (this.items = response.data))
	},
	components: {
		VueLoading
	},
	methods: {
		picker: function(){
			this.loading = true;
			setTimeout(() => {
				var cNumber = Math.floor(Math.random() * this.items.length);
				var cn = Math.floor(Math.random() * this.items.length);
				this.cName = this.items[cNumber];
				while (cn ===  0) {
					var cn = Math.floor(Math.random() * this.items.length);
				};
				while (cNumber ===  0) {
					var cNumber = Math.floor(Math.random() * this.items.length);
				};
				while (cNumber ===  cn) {
					var cn = Math.floor(Math.random() * this.items.length);
				};
				this.cnt = this.items[cn];
				var list_element = document.querySelector("button");
				list_element.remove();
				this.loading = false;
				this.random = 0 + Math.floor(Math.random() * this.items.length);
			}, 1200);
		}
	}
}
</script>

<style>
img {
	width:400px;
}
</style>
