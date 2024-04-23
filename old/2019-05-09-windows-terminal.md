+++
date = "2019-05-09"
tags = ["windows"]
title = "windows terminal (preview)を試してみる"
slug = "windows-terminal"
+++

microsoftがwindows terminalを開発してるみたいで、今風のターミナルなので便利そうです。

https://github.com/Microsoft/Terminal

(というより、windowsは、これまでのターミナルがあまりにも酷すぎた気がする)

VS2019でもbuildが可能ですが、いくつかのエラーが修正できませんでしたので、正常に起動しなかった。よって、VS2017でやったほうがいいです。

```sh
$ git clone https://github.com/Microsoft/Terminal
$ cd Terminal
$ git submodule update --init --recursive
$ scoop install nuget
$ nuget restore OpenConsole.sln
# VS2017でOpenConsole.slnを開いて、ソリューション全体をbuildします。
# ビルドが終わったら、当該ソリューションプロジェクト"OpenConsole46"を右クリックでデプロイ(ソリューションの配置)を実行します。
# すると、スタートメニューに"Windows Terminal Preview"が追加されます。
```

C+tでタブを開きます。pwshならC+lとか動きます(前のターミナルも動いてたっけ?)。

![](https://files.mastodon.social/media_attachments/files/014/391/900/original/583f95f2de71535b.png)

なお、`ソリューションの配置`については、Windowsの開発者モードを有効にした上で、`Windows 1903 (build >= 10.0.18362.0)`が必要なので、プレビュー版のWindowsにアップデートしてバージョン要求を満たす必要があります。(Windows Insider Programに登録して、プレビュー版のWindows Buildを試す必要があります)

guide : https://github.com/microsoft/Terminal/issues/489

