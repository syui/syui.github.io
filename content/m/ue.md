+++
date = "2024-01-29"
lastmod = "2024-02-01"
tags = ["ue", "m", "ue5"]
title = "ue"
slug = "ue"
+++

ここでは[epic games](https://www.epicgames.com/)の`unreal engine 5`の使い方をまとめます。

ブログで説明しづらい部分が多いので[blueprintue](https://blueprintue.com/profile/ai/)を参考にしてください。

- src : https://git.syui.ai/ai/ue

### for mac

mac(apple silicon)でも動作しますが、`package build`は鬼門です。絶対にやめましょう。時間がもったいない。

ue5は、基本的にwindowsのpakcage buildはすぐに通りますが、それ以外では難しいでしょう。

たとえ1度だけbuildが通ったとしても、もし開発を続ける場合、windowsとmacの両方で動作を安定させることはできません。

windowsで開発するのがおすすめです。macでの開発はやめておきましょう。

### vrm

https://github.com/ruyo/VRM4U/releases

[vroid](https://vroid.com/)を読み込むpluginである[vrm4u](https://ruyo.github.io/VRM4U/)を使用します。現在、[vroid sdk](https://github.com/pixiv/vroid-sdk-developers/discussions/118)というものも登場しています。

macで使用するには大変ですが`./Plugins/VRM4U/ThirdParty/assimp/lib/Mac/libassimp.a`を用意してください。独自buildが必要です。

https://ruyo.github.io/VRM4U/03_mac

### 調整

基本的には[Superhero Flight Animations](https://www.unrealengine.com/marketplace/ja/product/superhero-flight-animations)を使用してmodelの調整を行います。

`Superhero Flight Animations`は`./Content/SuperheroFlight/Blueprints/Characters/BP_Player_UE5`で`./Content/SuperheroFlight/Blueprints/Components/BP_SuperheroFight`を読み込んでいます。

`BP_Player_UE5`を開いて`SuperheroFlightComponent`のところが設定ファイルになっていて、例えば、`flying speed`、つまり、飛行速度などを変更できます。

基本的には、ここのassetsにanimationを入れることで機能します。もし機能しない場合の変更箇所を書きます。

![](/img/ue-2024-02-01-7.36.38.png)

いくつかのanimationは自分で用意したものに切り替えます。

`ABP_Player_ai`, `BP_Player_UE5`を新たに用意し、それを読み込むようにします。

`./Content/SuperheroFlight/Characters/Mannequins/Animations`をリターゲットしてanimationを作成、それをanim montageにします。

#### idle/walk

かっこいいものに切り替えます。おかしな移動になっていました。

- ABP_Player_ai :  `AnimGraph > Locomotion > idle`
- ABP_Player_ai :  `AnimGraph > Locomotion > walk`

![](/img/ue-2024-02-01-7.36.36.png)

使用しているanimationに`root motion`を設定します。

![](/img/ue-2024-02-01-7.36.37.png)

#### jump

かっこいいものに切り替えます。`root-motion`が動きませんでした。

- ABP_Player_ai : `AnimGraph > Locomotion > jump`
- ABP_Player_ai : `AnimGraph > Locomotion > idle`
- RTG_ai : `target`, `チェーンマッピング > root`を`FK > 平行移動モード > Globally Scaled`に設定

root motionをenableにしても動きません。原因はIKリターゲットしたときrootが動いていないために起こります。animationを開いてsrcとtargetを比較してみると、srcのほうはrootが動いていますが、targetのアニメは動いていません。具体的には、srcはlocationが変動しますが、targetは変動していません。

bone(ボーン)のrootを選択してFKの平行移動モードをGlobally Scaledに設定します。

これでtargetのrootが変動しているのを確認後、リターゲットし、montageを作成します。

![](/img/ue-2024-02-01-6.59.18.png)

#### hover

ものに当たった時のanimationです。

- ABP_Player_ai :  `EventGraph > Play hover fligh start montage notify event`

![](/img/ue-2024-02-01-7.31.12.png)

#### land

着地するときのanimationです。

- BP_SuperheroFlighComponent : `EventGraph > Hit Event Collapse Graph`

![](/img/ue-2024-02-01-7.14.49.png)

`Play anim montage`に指定したものを使用するように変更します。

指定したanim montageの通知に`BPANS_SetlsSuperheroloading`などを追加します。既存のanim montageである`./Content/SuperheroFlight/Characters/Mannequins/Animations/Flight/Land/`を参考にしてください。

![](/img/ue-2024-02-01-7.04.47.png)

#### sprint

ダッシュです。これは`BP_Player_UE5 > Input Event Graph > sprint`の最後に`Start Flight`を入れます。

- BP_Player_UE5 : `Input Event Graph > sprint`

### kawaiiphysics

https://github.com/pafuhana1213/KawaiiPhysics/releases

vrmの髪の毛などを動かすために使います。

- ABP_Player_ai :  `AnimGraph`

![](/img/ue-2024-02-01-7.24.20.png)

主に`hair1_08`, `hair1_09`, `hair1_10`を指定して各種limitを入れ、調整していきます。

limitは髪の毛が体を貫通しないようにするためのものです。主に`Spherical Limits`の丸形と`Capsule Limits`の筒型を使用します。大きさや傾きなどを調整してください。`head`や`hip`, `arm`を指定するといいでしょう。

#### sword

新しくswordのactor(static mesh)を作成し、collisionを作ります。

![](/img/ue-2024-02-01-7.36.35.png)

それを`BP_Player_UE5`に装備し、motionを作成し、キーに割り当てます。剣をしまうのはniagaraで作成しました。

<iframe src="https://blueprintue.com/render/cu104wg0/" scrolling="no" allowfullscreen width="100%" height="400px"></iframe>

by [ai](https://blueprintue.com/blueprint/cu104wg0/)

### varest

pluginである[varest](https://www.unrealengine.com/marketplace/ja/product/varest-plugin)のpostですが、macで動いたものがwindowsでは動きませんでした。ですが、windowsでイチから作成すると動きました。

ue5は`PATCH`に対応していません。この辺はapiを作り直さないといけないかもしれない。

<iframe src="https://blueprintue.com/render/4qo0qydu/" scrolling="no" width="100%" height="400px"></iframe>

by : [ai](https://blueprintue.com/blueprint/4qo0qydu/)

### login

login処理です。atprotoと連携できればいいなと考えています。

あと、ゲーム公開/非公開はaiのアカウントで判断しています。ある値がtrueなら公開、falseなら非公開です。ここをapiで変更すれば基本的にゲームの起動自体をコントロールできるようになってる。

<iframe src="https://blueprintue.com/render/9v24l5h6/" scrolling="no" allowfullscreen width="100%" height="400px"></iframe>

by : [ai](https://blueprintue.com/blueprint/9v24l5h6/)
