+++
date = "2019-12-08"
tags = ["hugo"]
title = "hugoのsyntax highlightを考えてみた"
slug = "highlight"
+++

今まで放置してたhugoの`syntax-highlight`を考えてみました。

ファイル名を表示し、プロンプト`$`をコピーしないように設定。

ファイル名はmarkdownのバッククオートで以下のようにすると使えるようにして

```sh
```sh:setup.sh
#!/bin/bash
```

あとコマンドプロンプトを示す`$`があると自動で`<span class="prompt">$ </span>`に置換。CSSで`user-select:none`を指定すると、コピー除外されます。styleを入れて強制しても良かったんですがそこはお好みで。

```sh
# https://github.com/syui/highlight-prompt.js
$ git clone https://git.syui.cf/syui/highlight-prompt.js
$ cd !$:t
$ cat highlight-prompt.js
```

```js:highlight-prompt.js
function highlight_prompt() {
    var list = document.body.getElementsByClassName("language-sh hljs bash");
    if ( list.length >= 1 ) {
    	for(i=0; i <= list.length-1; i++){
    	    var nodes = list[i].innerHTML;
    	    if (nodes.match(/\$ /)){
    	        t = nodes.replace(/^\$ /mg,"<span class='prompt'>$ </span>");
    	        document.getElementsByClassName("language-sh hljs bash")[i].innerHTML = '';
    	        document.getElementsByClassName("language-sh hljs bash")[i].insertAdjacentHTML('afterbegin', t);		
    	    };
    	};
    };
}
```

CSSはこんな感じ。フォントとかも良さげにしました。

```css
span.prompt {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
pre > code {
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace;
}
```
