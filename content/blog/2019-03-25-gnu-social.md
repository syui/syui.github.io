+++
date = "2019-03-25"
tags = ["gnu-social"]
title = "herokuでgnu-socialを立てるときにハマった話"
slug = "gnu-social"
+++

```sh
$ git clone https://git.gnu.io/dansup/gnu-social
$ cd !$:t
$ git checkout composer-autoloading

$ php -v
7.3

$ vim composer.json
{
  "require": {
    "ext-pgsql": "*",
    "ext-gd": "*",
    "ext-intl": "*",
    "php": "^7.3.0",
    "illuminate/contracts": "*",
    "illuminate/support": "*",
    "ramsey/uuid": "^3.0",
    "ezyang/htmlpurifier": "^4.10",
    "psy/psysh": "^0.8.17"
  }

$ composer update

$ heroku create $APP_NAME
$ heroku buildpacks:add https://github.com/heroku/heroku-buildpack-php -a $APP_NAME
$ heroku addons:add cleardb:ignite -a $APP_NAME
$ heroku config -a $APP_NAME

$ vim Profile
web: vendor/bin/heroku-php-apache2

$ heroku git:remote -a $APP_NAME
$ git add .
$ git commit -m "first"
$ git push heroku master

# 次に、dockerを使って、DBにアクセスする。ついでに、そこで作成されたconfig.phpを取得する、config.phpの位置情報を適切に保存するため、これはdockerから実行するのが望ましい
$ open -a Docker
$ sudo docker run -p 8000:80 rudism/gnu-social /root/start
$ open -a Google\ Chrome http://localhost:8000/install.php

# ブラウザでの/install.phpの設定は、以下の値を参考に設定する
# `/install.php`をhttpで実行する必要がある。
# DBなどの情報をheroku addonsのcleardbに入れる
# example : mysql://A:B@example.com/C
# optionである?,=,trueとかの末尾の部分はいらない
# 	host : example.com
# 	DB name : C
# 	user : A
# 	password : B
# $config['site']['path'] = false; 
# $config['site']['ssl'] = 'never'; 
# $config['site']['fancy'] = false;

# 初期設定が完了したらlocalhost:8000で一度、/index.php/well-known/host-metaを確認して、投稿し、/index.php/well-known/webfinger?resourece=acct:user@localhost:8000を確認しておくといいかも

# config.phpを取得する
$ sudo docker cp `sudo docker ps -q`:/var/www/gnu-social/config.php .

# config.phpを編集する
$ vim config.php
- $config['site']['server'] = 'localhost:8000';
+ $config['site']['server'] = 'APP_NAME.herokuapp.cf';
# ついでにこちらの設定を追加しても良い、好みによる
+ $config['site']['path'] = false; 
+ $config['site']['ssl'] = 'never'; 
+ $config['site']['fancy'] = false;

# config.phpをherokuにdeployする
# .gitignoreに注意してください
$ git add config.php
$ git commit -m "add config"
$ git push heroku master

# DBをdumpして編集して、restoreする、profile domainがlocalhostになっているため、本来のdomainにしたあと、restoreする
# 一応、heroku-mysql dashboardでもbackupを作成してdlしておく
$ mysql --host=$HOST --user=$USER_NAME --password=$PASSWORD $DB_NAME
mysql > select * from user;
$ mysqldump --host=$HOST $DB_NAME --user=$USER_NAME --password=$PASSWORD >! dump.sql
$ vim dump.sql # localhost -> example.com
$ mysql --host=$HOST --user=$USER_NAME --password=$PASSWORD $DB_NAME < dump.sql

# apache_conf.appでも何でもいいので、それらを使って./well-knownあたりの設定を行う、heroku webでは権限上アクセスできなかったりした
# ./well-known/以下はwebfingerにとって重要で、これがインスタンス間のやり取りを行う上で必要な情報になる
$ vim .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule (.*) index.php/$1 [L,QSA]
</IfModule>
<FilesMatch "\.(ini)">
        Require all denied
</FilesMatch>
<FilesMatch ".well-known/*">
    Require all granted
</FilesMatch>
```


では、なぜ、Dockerを使って/install.phpを実行したあと、config.phpを取得する必要があるのでしょう。

一つは、config.phpの内容です。これは、lib/installer.phpを見れば大体の推測が可能です。しかし、二つ目の理由が重要で、config.phpの保存場所の指定にあります。/install.phpを実行後、config.phpが書き込まれますが、保存場所はDBに送られます。これは、実行したサーバーの状況に応じてのことですが、herokuの場合は、/app以下でしょうか。しかし、herokuの場合、web serverに保存されたファイルはリセットされてしまいます。したがって、まずはconfig.phpの位置情報をDB内に指定させたあとに、その/config.phpをpushしなければなりません。

