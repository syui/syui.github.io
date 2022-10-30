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

- slack

- twitter

- mastodon

- ibispaint x

### termius

iosでは主に`termius`を使用しています。これがないと、私のスマホは恐ろしいほど不便になります。

私のようなhackerは、主にlocal-network環境を構築し、様々なデータにアクセスできるようにしています。

つまり、local-networkに入れないと何もできません。

ios端末、つまり、iphoneやipadはsimを入れてキャリア回線を使用するためglobal-ipになります。wifiのlocal-ipはここでは考慮しません。

wanからlan(local-network)に入るには、様々な方法がありますが、ルーターのポートフォワーディングと呼ばれる機能と[vpn server](https://syui.cf/m/post/arch/)を使用します。詳しくは、archlinuxの記事に書いています。

`termius`はsftpを使えるので特に便利です。

`goodreader`は最新のopensshのprivate-keyに対応していません。

### checkm8

`checkm8`の登場により、iosのroot権限を得るのは、さほど難しくなくなりました。私もいくつかの古い端末でrootを取っているios端末はありますが、特に利便性を感じていないので、使っていません。sshは可能です。しかし、そこまで早くはないし、むしろ遅いので、ios端末をサードパーティでカスタマイズする必要性を私はあまり感じませんでした。

https://checkra.in

https://github.com/axi0mX/ipwndfu

とりあえずやることとしては、`ipwndfu`を使います。dfu modeに入って、usb接続した上で、ipwndfuの診断及びexploitを実行をします。

```sh
$ ./ipwndfu -p
```

rootを取ったあとは、サードパーティのアプリを入れられるようになるので、cydia, altstore, reprovision,  unc0verあたりが便利です。  

cydiaは自動で入る事が多いですが、ここでopensshもinstallできます。

iosのrootを取るときに気をつけなければならないのは、shsh(署名)です。upgradeやdowngradeに関わってきます。shshは保存しておくのがいいでしょう。

最初に述べましたが、iosのroot化は、そこまでできることは多くないと思います。androidとの比較になりますが、android(root)より圧倒的に不便と言えるでしょう。

