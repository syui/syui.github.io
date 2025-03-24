+++
date = "2016-09-20"
tags =  ["memo"]
title = "Magisk+PHH-SuperUserで困ってること"
slug = "magisk-phh-superuser"
+++

## Magisk+PHH-SuperUserで困ってること		

- mount -t ext4,ext3,ext2などが失敗する

理由はよくわからないけど、これらのコマンドが使えなくなってしまうので、イメージをマウントできなくなる問題があります。

```bash
# mount -t ext4 /dev/block/loop255 /data/local/mnt
mount: Invalid argument
failed: Invalid argument
# mount | grep loop
# ./busybox dmasg | grep loop255
EXT4-fs (loop255): error: unable to read superblock
# ./busybox fdisk -l /dev/block/loop255
fdisk: can't open '/dev/block/loop255': Input/output error
```

- FRepのスクリーンショット登録が行えない, スクリーンショット保存ができない

まず、システム設定で`一時ディレクトリ`を`/sdcard/foo`にしないと動作しないのでこれを行うと、スクリーンショット機能が使えなくなり、そのため画像認識プログラムなども全滅してしまう問題があります。

プログラムでスクリーンショット-保存しないで次の認識に使うをやっても、システム設定-標準UIDを使用などを切り替えても無理。

> MagiskにてSELinuxをOFFにしたらいけた
		
