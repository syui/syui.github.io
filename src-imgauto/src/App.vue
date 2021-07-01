<template>
<div class="containerx">
<div class="img-new">
<p><img :src="'/img/yui_' + lid + '.png'" /></p>
</div>
<div class="img-old">
<p>
<img v-for="(n,index) of id" :key="n" :src="'/img/yui_'+ ( '00' + index ).slice( -2 ) +'.png'" />
</p>
</div>
</div>
</template>

<script>
export default {
	data () {
		return {
id: Number(process.env.VUE_APP_IMGNUMBER - 2),
					lid: Number(process.env.VUE_APP_IMGNUMBER - 2)
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
