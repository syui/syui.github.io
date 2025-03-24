+++
date = "2018-07-31"
tags = ["mac"]
title = "macでpasswdをresetする"
slug = "mac-single-mode"
+++

macは`Cmd+S`を押しながら起動するとシングルモードで起動します。

ここでは、diskの`/`などをmountしてpasswordなどをresetできたり、復旧に必要な環境を実行できたりします。

まずはpasswordをresetする方法です。

```sh
$ mount -uw /
$ launchctl load /System/Library/LaunchDaemons/com.apple.DirectoryServices.plist
$ dscl . -passwd /Users/username newpassword
```

(現在もこれが有効なのか知りませんが、昔は有効でした)

次に、シングルモードから復旧に必要な環境を立ち上げる方法です。

```sh
$ mount -uw /
$ launchctl load -w /System/Library/LaunchDaemons/*.plist
```

`/System/Library/LaunchDaemons`は起動に必要な設定が入っています。なので、それをloadすることで普段使ってるユーザーのGUIがそのまま立ち上がるというわけです。

ここで、もし通常ユーザーの起動に必要なplistを間違ってunloadしてしまい起動できなくなってしまっている場合などは、そのGUIから端末を起動し`$ sudo launchctl load -w /path/to/foo.plist`などをやるといいですね。

```sh
$ sudo launchctl list
```
