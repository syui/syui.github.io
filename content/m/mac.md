+++
date = "2022-09-29"
lastmod = "2022-10-30"
tags = ["mac","m"]
title = "mac"
slug = "mac"
+++

macの使い方をまとめます。macbook air(m1, intel)を使っています。

最初にインストールしたソフトウェアとサービスの一覧です。

## 使ってるソフトウェア

- xcode, commandline tools, etc... : https://developer.apple.com/
- chrome : https://www.google.com/chrome/
- iterm2 : https://iterm2.com/
- homebrew : https://github.com/Homebrew/brew
- karabiner : https://github.com/pqrs-org/Karabiner-Elements
- shiftit : https://github.com/fikovnik/ShiftIt
- keepassxc : https://github.com/keepassxreboot/keepassxc
- virtualbox : https://download.virtualbox.org/virtualbox/
- clipy : https://clipy-app.com/

## 使ってるサービス

- github : https://github.com/
- bluesky : https://bsky.app/
- google : https://www.google.com/
- youtube : https://www.youtube.com/
- northflank : https://northflank.com/
- fab : https://www.fab.com/
- amazon : https://www.amazon.co.jp/
- cloudflare : https://www.cloudflare.com/
- wiki : https://wiki.archlinux.jp/
- slack : https://archlinuxjp.slack.com/

## other

- studioone2 : https://piaprostudio.com/
- synthesizerv : https://synthesizerv.com/

##  chrome

- https://github.com/gorhill/uBlock
- https://github.com/uBlockOrigin/uBOL-home

## macの個人設定

まず、電源offのショートカットがないので作ります。

- `キーボード -> ショートカット -> アプリケーション -> システム終了...` : Ctrl + Command + L

ここで`システム終了...`と`...`まで日本語入力して設定します。これは、メニュー項目の表示にあたります。macは表示項目で操作するようです。

ファイアウォールがdisableになっているので、enableにします。

- `セキュリティとプライバシー -> ファイアウォール`

gpg-keyを忘れないようにimportします。

```sh
$ gpg --export-secret-keys 67AC97A939D3EA19 > sec.key
------
$ brew install gpg
$ gpg --import sec.key
```

## intel mac

intel版のmacbook airには、archlinuxを入れています。また、usbに入れているarchも起動できるので、外出時などに便利です。

```sh:bootloaderにiconを表示する.txt
$ sudo mount /dev/sdb1 /mnt
$ sudo cp ~/pics/arch.icns /mnt/.volumeicon.icns
$ sudo cp ~/pics/apple.icns /.volumeicon.icns
```

iphoneのインターネット共有(テザリング)でglobal-ipから使います。

[gotunl](https://github.com/cghdev/gotunl)で[vpn server](https://syui.cf/m/post/arch/)にアクセスし、local-networkに入ります。

なお、`gotunl`を使うには、あらかじめ公式[client](https://pritunl.com)をinstallして、profileをimportしておく必要があります。詳しくは[archlinux](https://syui.cf/m/post/arch/)の記事で解説しています。

