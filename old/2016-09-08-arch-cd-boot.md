+++
date = "2016-09-08"
tags =  ["pc"]
title = "古いパソコンもらった"
slug = "arch-cd-boot"
+++

## 古いパソコンもらった

おじいちゃんが古いパソコンが要らなくなったというので貰い受けた。

案の定、WindowsXPというものがインストールされていたので、それを削除してArch Linuxを入れ、サーバーとして使うことにした。

古いパソコンはBIOSでのUSBブートができないようだったので内蔵されているDVDドライブからブートすることにした。しかし、私はDVD/CD類は殆ど持っておらず、持ってたとしてもHDDにコピーして捨ててしまうので、やっぱり持ってなかった。そのため、空のDVD/CDというものも当然持っておらず、仕方なく買いに行くことにした。

買ってきたディスクにはArch Linuxのイメージを`dd`した。が、いざブートしようと思ったらパソコンに内蔵されているDVD/CDドライブが壊れているようだったのでブートできなかった。

ここでUSBブートも, DVDブートもダメとなると、選択肢は限られてくる。

幸運にも私はUSB接続するタイプのDVD外付けドライブを持っていたので、そちらからArchインストールディスクをブートすることにした。

ブートは成功したものの幾つかのエラーが出ていてArch Linux自体は起動しなかった。外部ドライブ先である`/dev/sr1`からエラーが出ていたので、以下のコマンドでも問題解決には至らなかった。

```bash
[rootfs]
Waiting 30 seconds for device /dev/disk/ARCH_201609
$ ln -sf /dev/sr1 /dev/disk/by-label/ARCH_201609
$ exit
```

したがって、USBを接続して、そちらに入れてあるArch Linuxを使うことにした。これは、要求されているラベルを書き換えることで使うことができた。DVDブートが要求しているラベルは`ARCH_201609`。

```bash
[rootfs]
$ cd /dev/disk/by-label/
$ ls 
ARCH_201608...USB
$ mv ARCH_201608 ARCH_201609
$ exit
```

これでArch Linuxが無事起動した。ここまでくれば後は問題ないと思っていたが、HDDをマウントできない問題が発生した。

```bash
[archiso]
$ mkfs.ext4 /dev/sda2
$ mount /dev/sda2 /mnt
mount: unknown filesystem type 'ext4'
```

https://bbs.archlinux.org/viewtopic.php?id=215432

他のフォーマットを試したけど無駄ぽい。マウントできないというのは割りとどうしようもないので、USBの起動イメージを変えてみることにした。具体的にはArch Linuxのイメージを少し古くしてみたらいけた。

```bash
[rootfs]
$ cd /dev/disk/by-label/
$ ls 
ARCH_201508...USB
$ mv ARCH_201508 ARCH_201609
$ exit
[archiso]
$ mkfs.ext4 /dev/sda2
$ mount /dev/sda2 /mnt
```

ただ、そこでも`pacman-key --refresh-keys`などでのエラーに手こずった。(Archは古いイメージを使うとすぐこうなるから嫌だったんだよ。)

でも以下のようにしたらいけた。

```bash
[archiso]
$ pacstrap /mnt base
warning: Public keyring not found; have you run 'pacman-key --init'?
error: packege_name: key "****************" is unknown
error: key "****************" could not be looked up remotely

$ pacman-key --refresh-keys
gpg: connecting dirmngr at '/root/.gnupg/S.dirmngr' failed: IPC connect call failed
gpg: keyserver refresh failed: No dirmngr
==> ERROR: A specified local key could not be updated from a keyserver.

$ dirmngr

$ pacman-key --init

$ pacstrap /mnt base
:: Import PGP key ********, "hoge hoge <******@archlinux.org>", created YYYY-MM-DD? [Y/n]

$ pacman-key --populate

$ pacstrap /mnt base
```

だいたいこんな感じでなんとかなった。

と言っても重要なのは最初の方だけで、DVDドライブからは何故かArchが起動しなかったので、`rootfs(busybox)`からUSBのArchイメージを所定のラベル(DVDイメージが要求するラベル)に変更することで強引にArchを起動しているという所だと思われる。
