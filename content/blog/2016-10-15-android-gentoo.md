+++
date = "2016-10-15"
tags =  ["memo"]
title = "PHH-SuperUserに切り替えたらArchLinuxが起動しなくなった"
slug = "android-gentoo"
+++

## PHH-SuperUserに切り替えたらArch Linuxが起動しなくなった

理由はSELinux関連かと思ったら違った。`mount -t ext4`が上手く実行されない。

まず、エラーの内容から。

```bash
$ su
# cd /magisk/local/system/xbin
# ./busybox losetup -d /dev/block/loop255
# ./busybox losetup /dev/block/loop255 /sdcard/arch/arch.img
# ./busybox mount -t ext4 /dev/block/loop255 /data/local/mnt
mount: mounting /dev/block/loop255 on /data/local/mnt failed: No such file or directory
# mount | grep loop
# ./busybox dmasg | grep loop255
EXT4-fs (loop255): error: unable to read superblock
# ./busybox fdisk -l /dev/block/loop255
fdisk: can't open '/dev/block/loop255': Input/output error
```

## 追記

色々やってみたついでに、今度はGentoo Linuxを入れてみました。

参考 :

http://mobiles-han.blogspot.jp/2011/08/androidubuntu.html
		
