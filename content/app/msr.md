+++
date = "2022-02-09"
title = "msr"
description = "| rustで書かれたmastodon client"
+++

`msr`は、rustで書かれたシンプルなmastodon clientです。

[Download](https://github.com/syui/msr/releases)

```sh
# mac
$ curl -sLO https://github.com/syui/msr/releases/download/main/msr-x86_64-pc-windows-msvc
$ mv msr-x86_64-apple-darwin msr
$ chmod +x msr
$ ./msr
# security setting
# macの場合、ここで設定->セキュリティにてファイルを開くを選択します

# linux
$ curl -sLO https://github.com/syui/msr/releases/download/main/msr-x86_64-unknown-linux-gnu
$ mv msr-x86_64-unknown-linux-gnu msr
$ chmod +x msr
$ ./msr
```

### build

```sh
$ git clone https://github.com/syui/msr
$ cd msr/
$ cargo build
$ ./target/debug/msr
```

### use

mastodonの`開発`からappを発行してください。権限は必要最小限で構いません。名前は`msr`でredirect-urlは`localhost`(なんでもいい)です。

`~/.config/msr/config.toml`にtokenなどの情報を記述してください。

```sh
$ mkdir -p ~/.config/msr
$ cp config.toml.example ~/.config/msr/config.toml
$ vim ~/.config/msr/config.toml
```

```toml:~/.config/msr/config.toml
token = "アクセストークン"
client_id = "クライアントキー"
client_secret = "クライアントシークレット"
redirect = "localhost"
base = "https://mastodon.social"
```

なお、`~/.config/msr/setting.toml`を置くことで、簡単にaccountの切り替えができるようになります。

```sh
$ msr a -d
```

基本的には、`a` option後にfile-pathを指定することで、accountを切り替えられます。

```sh
$ msr a ~/.config/msr/social.toml
```

### icon

macはiterm2の`imgcat`を使い、linuxはmltermなどで`img2sixel`を使ってアイコンを表示します。

```sh
$ msr i
```

windowsの場合は、msys2でsixelをcompileし、minttyで表示できます。scoopでmsys2をinstallする場合のpathは`~/scoop/apps/msys2/current`になります。

```sh
$ scoop install msys2
$ msys2
$ cd
$ git clone https://github.com/saitoha/libsixel
$ cd libsixel
$ pacman -S make gcc
$ ./configure
$ make
$ make install

$ mintty
$ img2sixel test.png
```

その他の使い方は、command `help`を見てください。
