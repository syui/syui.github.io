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
	<div class="img-chara">
		<p>
			<a v-for="(n,index) of cid" :key="n" :href="'/img/c_'+ ( '00' + index ).slice( -2 ) +'.png'">
				<img :src="'/img/c_'+ ( '00' + index ).slice( -2 ) +'.png'" />
			</a>
		</p>
	</div>
	<div class="img-ai">
		<p>
			<a v-for="(n,index) of aid" :key="n" :href="'/img/ai_'+ ( '00' + index ).slice( -2 ) +'.png'">
				<img :src="'/img/ai_'+ ( '00' + index ).slice( -2 ) +'.png'" />
			</a>
		</p>
	</div>
	<div class="img-octo">
		<p>
			<a v-for="(n,index) of oid" :key="n" :href="'/img/octo_'+ ( '00' + index ).slice( -2 ) +'.png'">
				<img :src="'/img/octo_'+ ( '00' + index ).slice( -2 ) +'.png'" />
			</a>
		</p>
	</div>
	<div class="img-item">
		<p>
			<a v-for="(n,index) of iid" :key="n" :href="'/img/item_'+ ( '00' + index ).slice( -2 ) +'.png'">
				<img :src="'/img/item_'+ ( '00' + index ).slice( -2 ) +'.png'" />
			</a>
		</p>
	</div>
	<div class="img-field">
		<p>
			<a v-for="(n,index) of fid" :key="n" :href="'/img/f_'+ ( '00' + index ).slice( -2 ) +'.png'">
				<img :src="'/img/f_'+ ( '00' + index ).slice( -2 ) +'.png'" />
			</a>
		</p>
	</div>
</div>
</template>

<script>
var e = Number(process.env.VUE_APP_IMGNUMBER - 1);
var a = Number(process.env.VUE_APP_IMGNUMBERA);
var c = Number(process.env.VUE_APP_IMGNUMBERC);
var o = Number(process.env.VUE_APP_IMGNUMBERO);
var i = Number(process.env.VUE_APP_IMGNUMBERI);
var f = Number(process.env.VUE_APP_IMGNUMBERF);
export default {
	data () {
		return {
			id: e,
			lid: e,
			aid: a,
			cid: c,
			oid: o,
			iid: i,
			fid: f,
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