また、dockerからの/install.phpでないと、./well-known(webfinger)が動作しないことを確認しました。これが動作しないと、mastodonとのやり取りができません。

```sh
# URLはindex.phpが必要かも -> /index.php/.well-known/xxx
$ curl https://gnu-social.herokuapp.com/.well-known/host-meta
$ curl "https://gnu-social.herokuapp.com/.well-known/webfinger?resource=acct:syui@gnu-social.herokuapp.com"
```

もし失敗した場合は、DBを消してから、再度、作り直します。

```sh
$ heroku addons:remove cleardb -a $APP_NAME --confirm $APP_NAME
$ heroku addons:add cleardb:ignite -a $APP_NAME
$ heroku config -a $APP_NAME
```


## その他の情報

### config.php

herokuのmysqlが調子が悪いので、よくアクセスできなくなる。DBの問題であって、gnu-socialの問題ではない。

/install.phpを実行したあとなら、以下の設定も有効にできます。

> config.php

```sh
//$config['site']['ssl'] = 'never'; 
$config['site']['ssl'] = 'always';
$config['site']['sslproxy'] = true; 
$config['site']['fancy'] = true;
```


### /.well-known = 403

使用したRepositoryには、`socialfy-another-domain`があり、設定ファイルがおいてあります。mastodonとかでもお馴染みのあれですが、gnu-socialにもおいておきましょう。

https://git.gnu.io/dansup/gnu-social/blob/composer-autoloading/socialfy-another-domain/README.txt

しかし、heroku + nginxでは、/.well-known以下が403になります。

これは、heroku nginx_app.confの設定でアクセスできます。

```php
location ^~ /.well-known/ {
    allow all;
}
```

https://github.com/heroku/heroku-buildpack-php/issues/218

自分の場合は、以下のような感じ。 (nginxでrewriteを設定してない場合)

```sh
$ curl -H "Accept: application/xrd+xml" "https://gnu-social.herokuapp.com/.well-known/webfinger/index.php?resource=acct:syui@gnu-social.herokuapp.com"

# この設定でindex.phpを除けます
$ vim nginx_app.conf
location ^~ /.well-known/webfinger {
    rewrite ^(.*)$ /.well-known/webfinger/index.php$1 last;
    try_files @heroku-fcgi @heroku-fcgi;
    allow all;
}

# host-meta : "https://gnu-social.herokuapp.com/.well-known/webfinger?resource={uri}"

$ curl -H "Accept: application/xrd+xml" "https://gnu-social.herokuapp.com/.well-known/webfinger?resource=acct:syui@gnu-social.herokuapp.com"
```

### pleroma-fe

Download : https://git.pleroma.social/pleroma/pleroma-fe/pipelines

Downloadして、dist/index.htmlをdist/pleroma.htmlにrenameしたあとにrootに置く。そして、/pleroma.htmlからアクセスする

### qvitter

```sh
$ cd plugin/
$ git clone https://git.gnu.io/h2p/Qvitter
$ cd !$:t
$ rm -rf .git
$ vim config.php
addPlugin('Qvitter');
$ php scripts/checkschema.php
```

### activtypub

```sh
$ cd plugin/
$ git clone https://git.gnu.io/dansup/ActivityPub
$ cd !$:t
$ git checkout dev
$ composer up
$ rm -rf .git
$ vim config.php
addPlugin('ActivityPub');
$ php scripts/checkschema.php
```

### plugin

> config.php 

おそらくデフォルトで有効になっているが、一応

```sh
addPlugin('OStatus');
addPlugin('WebFinger');
addPlugin('LRDD');

addPlugin('Activity');
addPlugin('ActivitySpam');
addPlugin('ActivityVerb');
addPlugin('ActivityVerbPost');
addPlugin('ActivityModeration');
```

### attachments

`admin -> paths -> attachments -> path,dir`を空にして保存すると、web UIがうまく動作しなくなる。

```sh
$ php scripts/checkschema.php
```

> PHP Warning:  mkdir(): Permission denied, Could not create directory for 'thumbnail': '/thumb'

`gnu-social/lib/gnusocial.php`の`/thumb`を`/app/static`とかにして、`php scripts/checkschema.php`を実行。


`config.php`に`$config['thumbnail']['dir'] = "/app/static";`を追加することで治った。

しかし、DBに保存された値によって、以降も`php scripts/checkschema.php`が失敗してしまう。

