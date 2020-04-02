---
title: "yui | MANGA"
type: manga
page_image : "https://syui.cf/icon/ai.png"
description: "惑星で暮らすドラゴンと少女の物語"
---

<script type="text/x-template" id="grid-template">
  <table>
    <thead>
      <tr>
        <th v-for="key in columns"
          @click="sortBy(key)"
          :class="{ active: sortKey == key }">
          {{ key | capitalize }}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filteredData">
        <td v-for="key in columns">
          {{entry[key]}}
        </td>
      </tr>
    </tbody>
  </table>
</script>

<div id="app">
	<transition name="slide">
		<img v-bind:src="'/manga/' + products[product] + '.png'"/> 
	</transition>
	<div class="image-button">
		<button id="next-manga" @click="nextSlide">&gt;</button> <button id="start-stop" @click="offTimer">{{ btnString }}</button>
	</div>
</div>

<!--
<div id="status">
  <demo-grid
    :data="gridData"
    :columns="gridColumns">
  </demo-grid>
</div>

<div id="demo">
  <form id="search">
    Search <input name="query" v-model="searchQuery">
  </form>
  <demo-grid :data="gridData" :columns="gridColumns" :filter-key="searchQuery"> </demo-grid>
  <demo-grid :data="gridData" :columns="gridColumns"> </demo-grid>
</div>
-->
<script type="text/javascript" src="build.js"></script></body>
