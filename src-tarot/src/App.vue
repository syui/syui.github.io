<template>
	<div id="app">
		<button @click="picker"><i class="far fa-play-circle"></i> START</button>
		<p v-if="chosenName.file"><img :src="chosenName.file" /> <img :src="cnt.file" /></p>
  <p v-else><img :src="tarotz" /></p>
		<p></p>
	<blockquote>
		<p v-if="chosenName.p">{{ chosenName.p }}</p>
		<p v-else><strong>タロットカード</strong></p>
		<p>{{ cnt.p }}</p>
	</blockquote>
</div>
	</div>

</div>
</template>

<script>
import items from '/static/json/tarot.json';
export default {
	data() {
		return {
			items,
			chosenName: "",
			cnt: "",
			tarotz:"/ai/tarot/tarot_card_00.png"
		}
	},
	methods: {
		picker: function(){
			var chosenNumber = Math.floor(Math.random() * items.length);
			var cn = Math.floor(Math.random() * items.length);
			this.chosenName = items[chosenNumber];
			while (chosenNumber ===  cn) {
				var cn = Math.floor(Math.random() * items.length);
			};
			this.cnt = items[cn];
			var list_element = document.querySelector("button");
			list_element.remove();
		}
	}
}
</script>

<style>
img {
	width:400px;
}
</style>
