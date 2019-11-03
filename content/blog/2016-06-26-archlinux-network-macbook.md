+++
date = "2016-06-26"
tags =  ["pc"]
title = "archlinux-network-macbook"
slug = "archlinux-network-macbook"
+++

MacBookにインストールしたArchLinuxのネットワークの調子がここ最近おかしかったのですが、どうやらドライバのアップデートが来て直った模様。

```bash
$ yaourt -S broadcom-wl-dkms
$ sudo pacman -S linux-headers
```

あと、色々触っているうちに`netctl`をやめて`ip`を使ったネットワーク設定などをやってみたり。

```bash
# デバイス名を自動設定する機能をOFFにする, これでeth0, wlan0になります
$ sudo ln -s /dev/null /etc/udev/rules.d/80-net-setup-link.rules

# ipの場合、通常こんな感じで接続します, netctlよりも相当に面倒です
$ export eth=eth0
$ sudo ip link set $eth up
$ sudo ip addr add 192.168.1.2/24 broadcast 192.168.1.255 dev $eth
$ sudo ip route add default via 192.168.11.1

# 自動起動の場合もscriptとsystemctlのunitを作成してenableしなければなりません
$ sudo systemctl enable network@interface.service
$ sudo systemctl start network@interface.service
```

これはArchLinux特有の問題でもないのだろうけれど、Updateが速いのでいろいろな面倒事に巻き込まれる確率は高まる。
