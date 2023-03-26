---
title: "syui.ai | search"
type: search
page_image : "https://syui.ai/favicon.png"
description: "search"
---

<div id="app">
  <mysearchbtn :search.sync="search"></mysearchbtn>
  <p>Number of results: {{list.length}}</p>
  <mylist :list="list"></mylist>
</div>
<script src='https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.22/vue.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.5/lunr.min.js'></script><script  src="/search/script.js"></script>
