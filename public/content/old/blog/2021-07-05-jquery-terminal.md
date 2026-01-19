+++
date = "2021-07-05"
tags = ["jquery","terminal","hugo"]
title = "jquery.terminalで検索機能とか付けてみた"
slug = "jquery-terminal"
+++

追加した機能とかを簡単に紹介します。これくらい設定したら自分でも使うかも。こういうのは楽しければいいって思ってたんですが、まあまあ便利そうになってしまった気がする。

```sh
# 通常検索、contentから
$ search arch
or
$ / arch

# タグ検索、shellの<tab>補完も付けてみた(タグ補完
$ search -t <tab>hugo

# 最新記事
$ search -l

# user ipでloginします(promptをipに変えてるだけ
$ curl ipapi.co
```


```js:term.js
axios.get('https://syui.ai/index.json', { 'Content-Type': 'application/json' })
.then(function (response) {
	index_json = JSON.stringify(response.data,null,"\t");
	origin_index_json = JSON.parse(index_json);
	origin_index_json.forEach(function(v,index) {
			if ( tags.indexOf(v.tags) == -1) {
			tags.push(v.tags)};
			});
	tags = tags.join(',').split(',');
	tags = tags.filter(function (x, i, self) {
			return self.indexOf(x) === i;
			});
	})

var user_ip;
if (inputs[0] === 'curl' && inputs[1] === 'ipapi.co'){
$.ajaxSetup({async: false});
$.getJSON('https://ipapi.co/json/', function(data) {
		term.echo(JSON.stringify(data,null,"\t"));
		user_ip = JSON.stringify(data.ip,null,"\t").replace(/\"/g, '');
		});$.ajaxSetup({async: true});
this.set_prompt("[[b;#d33682;]" + user_ip + "]@[[b;#6c71c4;]syui.ai] ~$ ");
}

if (inputs[0] === 'search' && inputs[1] === '-l') {
	for (i = 0; i <= 5; i++) {
		s = origin_index_json[i].utc_time + '\n' + origin_index_json[i].title + ' ' + origin_index_json[i].href + '\n';
		term.echo(s);
	};
} else if (inputs[0] === 'search' && inputs[1] === '-t' && inputs[2] != undefined) {
	if (tags.indexOf(inputs[2]) != -1) {
		s = 'tag : https://syui.ai/tags/' + inputs[2];
		term.echo(s);
	} else {
		term.echo("none tag!");
	};
	origin_index_json.forEach(function(v,index) {
			if ( v.tags != null && v.tags.indexOf(inputs[2]) != -1) {
			term.echo(v.title + '\n' + v.href);
			} 
			});
}

// login
if (command == 'login'){
	term.login(function(user, password, callback) {
			if (user == 'root' && password == 'root') {
			callback('SECRET TOKEN');
			this.set_prompt("[[b;#d33682;]" + "root" + "]@[[b;#6c71c4;]syui.ai] ~# ");
			} else {
			callback(null);
			}
			});
	//} else if (term.token()) {
	//	term.echo("token");
}
```
