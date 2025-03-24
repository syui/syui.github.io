+++
date = "2025-01-21"
tags = ["ue5", "ue"]
title = "ue5のpixel streaming2に移行する"
+++

ue5のplugin(server)のpixel streaming2ですが、情報がどこにもないので移行方法を書きます。

- https://github.com/EpicGamesExt/PixelStreamingInfrastructure/blob/master/Docs/pixel-streaming-2-migration-guide.md

まず、2では`WebRTC`, `Matchmaker`が削除されます。そして、app-package.exeの引数がそのままでは動きません。また、serverのconfig.json, scriptが変更されています。

1. projectのpluginで`pixel streaming`をdisableにし、`pixel streaming2`をenableにする。

2. これをpackage buildして、app.exeを作ります。そして、引数は以下のようにしてください。

なお、sshなどで作業している場合はfirewallの許可が出ませんので、local-desktopで作業してください。または手動でruleを更新してください。

```sh
./$project/Windows/app.exe -PixelStreamingSignallingURL="ws://127.0.0.1:8888"
```

3. 次にserverの初期設定です。scriptがだいぶ変更されていますし、引数も変わっています。

```sh
# git clone https://github.com/EpicGamesExt/PixelStreamingInfrastructure.git
$ git clone --branch UE5.5 https://github.com/EpicGamesExt/PixelStreamingInfrastructure.git
$ cd PixelStreamingInfrastructure/SignallingWebServer/platform_scripts/cmd
$ ./setup.bat
$ ./start.bat
```

4. `config.json`の書き換えと起動。特に注意すべきは`http_root`です。Publicからwwwに変更されています。pathにも注意してください。

```sh
$ cd PixelStreamingInfrastructure/SignallingWebServer
$ vim config.json
$ npm start -- --public_ip localhost
```
