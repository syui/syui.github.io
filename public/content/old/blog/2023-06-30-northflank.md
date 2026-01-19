+++
date = "2023-06-30"
tags = ["northflank","heroku"]
title = "northflankでsqliteをbackupする方法"
slug = "northflank"
+++

northflankが便利でapiはこちらで立てることが多いですが、northflank/cliが充実してきたので、やり方を紹介します。

```sh
$ sudo npm i -g @northflank/cli
$ northflank login
$ northflank exec service --project $project --service $service --cmd "cp -rf /data/new.sqlite /data/`date '+%Y%m%d'`.sqlite"
```

tokenの権限で詳細に設定できます。volumeをbackupすることもできますが、sqliteならnorthflank/cliでcmdをcronすればいいでしょう。

https://northflank.com/docs/v1/api/execute-command
