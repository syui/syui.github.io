+++
date = "2019-12-01"
title = "xq"
description = "| xmlをjsonに変換するツール"
+++

`xq`は、`index.xml`を`json`に変換します。ほしい要素を取り出します。

[Download](https://github.com/syui/xq/releases)

```sh
# https://github.com/syui/xq/releases
$ go get -v gitlab.com/syui/xq

$ curl -sLO syui.cf/index.xml
$ xq i ./index.xml
{"title":"芝をどこまで続けられるか","link":"https://syui.cf/blog/post/2016/06/08/blog/","update":"","publish":"Wed, 08 Jun 2016 00:00:00 +0000"}
{"title":"新しくメモプラグインを作成した","link":"https://syui.cf/blog/post/2016/06/07/m/","update":"","publish":"Tue, 07 Jun 2016 00:00:00 +0000"}
{"title":"移転","link":"https://syui.cf/blog/post/2016/06/07/start/","update":"","publish":"Tue, 07 Jun 2016 00:00:00 +0000"}
```


