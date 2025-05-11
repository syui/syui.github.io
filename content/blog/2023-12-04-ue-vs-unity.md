+++
date = "2023-12-04"
tags = ["ue5","3d"]
title = "ue5を触ってみた5 (vs unity)"
slug = "ue-vs-unity"
+++

今日もue5を触ってやったことや今後やりたいこと、unityとどちらがいいのかなどを書いていきたいと思います。

1. post precess volumeを作成

2. その領域に入るとshaderが適用されるようにできる

はずなんだけど、なんかおかしい。`post process volume`の詳細がでてこないことに気づいた。ただ、`PB_Player`のcameraからpost processの項目にアクセスできるんだけど、mac-m1限定の問題かもしれない。

> 追記 : イチから作り直したら詳細が出てきた。わけがわからない。そもそも詳細が出てこない状況が普通は考えられないので、おそらくバグだったんだと思う。結局プロジェクトを作り直さないとダメだったのか。

しかも、色々やりすぎてpackage buildが通らない。これはvroidの問題だと思う。ファイルが多すぎて整理できていないので、もう一度イチから作り直すことにしよう。

> 追記 : この問題はxcodeを最新版にしてassimpをrebuildすると解消しました。ただそれだけではmacの`._*`ファイルが原因でbuildが通らないのでfindで削除します。

```sh
pkg=yui
pdr=/Volumes/ssd/project
pkg=$pdr/$pkg
rm -rf $pkg/Plugins

open $pdr/VRM4U_5_3_20231126.zip;sleep 15;
mv $pdr/Plugins $pkg/
cp -rf /Volumes/ssd/git/assimp/build1/lib/libassimp.a $pkg/Plugins/VRM4U/ThirdParty/assimp/lib/Mac/

rm -rf $pkg/Binaries
rm -rf $pkg/Intermediate
rm -rf $pkg/Plugins/VRM4U/Binaries
rm -rf $pkg/Plugins/VRM4U/Intermediate

find $pkg/ \( -name '.DS_Store' -or -name '._*' \) -delete -print;
```

まだエラーが出ます。`x86_64`がないとか言われますが、使用しているのは`arm64`です。

```sh
# https://forums.unrealengine.com/t/linker-error-undefined-symbols-for-architecture-x86_64-while-packaging/103451
UATHelper: パッケージ化 (Mac): ld: symbol(s) not found for architecture x86_64
```

```sh
$ gcc -v
Apple clang version 15.0.0 (clang-1500.1.0.2.5)
Target: arm64-apple-darwin23.1.0
```

ここで`make -j4`でmakeして再びvrmを読み込んだら通った。

3. オーバーレイマテリアルというものがue5.1から導入されようで、それを使ってキャラにエフェクトを追加してみた。普通に`SK_xxx`の詳細に`レンダリング -> オーバーレイマテリアル(Overlay Material)`みたいな項目があるのでそこに追加。

