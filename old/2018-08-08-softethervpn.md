+++
date = "2018-08-08"
tags = ["archlinux","vpn"]
title = "archlinuxで手軽にvpn serverを立てる"
slug = "softethervpn"
+++

## 導入

archlinuxには、いろいろな用途があります。

私がarchlinuxを使っている一番の理由は、広範囲に渡って利用できるからです。

archlinuxは、serverとしてもdesktopとしても優秀で、usbに入れて持ち運ぶにしても、containerとしても最適です。

例えば、gentooとかだとusbだとちょっときついんですよね。gentooは基本は自前buildなので、インストール時にすごい時間がかかってしまったりするんですよ。

反対に、ubuntuとかだとpackageが古い場合が多くて、また、ダイエットとかに逆に時間がかかってしまったりとかでなかなか面倒なんです。

よって、いろいろな用途に広範囲利用する場合は、archlinuxという選択は、非常にエコと言うか、時間がかからないです。archlinuxをとりあえずやっとけば、ほぼ応用できるのですから、複数のosを使い分ける必要がありません。serverならgentooで、desktopにはubuntuで、usbに入れるのはdebianでとか、そういった学習コストがないんです。

私は、linuxに関しては、arch以外、ほぼ全くやってないんですよ。他のディストリビューションを使ってたことって、ほとんどありませんし、触ってこなかった。

でもarchっていろいろな用途に使ってますし、使えるんですよ。

だからarchは、便利なんですが、linuxってvpnが面倒ですよね。特にarchは、最初にnetwork manager(nm)すら入ってませんからね。だからよけいにつらいってことはあると思うんです。

正直、linuxにして、これは訳がわからない感じなんですが、しかし、今回紹介するvpn gateに使われてる`softethervpn`を利用すると、serverをサクッと立てられたりします。

なので、今回は、archの弱点ぽく見えるvpn serverの構築、つまり、`softethervpn`の紹介ですかね。

ちなみに、vpnというのは、ドラマ風に言うと秘匿回線のことです(正確には全然違う)。通信って暗号化されてないとパケットが見えるんですよ。で、パケットが見えると、例えば、あるユーザーがパスワードでサイトにログインした時の通信なんかがそこから解読されてしまうってこともあり得るので危険なんです。まあ、パケットキャプチャされてる事自体が稀ではありますけど、外から接続する場合は特に気をつけなければなりません。そこで、vpn serverを通すことで、通信内容を外部から見られないようにするトンネル?のようなものかなって思います。外部からはvpn serverまでのアクセスは追えますけど、そこからは追跡できないよみたいな感じですね。また、vpnを通すと通常は、global ip addressも変わりますからね。追跡も通常の場合に比べて困難になります。これはアクセス先からと言う意味ですが。(ローカルネットワーク上に立てたvpn serverは、当然ながら同じglobal ipになります。なのでそこの効果は薄いと考えて良いでしょう。その意味で、本来的にはレンタルサーバー上とかで立てると良いですよね)

ちなみに、このブログで書いてることって、基本的には正確ではありません。単なる個人的なイメージを述べてるだけですからね。気になる方は調べてください。

さて、`softethervpn`の紹介でしたね。

## softethervpn serverの設定

ここでは`IPsec / L2TP`で接続できるようにします。

![](https://raw.githubusercontent.com/syui/img/master/old/archlinux_softethervpn_server_01.png)

```sh
$ sudo pacman -S dhclient --noconfirm

$ yay -S softethervpn
```

```sh
$ sudo systemctl start softethervpn-server
$ sudo systemctl status softethervpn-server

$ vpncmd /server
Hub DEFAULT 

GroupCreate
	default

UserCreate
	syui

UserPasswordSet
	xxx

IPsecEnable
	yes
	yes
	yes

SecureNatEnable
	yes

NatEnable
	yes

$ ip a
192.168.11.14
```

なお、`Default Virtual HUB in a case of omitting the HUB on the Username:`は`DEFAULT`にしておきます。これがないとclientのアカウント/ユーザー名で`user@DEFAULT`とかにしないといけない感じかな。分かりませんけど。

error 52(権限が不足しています)が出る場合は、`quit`した直後にまた立ち上げて実行したりすれば、それは出ません。なぜなら、そこは管理者として実行している領域だからです。`Hub DEFAULT`とかすると、`DEFAULT`上で実行されますので、その関係において、特定のコマンドが権限上、実行できない場合があるみたいです。

で、設定ができたらあとは、clientから接続するわけですが、mac/ios/androidの場合は、`IPsec / L2TP`ならnetwork設定から簡単に設定できます。winはやったことないので知りません。なんかソフトが必要?

archだと` xl2tpd`, `openswan`が必要みたいな感じです。

`softethervpn`のclientを利用する場合は、以下のよう感じだと思いますが、良く分かりません。

```sh
$ vpncmd /client
AccountCreate test /SERVER:localhost:500 /HUB:DEFAULT /USERNAME:user /NICNAME:user /PASSWORD:xxx /TYPE:standard

AccountConnect test
```

正直、こっちは定番のclientを使ったほうがいい気がしますね。

さて、これを外部から使うとなると、いつもと同じようにルーターのポート転送の設定とか、あとはglobal ip addressの通知、もしくは、ddnsの設定とかする感じですかね。

おわり。
