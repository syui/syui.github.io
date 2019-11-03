+++
date = "2019-12-01"
title = "mstdn.zsh"
description = "| zshでmastodon-apiをサポートします"
+++

`mstdn.zsh`は、zshで書かれたコマンドツールです。[mastodon api](https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md)をサポートします。

[Download](https://github.com/syui/mstdn.zsh)

`curl`や[jq](https://stedolan.github.io/jq/), [peco](https://github.com/peco/peco)などが必要になる場合があります。

使い方は、`json/user.json`にアプリ認証情報を置いて、`$ mstdn.zsh a`コマンドを実行します。

```sh
$ git clone https://github.com/syui/mstdn.zsh
$ cd mstdn.zsh
$ chmod +x mstdn.zsh
$ ./mstdn.zsh a
```

```json:./json/user.json
{
	"host" : "xxxx",
	"app" : "xxxx",
	"select_command" : "fzf"
}
```

```sh
# 投稿
$ mstdn.zsh p -f "test."

# タイムライン
$ mstdn.zsh t

# ユーザー情報
$ mstdn.zsh s
```