![](https://raw.githubusercontent.com/syui/img/master/other/ue5_ai_20231203_203305.png)

### vrm4u err for mac

package buildのerrをまとめます。全てがvrm4uによるものだったので回避した方法をまとめます。

これはmacで作成される`._xx`ファイルが関係しています。削除すると通ります。

> Plugins/VRM4U/._VRM4U.uplugin: '0x00' is an invalid start of a value.


`ABP_VRoidPostProcess...`などからerrが出ます。したがって、これらのファイルの削除を行います。同様のerrが次回ビルド時にも出てくるので他のファイルも削除する必要があります。例えば、`VRM4U/Content/Maps`, `VRM4U/Content/Util/Actor/latest`などです。

> Plugins/VRM4U/Content/Util/Actor/latest/ABP_VRoidPostProcess...

`x86_64`関連のerrが出ます。`arm64`なのでこの処理自体がおかしいため、これをやめさせないといけません。`assimp`を`make -j4`でmakeして再びvrmを読み込んだら通ります。正直よくわからない。

> UATHelper: パッケージ化 (Mac): ld: symbol(s) not found for architecture x86_64

vrmをue5で使うこと自体が荒業で、それをmac-m1で使うとなると相当に大変です。

- https://github.com/ruyo/VRM4U/issues

### vs unity

ue5とunityのどちらがいいか。

ue5というかunrial engineなんですが、ここではue5とします。

で、最近ue5とunityを触ってみて、どちらがいいのかを書いていきたいと思います。

結論から言うと、ue5です。圧倒的にue5がオススメです。

なぜかというと、見た目ですね。モデルを表示したときの見た目がぱっと見でunityは厳しいなと思ったので、ue5を試したのですが色々な意味ですごいです。

ただ、ue5は記事が全く見当たらず、動画もあまりないようで、使ってる人がそこまで多くない印象があります。これは大きなマイナス要素になり得ます。初心者はわけがわからない。そういう環境だと、正直、通常だとおすすめはしづらい。しかし、そのデメリットを上回るくらいue5のほうがおすすめです。

では、blenderとunityだとどうでしょう。私は、unityよりblenderを触っていたときのほうが気持ちが良かったので、blenderをおすすめします。

1. ue5

2. blender

3. unity

ただ、ロゴがかっこいいのはunityです。今も3dはunity-iconを使用していて、この辺は難しいのですが、私はfont-awesomeを使ってるのでfreeで使える3dを示すicon-fontはこれくらいしかいいのがなかったのです。まあ、いつまでもunityと関係ないのにunityのicon-fontを使うのもあれなので、そのうちcubeに変更しようかなと思います。

- <i class="fa-brands fa-unity"></i> unity

- <i class="fa-solid fa-cube"></i> cube

### 今後やりたいこと

ゲームのコンセプトは割と頭の中で決まってて、面白いと思ったことをやる感じ。

1. アイが宇宙空間で艦隊と戦っている。ここではゲームでできるアイの最大火力を発揮できる。ユーザーは最初からキャラを操作できる。操作説明などはあえてなし。艦隊を攻撃するか、自由に動き回るのか、なにをするのかもすべてユーザーに任せられる。この状況は最初の5分間続く。

- (1) 敵船からの攻撃、巨大なレーザー砲。ダメージなし。爆発あり。

- (2) こちらの攻撃、当たると敵船が間をおいて大爆発。当たった直後は衝撃派や画面を一瞬明るくする。ゆっくりと落ちて消えていく演出あり。

![](https://raw.githubusercontent.com/syui/img/master/other/ue5_ai_20231204_0001.jpg)

2. 最初の5分が終わると、ムービーに突入する。なにかがおかしくなり、力が弱まるのを感じる。突然、空を飛べなくなる。近くの星に落ちていくアイ。目が覚めると、海辺と山々が見える。手を広げるが力が使えなくなったようだ。アイは歩き始める。

3. ここからユーザーは操作可能。近くのマシロタウンにつくと人に話しかけられる。その格好はなにかあったのと女の子に言われゲーム中に使用される新衣装に変更。靴を履いてるムービー、操作可能。

4. ゲームは非常に広大なフィールドに毎日ドロップする3つの宝箱とモンスターがいる。難易度は非常に高く設定する。死んだら終わりその日は終了する。この辺はゲームコンセプトになるんだけど、何もないところをずーっと走ってる感じで、短縮も面白いことも用意しない。なにも考えずプレイしてほしい。

> このゲームのコンセプトは、なにもしない、なにも考えないである。そういった時間が人には必要で、このゲームはそのためのきっかけを作りたいと思っている。例えば、ユダヤの教えに安息日(シャバット)というものがあり、なにもしない日のこと。時間を定期的に作るものである。

5. 課金ではカード(能力)と武器が追加。3回まで復活できるようにする。

6. 物語を作る。この星は中世の地球をモデルに各地域を作成。天動説を信じている世界で不思議な旅ができるというもの。旅の最終地点にいるボスを倒すと、アイは力を取り戻して、宇宙に帰ることができる。すべてユーザーの自由意志と自由操作による。

7. 物語の続き。星を平和にしたアイは、また戻ることができる。戻る度に発展していく様子を見ることができる。これがアップデートになる。

