+++
date = "2022-10-29"
lastmod = "2022-10-30"
tags = ["ios","m"]
title = "ios"
slug = "ios"
+++

iosで使用しているアプリを紹介します。iphone se3とipad9を使っています。

### アプリ

- termius
- openvpn
- goodreader
- authenticator(google)
- bitwarden
- firefox focus
- metatrader 5
- scaniverse
- bluesky

### sub

- mastodon, damus(nostr)
- slack, discord, matrix(element)

### default

基本的にはiosの標準アプリを使用します。通話はfacetime, チャットはmessageです。これらはmail-addressと紐づけられます。

lineやその他のアプリは必要ではないため使用していません。

### termius

iosでは主に`termius`を使用しています。これがないと、私のスマホは恐ろしいほど不便になります。

iphoneは通常、simを入れてキャリア回線を使用するためglobal-ipになります。

wanからlan(local-network)に入るには、様々な方法がありますが、ルーターのポートフォワーディングと呼ばれる機能と`vpn server`を建てて接続します。詳しくは、[archlinux](https://syui.cf/m/post/arch/)の記事に書いています。また、`tailscale`も便利です。vpn-serverのようにself-hostして使うわけではなく外部サービスとして利用料を払い使用する形式です(無料枠あり)。

`termius`はsftpを使えるので特に便利です。`goodreader`は最新のopensshのprivate-keyに対応していません。

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

最初に述べましたが、iosのroot化は、そこまでできることは多くないと思います。androidとの比較になりますが、android(root)のほうが圧倒的に便利と言えるでしょう。

