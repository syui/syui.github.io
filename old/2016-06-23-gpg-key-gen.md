+++
date = "2016-06-23"
tags =  ["memo"]
title = "gpg-key-gen"
slug = "gpg-key-gen"
+++

GitHubがGPGでの署名にバッジを付けるようにしたようです。

[https://help.github.com/articles/signing-commits-using-gpg/](https://help.github.com/articles/signing-commits-using-gpg/)

したがって、`~/.gitconfig`に設定してみます。鍵は基本的にデフォルトでOKです。長ければ長いだけGitHubの処理能力を奪いますので、特にこだわりがなければデフォルトで。

```bash
$ brew install gpg2
$ alias gpg=gpg2
$ gpg --gen-key
$ gpg --list-keys
```

ここで、`pub foo/XXX 20160101`の`XXX`の部分がIDになります。

```bash
gpg --armor --export $ID | pbcopy
```

コピーした公開鍵をGitHubのSSH, GPGのところで設定します。

[https://github.com/settings/keys](https://github.com/settings/keys)

あとはGitの設定です。

```bash
$ git config --global gpg.program gpg2
$ git config --global user.signingkey $ID
$ git config --global commit.gpgsign true
```
