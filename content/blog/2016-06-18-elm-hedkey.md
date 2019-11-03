+++
date = "2016-06-18"
tags =  ["memo"]
title = "Pantheonにホスト、デプロイする場合は初期設定は必要ありません"
slug = "elm-hedkey"
+++

[Elm](http://elm-lang.org/)で書かれたテンプレートで認証ページを作成し、バックエンドに[Pantheon](pantheon.io)上に構築した[Drupal](https://www.drupal.org/)を使いました。

Demo:

https://syui.github.io/elm-hedley

その際に、[Behat](https://github.com/Behat/Behat)と[Drush](http://www.drush.org/en/master/), [Treminus](https://pantheon.io/docs/terminus/), [Composer](https://getcomposer.org/)などに触れました。

しかし、そのままでは動きません。なぜなら、`Pantheon`で公開するには独自の`Drupal`設定が必要だからです。

以下、問題解決に必要だった情報を示します。

今回、ほとんどはCLIからの操作では問題は解決しませんでした。したがって、基本的には`Pantheon`, `Drupal`の管理画面にてエラーを見て、修正していきます。

## Pantheonにホスト、デプロイする場合は初期設定は必要ありません

Pantheonにホスト、デプロイする場合は初期設定は必要ありません。いくら`config.sh`で設定してもそのままでは有効にならないし、ユーザー設定はブラウザの`Pantheon -> Drupal`管理画面から行うことになるからです。

```bash
$ cp default.config.sh config.sh
$ ./install
$ cd www
$ git init
$ ...git push
```

remoteを設定するの自体が面倒なので、`Connection Info`のclone情報をコピーし、`.git`を`www/.git`に置くと良いでしょう。


``` bash
$ git clone ssh://foo.git
$ cp -rf foo/.git www/
$ cd www
$ git add .
$ git commit -m f
$ git push
```



## Pantheonの仕組みを簡単に

DBを含んだCMSなどをホストできます。開発は`NAME.{dev,test,live}`という3つのURLが用意され、順にデプロイしていくことで安定を目指します。

サーバーは、`dev, test, live`ごとに`Git, SFTP, SSH`が用意されており、必要な情報は管理画面にて表示されます。

本来は`live`で開発は`dev`と使い分けます。

ただ、面倒な場合(使う人が少ない場合)は、すべて`dev`で開発、公開してもよいでしょう。

ここで、特に必要な情報は、`Drupal`の初期設定にて必要になるDBの認証情報です。具体的には以下。Pantheon, Drupal(MYSQL)で多少項目名が異なりますが、ある程度推測してください。DBは`MYSQL`を使います。

```bash
Database
	Host
	Username
	Password
	Port
	DB Name
```

## Pantheonのモジュールがないと言われる

```bash
# https://github.com/pantheon-systems/drops-7/tree/master/modules/pantheon
$ cp -rf drops-7/modules/pantheon www/modules/
$ ...git push
```

モジュールはブラウザの管理画面にて有効にしたり、アップデートしたりします。

## Drupal Coreが無効のCoreで上書きされたと言われる

```bash
$ cp -rf drops-7/* www/
$ ...git push
```

## Settings.phpが読めないと言われる

管理画面から`Git -> SFTP`に変更し、サーバーにアクセスします。

```bash
$ sftp ...
> chmod 644 code/sites/default/settings.php
> quit
```

## なぜかGitHub Pagesからの認証後にロードされたままページが表示されない

とりあえず、管理画面にて重要な警告(赤)をすべて修正した後に、`Drupal`でログインした後、Publicのコンテンツを作成する。これは必要なかったかもしれませんが、自分の場合はコンテンツを作成したら行けたような気がします。

## それぞれのコマンド操作

~~~bash
# エイリアスを有効にする
$ terminus sites aliases
$ drush sa

# ステータスの確認
$ drush @pantheon.NAME.dev st

# アップデートする
$ drush @pantheon.NAME.dev up

# アクセスする(ただし、これにはDrupalの初期設定を終えている必要がある)
$ drush @pantheon.NAME.dev uli
~~~


## GitHub OAuth

今回、GitHubログインは用意していません。確認も面倒なので。やりたい人は、こっちを使うと出来ます。あと、GitHubの管理画面(App OAuth)から認証情報を発行し、Client IDなどを取得。

https://github.com/Gizra/hedley-server/tree/master/hedley/modules/custom/hedley_github

https://github.com/Gizra/hedley-server/blob/master/default.config.sh#L75-L77

## 最後に

初めて使うものばかりだったので、構成の把握にだいぶ時間がかかってしまいました。

私のような初心者がパソコンで何かしようとすると、何かしらハマったりします。
