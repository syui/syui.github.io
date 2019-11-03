+++
date = "2016-09-13"
tags =  ["memo"]
title = "0.37.0のroot検知"
slug = "pokemon-go"
+++

## 0.37.0のroot検知

Pokemon Go 0.37.0相当にアップデートした。日本には来てなかった時期だったけど、APK Mirrorなどには来ていたので、それを見つけて即座にアップデート。

http://pokemongo.nianticlabs.com/en/post/ver-update-091016/

しかし、iOSではログインできるのだけど、Androidではログイン出来ないという不都合が発生したので調べてみると、Root検知されているぽい。また、Rootを無効化してもXposedが有効になっているとログインできない。

今のところ具体的な回避策はMagiskでRootをOFFにして起動する方法で、Xposedを有効にしながらPokemon Go 0.37.0相当を起動ログインすることが可能になる。手順は以下。

- [Pokemon Go](http://www.apkmirror.com/apk/niantic-inc/pokemon-go)を0.37.0にアップデート

- SuperSU, Xposedを完全にアンインストール

- Recovery Modeである[TWRP](https://twrp.me/devices/androidone.html)などから[magisk_v6.zip](http://forum.xda-developers.com/android/software/mod-magisk-v1-universal-systemless-t3432382), [phh-superuser-magisk.zip](http://forum.xda-developers.com/showpost.php?s=be1cf7e9a4458b9bee9bfae4fd083d35&p=68034106&postcount=2)をインストール

- Reboot Systemして[Magisk Manager.apk](http://forum.xda-developers.com/android/software/mod-magisk-v1-universal-systemless-t3432382), [PHH-SuperUser](https://play.google.com/store/apps/details?id=me.phh.superuser)をインストール, magisk managerはroot偽装(切り替え)アプリでphh-superuserはsupersu相当の権限管理アプリ

- Magisk ManagerからRootをOFFにしてPokemon Goを起動ログイン(成功)

- RootをONにして[Xposed Installer](http://forum.xda-developers.com/xposed/material-design-xposed-installer-t3137758)から[xposed-topjohnwu.zip](http://forum.xda-developers.com/xposed/unofficial-systemless-xposed-t3388268)をインストール(先にTWRPなどからインストールしてもよい)

- RebootしてMagiskからRootをOFFにし、Xposedが動いていることを確認後、Pokemon Goを起動ログイン(成功)

![](https://raw.githubusercontent.com/mba-hack/images/master/pokemon_go_android_0370.png)

ちなみに、SuperSU-MagiskではRootをOFFにしてもXposedがEnable状態ならPokemon Goを起動ログインできないので注意。

ちょっと気持ち悪いやり方だし、バイナリもわざわざMagisk製を使わなきゃだし、正直、好ましい状況とは思えない。

参考 : 

https://www.reddit.com/r/pokemongodev/comments/52478a/037_changelog/

http://forum.xda-developers.com/android/software/mod-magisk-v1-universal-systemless-t3432382

あと、補足としてDevice Fake(Root偽装)ができるアプリが幾つかあるのだけど、そちらではできなさそうな感じだった。

http://repo.xposed.info/module/com.devadvance.rootcloak2

https://play.google.com/store/apps/details?id=jp.kbc.ma34.devicefaker&hl=ja
