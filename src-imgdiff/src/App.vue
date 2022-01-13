<template>
	<div id="app">
		<div v-for="item in items" :key="item.id">
			<p><a :href="item.file"><img :src="item.file" /></a></p>
		</div>
	</div>
</template>

<script>
import items from '/static/json/img.json';
export default {
	data() {
		return {
			items
		}
	}
}
</script>

<style>
</style>
