早速、ai`bot`の中身を見ていきましょう。

ai`bot`は`archlinux` server(サーバー)、`rust`でcompile(コンパル)されたbinary(バイナリ)から動いています。

つまり、`archlinux`+`rust`が中身と言えます。

簡単に`archlinux`と`rust`の説明を行います。

`archlinux`は、linuxディストリビューションの一つ、osのことです。linux kernel(リナックス・カーネル)で動いているので、`arch linux`と言います。

`archlinux`は、シンプル必要最小限のosというイメージです。source(ソース)をbuild(ビルド)することもできますし、そういう仕組がAURにありますが、buildされたbinaryをdownloadすることもできます。ただし、パッケージ数はそれほど多くはありません。

`rust`は、様々なプログラミング言語の中で非常に難易度が高い言語と言われています。一度構築すると安定して動作するけど、動かすまでに時間がかかるというイメージです。

この章では、簡単に`archlinux`と`rust`の始め方を紹介します。

#### 用語の解説

|用語|意味|
|---|---|
|server(サーバー)|大体は応答に応じる外部パソコンのこと|
|linux(リナックス)|大体はlinux kernelかosのこと。`arch`のほかに`gentoo`, `ubuntu`などがある|
|build(ビルド), compile(コンパイル)|ソースコードをそのコンピュータで実行できる形式に変換すること|
|binary(バイナリ)|buildしてできた実行形式のファイルのこと。`bin`と略される|
|deploy(デプロイ)|大体はbuildしたファイルをserverに展開すること|
|source(ソース)|人間が読めるプログラムコードのこと。`src`と略される|
|package(パッケージ)|アプリのこと。`pkg`と略される|
|rust(ラスト)|プログラム言語の一つ。cの代わりと目されている。linuxもcからrustに書き換えられている最中|
