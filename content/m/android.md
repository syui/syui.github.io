+++
date = "2022-10-29"
lastmod = "2022-10-30"
tags = ["android","m"]
title = "android"
slug = "android"
+++

nexus7(2013)はroot権限を取って使っています。

公式imgは以下にあります。

flo : https://developers.google.com/android/images

```sh
$ adb reboot-bootloader
$ fastboot flash boot boot.img
$ fastboot erase system
$ fastboot flash system system.img
$ fastboot reboot
```

```sh
$ adb reboot bootloader
$ fastboot oem unlock
# https://developers.google.com/android/images
# ./flash-all.sh
$ fastboot flash recovery twrp-xxx.img
$ adb reboot recovery
$ adb push xxx.zip /sdcard/
$ adb reboot system 
$ adb install xxx.apk
# http://www.apkmirror.com/
```

lineage osを使うことで、nexus7にandroid12をインストールできます。

twrp : https://twrp.me/asus/asusnexus72013wifi.html

lineage os 19.1 : https://forum.xda-developers.com/t/rom-flo-deb-unofficial-lineageos-19-1-2022-03-18.3569067/

gapps : https://drive.google.com/drive/folders/1O-I01LDvno57ztnxIW_bSnVWEk8-6Ics

bitgapps : https://github.com/BiTGApps

magisk : https://github.com/topjohnwu/Magisk

`sysrepart_1380_20.zip`のパーティションの処理が失敗する場合は、[公式img](https://developers.google.com/android/images)で初期化するといいかもしれません。

```sh
$ adb reboot-bootloader
$ fastboot flash recovery twrp.img
$ fastboot boot twrp.img

$ adb push sysrepart.zip /sdcard/
# twrp -> install -> sysrepart

$ adb push lineageos.zip /sdcard/
$ adb push opengaaps.zip /sdcard/
# twrp -> install -> lineage, opengaaps
```

最近の権限管理はmagiskが定番のようです。

```
$ adb install magisk.apk
# magiskでlineageのboot.imgにpatchを当てる

$ adb pull /sdcard/Downloads/magisk_patched.img
$ adb reboot-bootloader
$ fastboot flash boot magisk_patched.img
```

### アプリ

- Terminal Emulator for Android

- BusyBox

- Hacker’s Keyboard

- AFWall+

- Clipper - Clipboard Manager

- AdAway

- Perfect Viewer

### archlinux

archlinuxを使うには、archのimgを作成してchrootでアクセスします。大抵のコマンドはbusyboxを使います。

imgは[armv7](https://archlinuxarm.org/about/downloads)のarchを使って作成します。pacmanのmirrorも変わってきますので注意です。

```sh
$ export bbox=/data/adb/magisk/busybox
$ export imgfile=/sdcard/linux/archlinux.img
$ $bbox losetup -d /dev/block/loop255
$ $bbox losetup /dev/block/loop255 $imgfile
$ $bbox mount -o bind /sdcard $mnt/sdcard
$ $bbox chroot $mnt /root/init.sh $(basename $imgfile)
```

```sh:init.sh
export PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/sbin
/bin/sshd
```

![](https://files.mastodon.social/media_attachments/files/108/011/206/558/360/931/small/9d34e56d3a9a274d.png)

### 過去の情報

以前はsupersuの作者が提供していたscriptを実行し、exproitをついて権限を取得していました。

[CF-Auto-Root-flo-razor-nexus7.zip](http://download.chainfire.eu/347/CF-Root/CF-Auto-Root/CF-Auto-Root-flo-razor-nexus7.zip)

```sh
$ adb reboot-bootloader
$ chmod +x root-mac.sh 
$ ./root-mac.sh 
```

