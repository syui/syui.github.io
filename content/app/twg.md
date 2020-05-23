+++
date = "2019-12-01"
title = "twg"
description = "| goで書かれたtwitter client"
+++

`twg`は、goで書かれたシンプルなtwitter clientです。

[Download](https://github.com/syui/twg/releases)

```sh
# https://github.com/syui/twg
$ go get -u -v gitlab.com/syui/twg
or
$ yay -S twg
```

### 使い方

`releases`からダウンロードするか、AURからインストールして使います。

`releases`版でないと`client_id`などが入っていないため、自身で用意する必要があります。

最初に、`twg`を起動して、URLをブラウザで開き、アプリを承認します。表示されたcodeを貼り付けます。`-> oauth`

```sh
# If authentication does not exist, open the browser.
$ twg
authorization code : xxxx
```

`oauth認証`が終わると、以下のコマンドが使用できます。

```sh
# timeline
$ twg

# help
$ twg h

# post
$ twg p "send tweet"

# user timeline
$ twg u syui__
$ twg u

# stream
$ twg s

# oauth
$ twg o

# search
$ twg / "#twitter" 2
```
