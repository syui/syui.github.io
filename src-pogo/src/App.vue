<template>
  <hooper :settings="hooperSettings">
    <slide v-for="(n,index) of products" :key="n">
					<img :src="'/img/pogo/'+ (index) +'.jpg'" />
    </slide>
    <hooper-navigation slot="hooper-addons"></hooper-navigation>
    <hooper-pagination slot="hooper-addons"></hooper-pagination>
    <hooper-progress slot="hooper-addons"></hooper-progress>
  </hooper>
</template>

<script>
import {
  Hooper,
  Slide,
  Progress as HooperProgress,
  Pagination as HooperPagination,
  Navigation as HooperNavigation
} from 'hooper';

import 'hooper/dist/hooper.css';

export default {
  name: 'App',
  components: {
    Hooper,
    Slide,
    HooperProgress,
    HooperPagination,
    HooperNavigation
  },
  data() {
    return {
      products: 9,
      hooperSettings: {
        itemsToShow: 1,
        centerMode: true
      }
    };
  }
};
</script>

<style>
.hooper {
	height: 100%;
}
button.hooper-indicator {
	background-color: #000;
}
img {
	width:100%;
}
.hooper-next, .hooper-prev {
    background-color: #b8cfe03d;
}
.hooper-pagination {
    transform: none;
}
</style>
