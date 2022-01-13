<template>
	<div id="app">
		<button @click="picker"><i class="far fa-play-circle"></i> START</button>
		<p><img :src="chosenName.file" /> <img :src="cnt.file" /></p>
	<p>{{ chosenName.p }}</p>
	<p>{{ cnt.p }}</p>
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
			cnt: ""
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
		}
	}
}
</script>

<style>
img {
	width:400px;
}
</style>
