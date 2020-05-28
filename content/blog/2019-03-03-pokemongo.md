+++
date = "2019-03-03"
tags = ["pokemon"]
title = "Pokemon Goの進捗"
slug = "pokemon"
+++


そういえば、CPの計算式が変更になったそうで、以前、作ったjsonが役に立たなくなったので、再度作ったりした。

```bash
$ mkdir output
# https://github.com/pokemongo-dev-contrib/pokemongo-json-pokedex
$ sudo docker run -v "$(pwd)/output:/var/lib/pokemongo-json-pokedex/output" brunnerlivio/pokemongo-json-pokedex:latest
```

```

#!/bin/zsh

d=${0:a:h}
url=https://www.pokemon.jp/zukan/detail
j_npm=$d/pokemongo-json-pokedex.json
j_out=$d/pokemon_tmp.json
n=`cat $j_npm|jq length`
for (( i=0;i<=$n;i++ ))
do

	dex=`cat $j_npm|jq -r ".[$i].dex"`
	id=`printf %03d ${dex}`
	name_jp=`curl -sL $url/${id}.html|grep -o '<title>.*</title>' | sed 's#<title>\(.*\)</title>#\1#'|cut -d '｜' -f 1`
	echo $name_jp
	cat $j_npm|jq ".[$i]|= .+{\"lang\":{\"jp\": \"${name_jp}\"}}" >! $j_out
	cp -rf $j_out $j_npm
done
```

日本語の名前がなかったので追加した。

あとは、vue.jsとかでuploadしたjsonを読み込み必要な項目を表示。

```
var demo = new Vue({
	el: '#demo',
	data: {
		searchQuery: '',
		gridColumns: ['dex','name','maxCP','lang'],
		gridData: []
	},
	beforeCreate: function () {
		axios.get('https://syui.gitlab.io/pokemon-zukan/json/pokemon.json')
			.then(function (response) {
				demo.gridData = response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	}
});
```

```
<div id="demo">
  <demo-grid :data="gridData" :columns="gridColumns"> </demo-grid>
</div>
```

ということで、最近の進捗。Gen4の伝説が増えてきてうれしい。

![](https://raw.githubusercontent.com/mba-hack/images/master/pokemongo_2019_03_03_s01.png)

![](https://raw.githubusercontent.com/mba-hack/images/master/pokemongo_2019_03_03_s02.png)