> lib/gnusocial.php

```sh
- if (!mkdir($dir)) {
-                throw new ConfigException('Could not create directory for '._ve($description).': '._ve($dir));
-            }
-            if (!chmod($dir, 0775)) {
-                common_log(LOG_WARNING, 'Could not chmod 0775 on directory for '._ve($description).': '._ve($dir));
-            }
```

herokuは、mkdirでディレクトリを作れない、作ったとしてもリセットされて消えてしまう。

https://github.com/foocorp/gnu-social/blob/master/INSTALL


### mysql

herokuのmysqlにアクセス。

```sh
$ mysql --host=$HOST --user=$USER_NAME --password=$PASSWORD --reconnect $DB_NAME
```


### webfinger:user.json

通常、webfingerが出力するのは、xmlじゃなくjsonっぽい気がしているので、jsonにしたあとに、webfinger/index.phpを編集する。

user fileをjsonにして使うと、mastodonではnokogiriがerrorを吐く。

> Nokogiri::XML::XPath::SyntaxError: ERROR: Undefined namespace prefix: //xmlns:Subject

```php
$f = $u . ".xml";
//$f = $u . ".json";

if (file_exists($f)) {
  header('Content-Disposition: attachment; filename="'.urlencode($f).'"');
  header('Content-type: application/xrd+xml');
  //header('Content-type: application/json');
  echo file_get_contents($f);
}
```

```json
{
  "subject": "acct:syui@gnu-social.herokuapp.com",
  "aliases": [
    "https://gnu-social.herokuapp.com/syui",
    "https://gnu-social.herokuapp.com/user/2",
    "https://gnu-social.herokuapp.com/index.php/user/2",
    "https://gnu-social.herokuapp.com/index.php/syui"
  ],
  "links": [
    {
      "rel": "http://webfinger.net/rel/profile-page",
      "type": "text/html",
      "href": "https://gnu-social.herokuapp.com/syui"
    },
    {
      "rel": "http://gmpg.org/xfn/11",
      "type": "text/html",
      "href": "https://gnu-social.herokuapp.com/syui"
    },
    {
      "rel": "describedby",
      "type": "application/rdf+xml",
      "href": "https://gnu-social.herokuapp.com/syui/foaf"
    },
    {
      "rel": "http://apinamespace.org/atom",
      "type": "application/atomsvc+xml",
      "href": "https://gnu-social.herokuapp.com/api/statusnet/app/service/syui.xml"
    },
    {
      "rel": "http://schemas.google.com/g/2010#updates-from",
      "type": "application/atom+xml",
      "href": "https://gnu-social.herokuapp.com/api/statuses/user_timeline/2.atom"
    },
    {
      "rel": "salmon",
      "href": "https://gnu-social.herokuapp.com/main/salmon/user/2"
    },
    {
      "rel": "http://salmon-protocol.org/ns/salmon-replies",
      "href": "https://gnu-social.herokuapp.com/main/salmon/user/2"
    },
    {
      "rel": "http://salmon-protocol.org/ns/salmon-mention",
      "href": "https://gnu-social.herokuapp.com/main/salmon/user/2"
    },
    {
      "rel": "http://ostatus.org/schema/1.0/subscribe",
      "template": "https://gnu-social.herokuapp.com/main/ostatussub?profile={uri}"
    },
    {
      "rel": "http://specs.openid.net/auth/2.0/provider",
      "href": "https://gnu-social.herokuapp.com/syui"
    }
  ]
}
```


### webfinger : acct:user@social.example.com

他のgnu-socialインスタンスを見ていると、どうやらwebfingerは、以下のような形でjsonを生成しているらしい。

> ./well-known/host-meta

```json
{
  "links": [
    {
      "rel": "lrdd",
      "type": "application/jrd+json",
      "template": "https://social.example.com/.well-known/webfinger?resource={uri}"
    },
    {
      "rel": "lrdd",
      "type": "application/json",
      "template": "https://social.example.com/.well-known/webfinger?resource={uri}"
    },
    {
      "rel": "lrdd",
      "type": "application/xrd+xml",
      "template": "https://social.example.com/.well-known/webfinger?resource={uri}"
    },
    {
      "rel": "http://apinamespace.org/oauth/access_token",
      "href": "https://social.example.com/api/oauth/access_token"
    },
    {
      "rel": "http://apinamespace.org/oauth/request_token",
      "href": "https://social.example.com/api/oauth/request_token"
    },
    {
      "rel": "http://apinamespace.org/oauth/authorize",
      "href": "https://social.example.com/api/oauth/authorize"
    }
  ]
}
```

