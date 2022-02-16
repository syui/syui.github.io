<template>
	<div id="app">
		<div class="tarot-card-list">
			<Loading v-show="loading">
				<vue-loading type="barsCylon" color="#99892b" :size="{ width: '50px', height: '50px' }"></vue-loading>    
			</Loading>
			<button @click="picker" ><i class="far fa-play-circle"></i> START</button>

			<p v-if="cName.file">
				<img v-show="!loading" :src="cName.file + '.webp'" />   <img :src="cnt.file + '.webp'" />
			</p>
			<p v-else><img :src="tarotz" /></p>

		<blockquote>
			<p v-if="cName.p">{{ cName.p }}</p>
			<p v-else><strong></strong></p>
			<p>{{ cnt.p }}</p>
		</blockquote>

	</div>
</div>
</template>

<script>
//import items from '/static/json/tarot.json';
import axios from 'axios'
import { VueLoading } from 'vue-loading-template';
export default {
	data() {
		return {
			items: null,
			cName: "",
			cnt: "",
			loading: false,
			tarotz:"/ai/tarot/tarot_00.webp"
		}
	},
	mounted() {
		axios
			.get('https://syui.cf/json/tarot.json')
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
				while (cNumber ===  cn) {
					var cn = Math.floor(Math.random() * this.items.length);
				};
				this.cnt = this.items[cn];
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
