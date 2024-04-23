+++
date = "2018-08-04"
tags = ["pwsh","scoop"]
title = "windowsはパッケージマネージャーのscoopが便利"
slug = "pwsh-scoop"
+++

## 導入

windowsって、良さげな環境を構築するのが面倒ですよね。

理由の一つとしてあげられるのが、やはりpackage managerではないでしょうか。cuiで使えるいい感じのものを探すだけで一苦労なんですよ。

それ以外にも色々ありますが、例えば、windows標準のcmdのconsole(terminal)は使いづらいですし、pwshというshellもいまいちですし(私は各コマンド名が気に入りませんよ)。

しかし、package managerというのが一番大きい。

それさえあれば、ある程度は、packageを入れて解決できると言うか、扱いづらさにおいては割と緩和できると思うんです。hackerなどのcuiをメインに扱う人種には、基本コマンドが入っていないのが一番つらいと思うんですよね。

ということで、今回、windowsで一番オススメなpackage managerを紹介してみます。

ちなみに、package managerを扱う場合、shellのpathとかも重要になりますので、`pwsh`の使い方をある程度理解している人を対象としています。

特に、`scoop`は環境を汚さないので、ディレクトリ構造とか把握しておく必要はあるかもです。

## scoop

[lukesampson/scoop](https://github.com/lukesampson/scoop)

現時点で一番オススメなのは、`pwsh`+`scoop`を使った環境です。

winには、`cygwin`や`msys`, `choco`など色々ありますよね。あ、cygwinはaptで、msysはpacmanで、chocoはpackage managerそのものなんでバラバラですけど、これらを駆使した環境っていうことです。分かりづらいか。

話を進めると、msysとかは、minttyとかのconsole環境も相まって愛されてる感じなんですが、`pwsh`はかなり嫌われちゃってるみたいなんですよね。いや、`pwsh`は単なるshellなんで他のterminal上でも実行できるんですけど、あちらはセット販売してますから、色々と便利なんですよね。

私は、`pwsh`は現時点ではかなり充実していて、シームレスにwindowsのsystemにアクセスできるコマンドを実行できる点とかが気に入ってるわけですが、cygwinとかmsysとかはなかなかそうは行きませんよね。

ということで、shellは`pwsh`を採用するとして、package managerは`scoop`という構成がおすすめです。

やってみた

<script src="https://asciinema.org/a/kcpfgCl3tN7QDkXUoSVxYyWSX.js" id="asciicast-kcpfgCl3tN7QDkXUoSVxYyWSX" async></script>

基本的には、`~/scoop/shims/`にシンボリックリンクかな、それが置かれてます。実体は`~/scoop/apps/$APP_NAME/current/bin/$APP_NAME.exe`とかにある感じかな。

なので、

```sh
$ scoop install curl

$ cd ~/scoop/apps/curl/current/bin

$ ./curl.exe github.com
```

とかしても実行できる感じですね。まあ、appごとに構成は変わってきますが。

もし仮にデフォルトのbucketにpackageが見つからなければ、

```sh
$ scoop bucket add extras

$ scoop install mpv
```

とかやって追加してくと、扱えるpackageが増えます。

そんな感じで、`scoop`の紹介終わります。

windowsは最高です!

## 動画

ちなみに、gifっぽいterminal movieは久しぶりに`$ asciinema rec`とか使ってみました。

```sh
$ asciinema rec
C-c

$ asciinema upload /path/to/xxx
```

みたいな感じでやれば、webにuploadされるんで、urlにアクセスすればいいです。その前にaccountを取っておく必要がありますが。

