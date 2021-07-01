<template>
	<div class="containerx">
		<div class="img-new">
			<p><a :href=lurl><img :src="'/img/yui_' + lid + '.png'" /></a></p>
	</div>
	<div class="img-old">
		<p>
			<a v-for="(n,index) of id" :key="n" :href="'/img/yui_'+ ( '00' + index ).slice( -2 ) +'.png'">
				<img :src="'/img/yui_'+ ( '00' + index ).slice( -2 ) +'.png'" />
			</a>
		</p>
	</div>
</div>
</template>

<script>
var e = Number(process.env.VUE_APP_IMGNUMBER - 2);
export default {
	data () {
		return {
			id: e,
			lid: e,
			lurl: '/img/yui_' + e + '.png'
		}
	}
}
</script>

<style>
.containerx {
	padding: 0 60px;
	width: auto;
}

.containerx p img {
	width: 300px;
}

.containerx > .img-new {
	text-align: center;
}

@media screen and (max-width:1000px) { 
	html {
		font-size: 100%; 
	}
	.logo span.icon-phoenix-world{
		font-size: 60px;
		font-size: 6rem;
	}
	.containerx { 
		margin: 0 15px;
		padding: 0 ;
		font-size:18px;
		word-wrap: break-word;
		word-break: break-all;
	}
	.containerx p img {
		width: 100%;
	}
}
</style>
