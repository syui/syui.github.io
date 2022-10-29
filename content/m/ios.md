+++
date = "2022-10-29"
tags = ["ios","m"]
title = "ios"
slug = "ios"
+++

iosで使用しているアプリを紹介します。

### アプリ

- termius

- openvpn

- goodreader

- authenticator(google)

- bitwarden(使っていない)

- firefox focus

- reddit

- medly

- scaniverse

- metatrader 5

- twitter

- mastodon

- pokemon go

### termius

iosでは主に`termius`を使用しています。これがないと、私のスマホは恐ろしいほど不便になります。

私のようなhackerは、主にlocal-network環境を構築し、様々なデータにアクセスできるようにしています。

つまり、local-networkに入れないと何もできません。

ios端末、つまり、iphoneやipadはsimを入れてキャリア回線を使用するためglobal-ipになります。wifiのlocal-ipはここでは考慮しません。

wanからlan(local-network)に入るには、様々な方法がありますが、ルーターのポートフォワーディングと呼ばれる機能とvpn serverを使用します。

ポートフォワーディングでssh-serverに接続し、dockerからpritunl(vpn server)を立ち上げ、profileを書き換えて、vpnにアクセスし、lanに入ります。lanに入ればlocal-ipが使えるはずですから、private-keyだけで様々なserverにアクセスできるはず。よく使うserverはtermiusに登録しておきましょう。

```yml:docker-compose.yml
version: '3'

services:
  mongo:
    image: mongo:latest
    container_name: pritunldb
    hostname: pritunldb
    network_mode: bridge
    volumes:
      - ./db:/data/db

  pritunl:
    image: goofball222/pritunl:latest
    container_name: pritunl
    hostname: pritunl
    depends_on:
        - mongo
    network_mode: bridge
    privileged: true
    sysctls:
      - net.ipv6.conf.all.disable_ipv6=0
    links:
      - mongo
    volumes:
      - /etc/localtime:/etc/localtime:ro
    ports:
      - 80:80
      - 443:443
      - 1194:1194
      - 1194:1194/udp
      - 14036:14036/udp
    environment:
      - TZ=UTC
```

profileをdownloadしてiosに共有しておきます。なお、global-ipは通常は変動しますので、固定ipを持っていない場合は、ddnsの登録を行ったうえでそれを使用するか、ipが変わったとき通知するか、してください。

固定ipやddnsの場合は、profileを書き換える必要はありませんが、そうでない場合は、profileのglobal-ipを書き換える必要があります。書き換えは`goodreader`などが便利です。

```sh
- remote 123.45.67.89 $port udp
+ remote 89.45.67.123 $port udp
```

vpn serverを常時起動しておくのは電力の無駄でsecurity上もよくありません。したがって、できればポートフォワーディング用のserverを用意して、使用するときに起動したほうがいいと思います。

また、securityを考慮するなら、ポートフォワーディング用のserver自体を必要最小限にし、wol serverにした上で、ssh serverをwolで起動する役割のみを与えます。wolしたあとは、sshの踏み台にして、private-key自体はiosに置いておくという形が理想的だと思います。そのssh serverにアクセスしたあとはvpn serverを立ち上げ、lanに入ればいいでしょう。ただし、手間がかかりますから、そのへんのsecurityは使用頻度を考慮した上で考えればいいと思います。

`termius`はsftpを使えるので特に便利です。

`goodreader`は最新のopensshのprivate-keyに対応していません。

