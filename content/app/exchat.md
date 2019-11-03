+++
date = "2019-12-01"
title = "exchat"
description = "| herokuで立てられるchatアプリ"
+++

[exchat](https://github.com/tony612/exchat)は、elixir, reduxで構成されたchatアプリ。ただし、メンテナンスされておらず、pull-reqを送っても反応がないので、forkしてメンテナンスしています。

https://github.com/syui/exchat

```sh
$ git clone https://github.com/syui/exchat
$ cd exchat
$ mix deps.get
$ mix ecto.create && mix ecto.migrate
$ npm install .
$ mix phoenix.server
```

基本的には、`./config`以下にある環境変数をherokuに入れて、pushすると動くと思います。

## 解説記事

http://syui.github.io/blog/post/2018/08/25/webpack

https://qiita.com/syui/items/2e1bb571e9d50608809e

