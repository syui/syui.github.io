+++
date = "2016-06-28"
tags =  ["pc"]
title = "amp-sample"
slug = "amp-sample"
+++

Google検索上でAMPコンテンツを表示するようにしてみました。

AMPとは、モバイルに最適化されたAMP用のHTMLを書くことで、Googleはそれを優先的に表示してくれるようです。

まずは、サンプルがあるので、そちらでページを作成し、自分のサイト用に修正していくことに。別ページで作成し、それを本サイトに結びつけるのが良いでしょう。

https://github.com/ampproject/amp-by-example

```bash
$ git clone https://github.com/YOUR_GITHUB_NAME/amp-by-example.git
$ cd amp-by-example
$ npm i
$ glup 
--------------
$ curl -sL localhost:8000
$ vim tasks/lib/Metadata.js
```

ソース(HTML)を読めば大体の形式がわかると思います。

日本語は、こちらの記事で分かりやすく解説されています。

https://ics.media/entry/12291

http://masup.net/2015/10/fits-amp-html.shtml
