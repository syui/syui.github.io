import Vue from 'vue'
import axios from 'axios'

Vue.component('demo-grid', {
	template: '#grid-template',
	props: {
		data: Array,
		columns: Array,
		filterKey: String
	},
	data: function () {
		var sortOrders = {}
		this.columns.forEach(function (key) {
			sortOrders[key] = 1
		})
		return {
			sortKey: '',
			sortOrders: sortOrders
		}
	},
	computed: {
		filteredData: function () {
			var sortKey = this.sortKey
			var filterKey = this.filterKey && this.filterKey.toLowerCase()
			var order = this.sortOrders[sortKey] || 1
			var data = this.data
			if (filterKey) {
				data = data.filter(function (row) {
					return Object.keys(row).some(function (key) {
						return String(row[key]).toLowerCase().indexOf(filterKey) > -1
					})
				})
			}
			if (sortKey) {
				data = data.slice().sort(function (a, b) {
					a = a[sortKey]
					b = b[sortKey]
					return (a === b ? 0 : a > b ? 1 : -1) * order
				})
			}
			return data
		}
	},
	filters: {
		capitalize: function (str) {
			return str.charAt(0).toUpperCase() + str.slice(1)
		}
	},
	methods: {
		sortBy: function (key) {
			this.sortKey = key
			this.sortOrders[key] = this.sortOrders[key] * -1
		}
	}
})

var demo = new Vue({
	el: '#demo',
	data: {
		searchQuery: '',
		gridColumns: ['dex','name','maxCP','lang'],
		gridData: []
	},
	beforeCreate: function () {
		axios.get('https://raw.githubusercontent.com/syui/syui.github.io/src/static/json/pokemongo.json')
			.then(function (response) {
				demo.gridData = response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	}
});

var status = new Vue({
	el: '#status',
	data: {
		gridColumns: ['name','team','xp','get','zukan'],
		gridData: []
	},
	beforeCreate: function () {
		axios.get('https://raw.githubusercontent.com/syui/syui.github.io/src/static/json/pokemongo-status.json')
			.then(function (response) {
				status.gridData = response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	}
});

var app = new Vue({
  el: '#app',
  data: {
    product: 0,
    products: [...Array(7).keys()],
    timer: 1
  },
  computed: {
    btnString: function() {
      return this.timer === null ? "▶" : "■";
    }
  },
  mounted: function() {
    //this.onTimer();
  },
  methods: {
    nextSlide: function() {
      this.product = this.product < this.products.length - 1 ? this.product += 1 : 0;
    },
    onTimer: function () {
      this.timer = setInterval(() => {
        this.nextSlide();
      }, 1000)
    },
    offTimer: function () {
      if(this.timer === null) {
        this.onTimer();
      } else {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
    
  }
});
