+++
date = "2016-09-22"
tags =  ["memo"]
title = "mount:Invalidargument"
slug = "android-busybox"
+++

## mount: Invalid argument

権限管理アプリを`supersu -> superuser`に変えてから特定のフォーマットでイメージをマウントできなくなっていました。

しかし、以下のBusyboxをインストールすることで解決しました。

https://play.google.com/store/apps/details?id=ru.meefik.busybox

具体的には、当該Busyboxをインストール後、MagiskでSELinuxをOFFにすることで、特定のフォーマットを指定しマウントできない問題を回避できます。

参考 :

https://github.com/meefik/linuxdeploy/wiki/How-to-troubleshoot

このアプリの作者さん、なんか自分と似たようなことをやっている人だった。

https://github.com/meefik

https://play.google.com/store/apps/details?id=ru.meefik.linuxdeploy

今までベースアプリは何気なく定番を使ってきたけど、マイナーアプリもいいかもしれませんね(調査と勇気が必要かもだけど)。

- supersu -> phh-superuser

- busybox -> busybox-meefik

- xposed -> xposed-topjohnwu
		
