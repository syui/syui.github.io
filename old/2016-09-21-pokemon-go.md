+++
date = "2016-09-21"
tags =  ["memo"]
title = "PokemonGo0.37.0;;XposedLogin"
slug = "pokemon-go"
+++

Pokemon Goでは新たにMagisk-Xposedの問題も出てきて、また回避策が必要ぽい。Xposedを無効にすればログインできるけど、それでは不便なので。関係ないけどPokemon Goのおかげでだいぶシステムが変わってしまった。

https://www.reddit.com/r/pokemongodev/comments/53heua/niantic_may_have_just_blocked_magisk/

## Pokemon Go 0.37.0;;Xposed Login

どうやら`Magisk + Xposed(systemless) + PHH-SuperUse`を使っていてもXposedが有効の場合はRootログインできなくなったぽい。

https://www.reddit.com/r/pokemongodev/comments/53hx5p/howto_temporary_disable_systemless_xposed/

https://www.reddit.com/r/pokemongodev/comments/53heua/niantic_may_have_just_blocked_magisk/

この点、Xposedを無効にするとログインできます。

ちなみに、Pokemon Goの古いバージョンである`0.35.0`以下を使うことでログインできますが(当たり前か)、`0.37.0`以上ではXposedが有効だとPokemon Goにログインできません。

そんな中、AutoMagiskというものが不憫にも登場しています(と言っても本件とは無関係で私の環境ではこれを使ってもログインできるようにならない)。

### AutoMagisk

APKMirror : http://www.apkmirror.com/apk/mighty-quinn-apps/automagisk/automagisk-1-0-release/automagisk-1-0-android-apk-download/

Reddit : https://www.reddit.com/r/Android/comments/536www/automagisk_automatically_disable_magisk_root_when/

ユーザー補助でONにするとアプリごとに自動でRootを切り替えてくれます。こりゃ楽でいいすね。

### ps|grep xposed

一応、回避策の一つとして一旦プロセスをKILLしてポケモンGo v0.37.0, v0.37.1にログインする方法があります。その後にプロセスを起動する方法です。

https://www.reddit.com/r/pokemongodev/comments/53hx5p/howto_temporary_disable_systemless_xposed/d7td1dc

```bash
$ export PATH=$PATH:/system/xbin
$ => open Pokemon GO <=
$ pkill -STOP xposed_
```

### SuHide

以下の構成でもいけます。SuHideというのはAndroid HackerのChainFire氏(SuperSU作者)が非Root表示(Root偽装)のために作ったツールです。

http://forum.xda-developers.com/apps/supersu/suhide-t3450396

SuperSU-v2.78-SR1 + SuHide + xposed-v86.2-topjohnwu (systemless)

- SuperSU-v2.78-SR1

- SuHide-v0.53

```bash
$ ls -nld /data/data/com.nianticlabs.pokemongo
$ /su/suhide/add XXXXX
$ /su/suhide/list
```

- xposed-v86.2-topjohnwuxposed

個人的にはこっちのほうが合ってる気がします。ただ、Magisk+PHH-SuperUserのほうが動作は軽快。多分、Xposedのバージョンによるものかと。
		
