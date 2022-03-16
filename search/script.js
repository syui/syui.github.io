Vue.component('mysearchbtn', {
  template:`<div>
    <input type="text" placeholder="type to search"
      v-model="search"
      @input="$emit('update:search', $event.target.value)" />
</div>`,
  props:['search']
})


Vue.component('mylist', {
  template:`<ul>
    <a v-for="item in list" :href="item.href"><li>{{item.title}}</li></a>
</ul>`,
  props:['list']
})


new Vue({
  el:'#app',
  data(){
    return{
       original:[],
       list:[],
       search:'',
       resuls:[],
       searchIndex:null
    }
  },
  mounted(){
    axios('/index.json')
       .then(data => {
          this.original = data.data
          this.list = this.original
          this.buildIndex()
      })
    
    this.$watch('search', () => {
      this.resuls = this.searchIndex.search(this.search)
      
      this.list = []
      this.resuls.forEach(d => {
        this.original.forEach(p => {
          if(d.ref == p.href) this.list.push(p)
        })
        
      })
    })
  },
  methods:{
    buildIndex(){
      var documents = this.original
      this.searchIndex = lunr(function () {
        this.ref('href')
        this.field('contents')
        this.field('title')
        this.field('tags')

        documents.forEach(doc => {
          this.add(doc)
        })
      })
    }
  }
})
