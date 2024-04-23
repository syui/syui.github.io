+++
date = "2020-01-26"
tags = ["ios"]
title = "iosのgoodreaderでsftpのprivate-keyが読み込めない問題"
slug = "goodreader"
+++

opensshのsftpが前提です。

iosのgoodreaderでsftpのprivate-keyが読み込めませんでした。

これはmacのssh-keygenで作成されるコマンドの出力が変更されているので、昔作ったキーでは読み込めますが、新しく作ったキーは読み込めなかったのです。よって、キーを作り直すか、キー自体を編集することで解決。

### 問題の答え

```sh
# 公開鍵、秘密鍵の作成
$  ssh-keygen -t rsa -b 4096 -m PEM -f ~/.ssh/goodreader

# serverにpublic-keyを登録
$ ssh-copy-id -i ~/.ssh/goodreader.pub user@192.168.1.11 -p 22

# ~/.ssh/goodreader
# このprivate-keyをiosのgoodreaderに持っていく
```

### 問題の内容

私はいつもこんな感じでssh-keyを登録したり、変更したりします。単純ですね。

```sh
$ ssh-keygen -f ~/.ssh/$KEYNAME
$ ssh-copy-id -i ~/.ssh/$KEYNAME.pub user@localhost
```

簡単に説明すると、サーバーの`/etc/ssh/sshd_config`にて設定される`.ssh/authorized_keys`に公開鍵が登録される仕組み。

この公開鍵に対応する秘密鍵を共有すれば、大抵はサーバーにアクセスできる。よって、iosのgoodreaderにもこんな感じで使える秘密鍵(.ssh/authorized_keysに書いた公開鍵に対応するやつ)を使えばアクセスできるはずなんですが、できなかった。

```sh
$ cat ~/.ssh/private-key
-----BEGIN OPENSSH PRIVATE KEY-----
$ cat ~/.ssh/private-key-old
-----BEGIN RSA PRIVATE KEY-----
```

> デフォルトは、RFC 4716 - The Secure Shell (SSH) Public Key File Format のフォーマット。これは RFC で定められた秘密鍵のフォーマットだ。
>
> これまで使われていた PEM フォーマットは、Privacy-Enhanced Mail - Wikipedia にもあるとおり、もともとセキュアなメールシステムの RFC 向けに開発された。 しかし、これらの RFC は一つのルート認証局の PKI に基づいたもので、運用の問題で実現することがなかった。
> 
> しかし、PEM というフォーマットは秘密鍵、公開鍵のフォーマットとして広く使われたようだ。
> 
> RFC 4716 のような仕様が策定され、今回のようにデフォルトの出力も切り替えられているため、PEM もいよいよその役割を終えるのかもしれない。

https://amasuda.xyz/post/2019-07-27-ssh-keygen-openssh-to-pem/

goodreaderはこの辺対応していない感じ？なので、macのデフォルトで作ったキーが使えないためハマる人とか多そう。(自分もハマった

