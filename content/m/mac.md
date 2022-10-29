+++
date = "2022-09-29"
tags = ["mac","m"]
title = "mac"
slug = "mac"
+++

macの使い方をまとめます。

最初にインストールしたソフトウェアとサービスの一覧です。

### 使ってるソフトウェア

- xcode, etc... : https://developer.apple.com/jp/

- chrome : https://www.google.com/chrome/

- google日本語入力 : https://www.google.co.jp/ime/

- iterm2 : https://iterm2.com/

- homebrew : https://github.com/Homebrew/brew

- karabiner : https://github.com/pqrs-org/Karabiner-Elements

- shiftit : https://github.com/fikovnik/ShiftIt

- keepassxc : https://github.com/keepassxreboot/keepassxc

- virtualbox : https://download.virtualbox.org/virtualbox/

### 使ってるサービス

- github : https://github.com/

- twitter : https://twitter.com/

- google : https://www.google.com/

- youtube : https://www.youtube.com/

- heroku : https://heroku.com/

- fly.io : https://fly.io/

- northflank : https://northflank.com/

- sketchfab : https://sketchfab.com/

- amazon : https://www.amazon.co.jp/

- mailgun : https://mailgun.com/

- cloudflare : https://www.cloudflare.com/

- freenom : https://www.freenom.com/

- wiki : https://wiki.archlinux.jp/

- slack : https://archlinuxjp.slack.com/

- reddit : https://www.reddit.com/

### macの個人設定

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

### intel mac

intel版のmacbook airには、archlinuxを入れています。また、usbに入れているarchも起動できるので、外出時などに便利です。

iphoneのインターネット共有(テザリング)でglobal-ipから使います。

[gotunl](https://github.com/cghdev/gotunl)でvpn serverにアクセスし、local-networkに入ります。

