---
title: "help"
date: "2021-09-19"
---

[syui.cf](/)は、このサイト(ブログ)のタイトルです。

このサイトには、いくつかの隠し機能があります。

今回はそれらを使って、このサイトを便利に閲覧しちゃおうという内容です。

といっても、ほとんどが遊び機能です。

> 環境 : `safari`, `chrome`
> 
> 動作するには`cookie`, `javascript`をenableに、`adblock`などpluginをdisableにする必要があるかもしれません

### j, kで移動

ブログ記事へのリンク間を`shift + j`, `shift + k`で移動できるようになっています。

shiftを選択している理由は、このような設定はkeybindを奪うことにもなり、不便が生じるかもしれないので、あまり使われなさそうなshiftにしています。

![](https://raw.githubusercontent.com/syui/img/master/other/hugo_20210918_141757.png)

### terminalの呼び出し

`ctrl + enter`でterminalを呼び出すことができます。主に当サイトのrootである`/`と2階層目くらいまでは呼び出せるようなってることが多いかな。

このterminalにより、サイト上の色々な機能にアクセスしやすくなってます。

現在使える便利機能をいくつか紹介します。

![](https://raw.githubusercontent.com/syui/img/master/other/hugo_20210918_141637.png)

> ただし、個別記事である`/blog/foo`上ではterminalは呼び出せず、代わりに`/blog`に移動するようになっています。`/blog`からは従来通りterminalを呼び出すことができます。

### / コマンドで個別記事に飛ぶ

```sh
$ /
```

`/`コマンドを使うと最新記事の中から個別記事に飛ぶことができます。飛びたい番号を入力します。

![](https://raw.githubusercontent.com/syui/img/master/other/hugo_20210918_141530.png)

### search コマンドでタグを検索する

```sh
$ search -t hugo
```

`search -t $tag`でタグを検索することができます。オプションなしだと通常検索です。補完機能があるので`<tab>`でタグ補完できます。

![](https://raw.githubusercontent.com/syui/img/master/other/hugo_20210918_141702.png)

### login コマンドで自分の名前を表示する

```sh
$ login
login : test
password : test
```

適当な遊びコマンドですが、自分の`username`と`ip address`をこのサイト上に表示することができます。ちなみに、個人情報がこのサイトの管理人に送信されることはありません。あと、`password`は何でもいいです。

また、遊びの一環として`root login`に挑戦してみるのも面白いかもしれません。ちゃんと`password`が設定されてますので、ぜひ、突破してみてください。

![](https://raw.githubusercontent.com/syui/img/master/other/hugo_20210918_141510.png)

### api コマンドで api.syui.cf の api を使う

```sh
$ api 1
```

[/api](/api)

### その他

その他にもコマンドがいくつかあります。是非、遊んでみてください。

