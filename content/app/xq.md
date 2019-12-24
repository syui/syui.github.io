+++
date = "2019-12-01"
title = "xq"
description = "| xmlをjsonに変換するツール"
+++

`xq`は、`xml`を`json`に変換します。ほしい要素を取り出します。

[Download](https://github.com/syui/xq/releases)

```sh
# https://github.com/syui/xq
$ go get -v -u github.com/syui/xq
$ xq -v
xq version 0.3.4

$ curl -sLO https://syui.cf/blog/index.xml

$ xq ./index.xml | jq .
```

```sh
$ xq l l ./index.xml
https://syui.cf/blog/post/2019/12/24/music/

$ xq p ./index.xml
Tue, 24 Dec 2019 00:00:00 +0000

$ xq u ./index.xml
Tue, 24 Dec 2019 00:00:00 +0000
```