> /.well-known/webfinger?resource={uri}

ここで気になるのが、public-keyで、おそらくDBにはsecret-keyが保存されていて、これが個人認証に使われているのだと思われる。heroku上で実行するwebfingerは動いていない気がするので、この処理を行うのは難しい。どうすればこの問題を回避できるのかわからない。dockerからwebfingerによって作成される`./well-known`を持ってくるといいかもしれない。

```json
    {
      "rel": "magic-public-key",
      "href": "data:application/magic-public-key,${magic-public-key}"
    },
    {
      "rel": "diaspora-public-key",
      "type": "RSA",
      "href": "${diaspora-public-key}"
    }
```

pleromaからメンションを送ってみたが、一応、gnu-socialのほうに通知が来た。しかし、gnu-social側から送っても、pleroma側には通知が来ず、メンションが飛ばされていないのかもしれない。

mastodonは、両方のやり取りが不可能だった。通知が来ない。しかも、インスタンスのリンクが作成されていないところを見ると、./well-knownでも他のところを見ているか、pleromaとは処理が違うんだろうと思われる。

### webfingerがうまく動作した手順

webfingerがうまく動作する手順が判明しました。

1 dockerから/install.phpを実行する、DBに送った情報をもとに、dockerにあるconfig.phpをherokuにpushする

2 config.phpを書き換え、pushする

3 うまく動作するのを確認したあと、DBをdumpする

```sh
$ mysqldump --host=$HOST $DB_NAME --user=$USER_NAME --password=$PASSWORD >! dump.sql
```



4 dockerのprofile domainがlocalhostになっているので、本来のdomainに修正したあと、mysqlのdumpを書き換え、restoreする

```sh
# tableを確認
$ mysql --host=$HOST --user=$USER_NAME --password=$PASSWORD $DB_NAME
mysql > select * from user;

$ vim dump.sql
# 修正
```

```sh
# restore
$ mysql --host=$HOST --user=$USER_NAME --password=$PASSWORD $DB_NAME < dump.sql
```

一応、heroku-mysql dashboardでもbackupを作成してdlしておく

5 apache2で以下の設定を行う

```sh
$ vim Profile
web: vendor/bin/heroku-php-apache2

$ vim .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  #RewriteBase /mublog/
  #RewriteCond %{HTTP:Authorization} ^(.*)
  #RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  #RewriteRule (.*) index.php?p=$1 [L,QSA]
  RewriteRule (.*) index.php/$1 [L,QSA]

</IfModule>
<FilesMatch "\.(ini)">
    <IfVersion < 2.3>
        Order allow,deny
        Deny from all
    </IfVersion>
    <IfVersion >= 2.3>
        Require all denied
    </IfVersion>
</FilesMatch>
<FilesMatch ".well-known/*">
    Require all granted
</FilesMatch>
```

ここまででmastodon, pleroma, gnu-social間でやり取りできるようになった。

少しだけ心残りは、.htaccessでindex.php/.well-known/webfingerを短縮できなかったこと。apacheのrewireteの設定は難しい、特にリクエストがある場合は。

fancyをtrueにしてる関係で、host-metaはindex.phpは短縮されてるんだけど、実際のURLは`/.well-known/webfinger`じゃなく`index.php/.well-known/webfinger`

### ostatus

ostatusについて調べてみたら、かなりやばい。リンク切れ多数で更新されていない感じ。資料も探すのに苦労する感じでした。


`PubSubHubbub の機能不足を補うために、Atom の拡張（Activity Streams, Portable Contacts, Salmon）を使う`

> フィードが表す social activity を表現するために、Activity Streams を使う（例えば、フォローのときは "follow" verb を使う） プロフィール情報を提供するために Portable Contacts を使う リプライを送るために Salmon を使う


https://muziyoshiz.hatenablog.com/entry/2017/04/30/143632

### nginx

nginxで404が出る場合は、以下。

```sh
$ vim nginx_app.conf location / {
    try_files $uri @rewriteapp;
}
location @rewriteapp {
    rewrite ^(.*)$ /index.php/$1 last;
}
location ~ ^/(app|app_dev|config)\.php(/|$) {
    try_files @heroku-fcgi @heroku-fcgi;
    internal;
} 

$ vim Procfile
web: vendor/bin/heroku-php-nginx -C nginx_app.conf
```

### 感想

更新されてないため、コミュニティが活発ではなく情報がやばいです。ostatusがやばいです。composerすら用意されておらず辛いです。mysqlのみなのは、herokuに効きます。herokuで使えるmysqlはやばいです。

以上
