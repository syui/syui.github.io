+++
date = "2019-12-01"
title = "medigo"
description = "| mediumの投稿や編集するアプリ"
+++

`medigo`は、goで書かれたシンプルなmedium clientです。記事をポストしたり、編集できます。

> 現在、medium apiが一般公開されなくなったことにより動作しません

[Download](https://github.com/syui/medigo/releases)

```sh
# https://github.com/syui/medigo
$ go get -u -v github.com/syui/medigo
or
$ yay -S medigo
```

### 使い方

`releases`からダウンロードするか、AURからインストールして使います。

`releases`版でないと`client_id`などが入っていないため、自身で用意する必要があります。

最初に、`medigo`を起動して、URLをブラウザで開き、アプリを承認します。表示されたcodeを貼り付けます。`-> oauth`

```sh
# If authentication does not exist, open the browser.
$ medigo
authorization code : xxxx
```

`oauth認証`が終わると、以下のコマンドが使用できます。

```sh
$ medigo h

$ medigo u
```

