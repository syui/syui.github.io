<template>
	<div id="app">
		<div class="tarot-card-list">
			<Loading v-show="loading">
				<vue-loading type="barsCylon" color="#99892b" :size="{ width: '50px', height: '50px' }"></vue-loading>    
			</Loading>
			<button @click="picker" ><i class="far fa-play-circle"></i> START</button>

			<p v-if="chosenName.file">
				<img v-show="!loading" :src="chosenName.file" />   <img :src="cnt.file" />
			</p>
			<p v-else><img :src="tarotz" /></p>

		<blockquote>
			<p v-if="chosenName.p">{{ chosenName.p }}</p>
			<p v-else><strong>タロットカード</strong></p>
			<p>{{ cnt.p }}</p>
		</blockquote>

	</div>
</div>
</template>

<script>
import items from '/static/json/tarot.json';
import { VueLoading } from 'vue-loading-template';
export default {
	data() {
		return {
			items,
			chosenName: "",
			cnt: "",
			loading: false,
			tarotz:"/ai/tarot/tarot_card_00.png"
		}
	},
	components: {
		VueLoading
	},
	methods: {
		picker: function(){
			this.loading = true;
			setTimeout(() => {
				var chosenNumber = Math.floor(Math.random() * items.length);
				var cn = Math.floor(Math.random() * items.length);
				this.chosenName = items[chosenNumber];
				while (chosenNumber ===  cn) {
					var cn = Math.floor(Math.random() * items.length);
				};
				this.cnt = items[cn];
				var list_element = document.querySelector("button");
				list_element.remove();
				this.loading = false;
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
