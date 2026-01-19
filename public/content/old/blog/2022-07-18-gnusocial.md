+++
date = "2022-07-18"
tags = ["gnu-social","heroku"]
title = "gnu-socialをherokuで立てる[2022年度版]"
slug = "gnusocial"
+++

gnu-socialも触ってみました。今回もherokuでdeployするヒントを書いていきたいと思います。

いろいろな変化があるものの、srcは相変わらず古い感じがします。

### 3.0

https://code.undefinedhackers.net/GNUsocial/gnu-social

- postgres + nginx

とりあえず、`bin/configure`にdockerfileを作成するscriptがありますので実行するようです。Makefileにいろんなコマンドが定義されているようですが、項目を読めばだいたい分かるでしょう。

```sh
$ git clone https://code.undefinedhackers.net/GNUsocial/gnu-social
$ cd gnu-social
$ ./bin/configure
$ make
$ sudo docker ps -a
```

```sh
$ paru -S php-pear
$ sudo pecl install vips
$ sudo vim /etc/php/php.ini
```

```sh
extension=iconv
extension=vips
```

以下を追記、または編集します。

```json:composer.json
"require": {
	"php": "^8.1.0",
	"ext-vips":"*",
	"jcupitt/vips": "1.0.9"
}
```

```sh
$ composer update --ignore-platform-reqs
$ git add composer.*
$ heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-apt
```

> Aptfile

```
php-pear
```

herokunの場合、残念ながら`php-vips`が[support](https://devcenter.heroku.com/ja/articles/php-support#using-optional-extensions)されていません。

したがって、buildpacksを自前で用意するしかないのですが、用意してやってみたところ、peclが動作しません。

いくつか調整してみたものの、これでは実現できたとしても完全にやるべきことではないと判断し、途中でやめることにしました。

```sh:bin/compile
sed -i -e "s#/usr/bin/php#/app/.heroku/php-min/bin/php#g" $build_dir/.apt/usr/bin/pecl
pecl install vips
```

```yml:heroku.yml
web: vendor/bin/heroku-php-nginx public/
```

ref : https://devcenter.heroku.com/ja/articles/php-support#using-optional-extensions

ref : https://devcenter.heroku.com/ja/articles/deploying-php

### 2.0

https://code.undefinedhackers.net/GNUsocial/gnu-social/src/branch/nightly

- mysql + apache

php7.4で動きますので、herokuのstack-20を使用します。これは簡単でそのまま通ります。

```sh
$ git checkout nightly
$ heroku stack:set heroku-20
```

ref : https://syui.ai/blog/post/2019/03/25/gnu-social
