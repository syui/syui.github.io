+++
date = "2018-07-29"
tags = ["docker","pleroma"]
title = "dockerでpleromaを起動してみる"
slug = "docker-pleroma"
+++

## 導入

分散型SNSの一つに`pleroma`というものがあります。分散型SNSというのは、`GNU Social(PHP)`, `Mastodon(Ruby)`のようなものです。

`pleroma`は、ElixirのPhoenixというフレームワークで書かれたWebアプリ...と言っていいか分かりませんが、そんな感じのものです。

ご存知の通り、ElixirのPhoneixは非常にレスポンスと言うか、自動更新周りの処理がエコでして、`pleroma`も非常に軽い感じで動作します。

メモリとかGNU SosicalやMastodonと比べて段違いに少なくて済むのでは。

ことPaaSとかSaaSとか、他のものに`pleroma`を置くにしても、最近は、dockerやk8sなどのコンテナを利用する可能性が高く、メモリは以前に増して少量であることが重要な要素の一つだと思います。

GCPとかBluemixとかHerokuとかOpenShiftとか、無料もしくは格安プランで動かす場合、1GB制限とかそういうの多いんですよ。

ということで、今回はとりあえず`pleroma`をdockerで動かしてみたいなーと思いたって、適当にやってみました。

## docker:pleroma

[github.com/ht164/pleroma-docker-compose](https://github.com/ht164/pleroma-docker-compose)

検索したらこういうものがアップされていました。`docker-compose`で上げられてるの、非常にありがたい!

```sh
$ git clone https://github.com/ht164/pleroma-docker-compose
$ mkdir -p web/pleroma && cd web/pleroma
$ git clone https://git.pleroma.social/pleroma/pleroma.git .
```

大抵、仕組みは公式wikiを見れば分かると思いますが、まずはdockerで触っていきましょう。

[https://git.pleroma.social/pleroma/pleroma/wikis/home](https://git.pleroma.social/pleroma/pleroma/wikis/home)

> ./pleroma-docker-compose/web/pleroma

```sh
$ vim config/dev.secret.exs
# Pleroma.Repoを書き換えます
config :pleroma, Pleroma.Repo,
	adapter: Ecto.Adapters.Postgres,
	username: "pleroma",
	password: "pleroma",
	database: "pleroma_dev",
	hostname: "db",
	pool_size: 10
$ mkdir -p web/uploads && mkdir -p db/postgres

$ cd ../..
# ./pleroma-docker-compose
$ docker-compose build
$ docker-compose up -d
$ docker ps
	12345678        pleroma/pleroma       pleroma-docker-compose_web_1
$ docker exec -it 12345678 /bin/sh
	> $ mix ecto.create && mix ecto.migrate
	> $ exit
$ open -a Google\ Chrome "http://localhost:4000"
```

![](https://raw.githubusercontent.com/syui/img/master/old/pleroma-docker-up.png)

ここまでできたら、あとは、`pleroma`の仕組みを見ていくだけですね。

`pleroma`は単純にWebからのリクエストを受け、必要に応じてその内容をDBに保存します。今回使用したDBは`postgres`です。登録されたユーザー情報などもすべてこのDBに保存されます。

`phoenix`の仕組みとしては、`config/`以下の設定ファイルにてDBへのアクセスやサーバー設定を行います。どの順番に読み込まれるか、もしくは読まれないかを注意してください。`config/config.exs`の順に読み込まれ、最後の行の`import_config "#{Mix.env()}.exs"`の記述がそれに当たります。そして、DBへのアクセスに必要な情報等は、`.secret.exs`に記述することが通常です。また、実際運用する際は、`Ecto.Adapters.Postgres`は変更する必要が出てきますね。

Webアプリの起動そのものは`$ mix phx.server`で、必要なもののインストール等は`$ mix deps.get`だったと思います。で、DBとの連携は`$ mix ecto.create && mix ecto.migrate`あたり。

場合によっては、`phoenix`の情報が必要になるので、公式ページを参照します。

[https://hexdocs.pm/phoenix/Phoenix.html](https://hexdocs.pm/phoenix/Phoenix.html)

さて、今度はユーザー情報をDBに追加していきましょう。管理者なので(一人インスタンスの場合、そもそもWebからの登録は不要)、以下のようなコマンドを実行すればいいですよ。

```sh
# まずpleromaのweb serverにshでアクセス
$ docker exec -it 12345678 /bin/sh

# 次にDB更新等
$ mix ecto.create && mix ecto.migrate

# ユーザーの追加
$ mix register_user <name> <nickname> <email> <bio> <password>

# Webから先程登録した情報でログイン
$ open -a Google\ Chrome "http://localhost:4000"
```

![](https://raw.githubusercontent.com/syui/img/master/old/pleroma-docker-user.png)

いけました。こんな感じで。

実際、これを一から運用するとなると、かなり大変です。Webサーバーにするサーバーをレンタルし、DBにするストレージ等を契約して(ユーザーを持つ場合、画像等により年々、容量が増え続けるので、このあたりは特によく考えないといけない。AWS等は相当安いらしいけど)、次にドメインを借りて、SSL証明書等(サーバー管理者ならLet's Encryptを利用できる)を取得、Webサーバーに設定して、サイトにアクセスできるようにしなければなりません。

反対に、これをPaaS等が提供するコンテナ技術を利用すると、結構楽だと思います。

ただ、だいぶ昔にHeroku Dockerでやった時は、なぜか上手く行かなかったんですよね。正直、よくわかんなかった。バグっぽいなと思ったけど、こちらの手違いがあったかもしれない。ちなみに、設定等は、ちゃんとやったつもりですけど、DBはherokuが用意するawsの認証情報とかに変更したりしたし(ここが特に重要だと思われます)。でも、phoenix serverが何故か起動しなかったんですよね。よくわからんかった。

以上
