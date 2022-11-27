+++
date = "2022-11-25"
lastmod = "2022-11-26"
tags = ["fly","m"]
title = "fly"
slug = "fly"
+++

fly.ioではappもpgもすべてcontinerです。volume領域はcontiner内に作成します。`fly.toml`においてmountできるvolumeは1つです。

```sh
# アプリの作成
$ fly apps create $app
# アプリの削除
$ fly apps destroy $app

# メモリを512Mに設定する
$ fly scale memory 512

# volume(hdd)領域を3Gで作成する
$ fly vol create --region nrt --size 3 $app

# pg(postgres)を作る
$ fly pg create $app-db

# pgのupdate等
$ fly image update $app-db
$ fly pg restart -a $app-db
```

### pg attach

fly.ioのpgは注意が必要です。attachした際のurlは一度しか表示されません。detach, attachするとurlが変わります。同じ名前のappを作り直すとattach, detachできなくなります。

```sh
# pgを接続する
$ fly pg attach -a $app $app-db
```

### pg backup, restore

pgは1日おきにsnapshotを作成します。

```sh
# db backup list & restore
$ fly vol list -a $app-db
$ fly vol snapshots list vol_xxxxxxxxx
$ fly pg create --snapshot-id vs_xxxxxxxx
```

```sh
# pgにlocalから接続する
$ fly proxy 5432 -a $app-db
$ psql postgres://postgres:<operator_password>@localhost:5432
$ fly pg connect -a $app $app-db
-----
$ pg_restore --no-owner -h localhost -p 15432 -U postgres -d $app-db pg.dump
```

### fly.toml

基本的には`./fly.toml`を参照します。

```sh
$ cat fly.toml
app = "$app"

$ fly status
$ fly logs

$ fly deploy
$ fly open
```

### dns, ssl

appのcertificateに$app.fly.devを作成後に$sub-domain.comを作成します。

```sh
$ fly certs add $app.fly.dev
$ fly certs add $sub-domain.com
$ fly certs list
cname : _acme-challenge.$app, $sub-domain.xxx.flydns.net

# cloudflare
cname : _acme-challenge.$app, $sub-domain.xxx.flydns.net
cname : $sub-domain.com, $app.fly.dev
```

### redis

```sh:Dockerfile.txt
ADD start-redis-server.sh /usr/bin/
RUN chmod +x /usr/bin/start-redis-server.sh
CMD ["start-redis-server.sh"]
```

```sh:start-redis-server.sh
#!/bin/sh
sysctl vm.overcommit_memory=1
sysctl net.core.somaxconn=1024
redis-server --dir /data/ --appendonly yes
```

### limit currently

> $ fly logs
> 
> Process file descriptor limit is currently

```sh:Dockerfile.txt
ADD entorypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entorypoint.sh 
ENTORYPOINT ["entorypoint.sh"]
```

```sh:entorypoint.sh
#!/bin/sh
ulimit -n 65535
ulimit -u 4096
exec $@
```

### full volume

pg(volume)が一杯になっても確認する術がほとんどありません。freeの運用には注意しましょう。

```sh
# sizeを大きくする(小さくすることはできない)
$ fly vol list -a $app-db
$ fly vol extend $id -s 2
```

pg-volumeが一杯になると動作が停止しますが、原因が判明するのに時間がかかってしまいました。

freeで運用するには、mastodonを立ち上げてadmin, ownerのaccountを作成し、初期設定を行った時点で、pg volumeをsnapshotからcreateして、そのcontinerを保存しておきます。一杯になった時点でdetach, attachで切り替えます。できない場合は、`DATABASE_URL`を環境変数に入れます。

```sh
$  fly ssh console -C 'tootctl accounts modify $USER --confirm --role Owner'
```

```sh
$ fly vol snapshots list vol_xxxxxxxxx
$ fly pg create --snapshot-id vs_xxxxxxxx
```

ref : https://github.com/tmm1/flyapp-mastodon

### pg detach

```sh
$ fly secrets unset DATABASE_URL
$ fly pg connect -a  $app-db
DROP DATABASE $app WITH (FORCE);
DROP USER $app WITH (FORCE);

$ fly pg detach -a $app $app-db
```
