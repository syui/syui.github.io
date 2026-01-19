+++
date = "2024-01-29"
lastmod = "2024-05-27"
tags = ["ue", "m", "ue5"]
title = "ue"
slug = "ue"
+++

ここでは[epic games](https://www.epicgames.com/)の[unreal engine 5](https://www.unrealengine.com/ja/unreal-engine-5)の使い方をまとめます。現在はversionの`5.4.2`に追従しています。

- [ue 5.4.4](https://dev.epicgames.com/documentation/ja-jp/unreal-engine/unreal-engine-5.4-release-notes)
- [ue 5.3.2](https://dev.epicgames.com/documentation/ja-jp/unreal-engine/unreal-engine-5.3-release-notes)

ブログで説明しづらい部分が多いので[blueprintue](https://blueprintue.com/profile/ai/)を参考にしてください。

- repo : https://git.syui.ai/ai/ue
- blueprint : https://blueprintue.com/profile/ai

## 無料

使用しているassetなどです。

- asset : [city sample](https://www.unrealengine.com/marketplace/ja/product/city-sample)
- asset : [game animation sample](https://www.unrealengine.com/marketplace/en-US/product/game-animation-sample)
- plugin : [pixel streaming](https://dev.epicgames.com/documentation/ja-jp/unreal-engine/pixel-streaming-in-unreal-engine)
- plugin : [vrm4u](https://github.com/ruyo/VRM4U)
- plugin : [kawaiiphysics](https://github.com/pafuhana1213/KawaiiPhysics)
- plugin : [varest](https://www.unrealengine.com/marketplace/ja/product/varest-plugin)

## 有料

おすすめのassetです。

- asset : [superhero fligth animations](https://www.unrealengine.com/marketplace/ja/product/superhero-flight-animations)
- asset : [dynamic volumetric sky](https://www.unrealengine.com/marketplace/ja/product/dynamic-volumetric-sky/)
- asset : [ocean waves](https://www.unrealengine.com/marketplace/ja/product/ocean-waves)
- plugin : [http websocket helper](https://www.unrealengine.com/marketplace/en-US/product/http-websocket-helper)
- plugin : [jsonparser](https://www.unrealengine.com/marketplace/ja/product/jsonparser)

## [asset] vrm4u + superhero fligth animations 

- [vrm4u](https://github.com/ruyo/VRM4U)
- [superhero fligth animations](https://www.unrealengine.com/marketplace/ja/product/superhero-flight-animations)

`ue5.4`がリリースされました。updateしてみましたが、色々と動かなくなっています。そして、前よりも頻繁に落ちるようになりました。結論として`5.3`を使いましょう。

動かなくなった箇所は以下の通り。

1. 飛行するとカメラがモデル内部に入り込む / ABP_flying, apply additive, scale
2. 飛行の上下左右の向きが反映されない / ABP_flying, rtg

今回、pluginとengineをupdateしたところ、髪の毛が動くようになりモデルの内部に入り込むことがなくなりました。以前は[KawaiiPhysics](https://github.com/pafuhana1213/KawaiiPhysics)を使って実現していました。なお、ue5.3でもこの現象がなくなっていることを確認しています。とはいえ、modelやplugin, engineなどあらゆる依存関係が考えられるので、あくまで個人的なケースです。

ue5.4で最初から構築した手順を記録します。

まずは[vrm](https://vrm.dev/)を動かせるようにします。基本的なコントローラーは`superhero flight animations`を使用します。

`ai.vrm`をimportするとして重要なファイルは以下の通り。

```sh
# c:/project/yui

Content
├─SuperheroFlight
│    ├─Blueprints/Characters/BP_Player_UE5
│    └─Characters/Mannequins/Animations/ABP_Player_UE5
└─yui
    ├─BP_Player_ai
    ├─anim
    │   └─ABP_Player_ai
    └─model
        ├─SK_ai
        └─RTG_ai

Pluings
    └─VRM4U
```

まず`Content/yui/model`に`vrm`を入れます。インポートします。マテリアルタイプは`subsurface`を使用します。

![](/m/post/ue/ue5_2024-05-28_125510.png)

`Content/yui/model/RTG_xxx`を開きます。

![](/m/post/ue/ue5_2024-05-28_130045.png)

ソースに`SuperheroFlight`のモデルを選択して、調整します。アニメが動くか確認してください。ポーズも重要です。

`ABP_Player_UE5`を右クリックしてリターゲティングします。先ほど設定した`RTG_xxx`を指定してください。すべてのアニメを選択してリターゲティングを実行。`Content/yui/anim`に保存します。そこに`ABP_Player_xxx`ができます。ファイルの名前と場所はできる限り変更しないでください。バグって動かなくなり、再度リターゲティングしても動かないanimが生成されます。こうなるとvrmをインポートしなおさなければなりません。

- `Content/yui/anim/ABP_Player_xxx`

v5.3では一括で全てリターゲティングできなかったのでanimを探して一つずつやっていました。これがasset側の変更かengine側の変更かはわかりません。

次に`Content/SuperheroFlight/Blueprints/Characters/BP_Player_UE5`を複製して、`Content/yui/BP_Player_xxx`を作ります。そこで`ABP_Player_xxx`を読み込むようにします。MapのGameModeで`Content/yui/BP_Player_xxx`を使うようにします。

```sh
Content/SuperheroFlight/Blueprints/Characters/BP_Player_UE5 -> Content/yui/BP_Player_xxx
```

![](/m/post/ue/ue5_2024-05-28_151451.png)
![](/m/post/ue/ue5_2024-05-28_151511.png)

ここでそれぞれのアニメーションを当てておきます。

![](/m/post/ue/ue5_2024-05-28_151839.png)

### [issue] 飛行するとカメラがモデル内部に入り込む

再生してみると飛行が正常に動きません。カメラがモデル内部に移動します。これは`scale`が間違っているためです。`apply additive`が原因でそこのscaleを変更すると回避できます。

また代わりに`blend bone by channel`を使用することでも回避できます。

これはv5.4で発生し、v5.3では発生しません。

- `Content/yui/anim/ABP_Player_xxx`

![](/m/post/ue/ue5_2024-05-28_132554.png)
![](/m/post/ue/ue5_2024-05-28_134214.png)
![](/m/post/ue/ue5_2024-05-28_134235.png)

また、`flying > flying state machine -> idle/hover`の`look_at`にエラーが出てるので`bone`の`j_bip_c_neck`を入れます。

これらの飛行中の問題については、リターゲットしない方法でmeshを活用することで問題は発生しません。詳しくは`game animation sample`との統合を見てください。

### [issue] 飛行の上下左右の向きが反映されない

飛行すると向きが一定になります。視点を動かしても変わりません。

通常だと視点を下に向けると、頭も下を向いて移動しますが、それがありません。下に移動してもずっと横飛行を行います。

これもv5.4で発生し、v5.3では発生しません。

### [issue] vrm4uのmaterialについて考える 

私は`SubsurfaceProfile`を使用していますが、他のタイプだと影(shadow)と反射(light)の問題がかなり強く出てしまい、あらゆる場面で常用できません。移動したら背景の加減でおかしくなるなど問題が多いのです。

そこで完全に影響を受けない`MToon Unlit`を使用することも考えられます。一部分だけ他のタイプのmaterialを利用して調整していきます。この場合の肌の色を以下に調整するといいでしょう。

<iframe src="https://blueprintue.com/render/wi2aobel/" scrolling="no" width="100%" height="400px"></iframe>

### [close] buildすると髪が動かなくなる

vrm4uがpackage buildすると髪の毛が動かなくなっていました。

これを動かせるには`ABP_Post_${model_name}`を編集して、`VrmSpringBone`で`Vrm Meta Object:VM_${model_name}_VrmMeta`を指定します。

![](/m/post/ue/ue5_2024-07-06_125510.png)

これでこの問題は解消されました。この`issue`を閉じます。

### [issue] buildすると髪が動かなくなる

package化すると髪が動かなくなります。これは`ue 5.3`でも発生し、vrm4uのversionの問題です。

ediorで確認すると動くのですが、pacakge build後に動かなくなるのです。

これは、buildとeditorでは実行順が異なっているためです。

- https://zenn.dev/daichi_gamedev/articles/unreal-engine-beginplay-order
- https://zenn.dev/posita33/books/ue5_starter_cpp_and_bp_002/viewer/chap_01-06_cpp-package_project_settings

基本的にpackageではplayerが最後に呼ばれます。editorは4番目くらいに呼ばれます。つまり、これを前段階で呼ばれるようにすれば髪の毛が動くようになります。

私はtitle画面から`open level`で最初のステージを呼び出しているのですが、これがよくありません。ue5はmapを一つとして想定しているようで、それ以上読み込む場合はproject settingでpackage化されたbuildに含めるmapを追加する必要があります。titleを挟まないmapを`stand alone`でpreviewして確認します。

![](/m/post/ue/ue5_2024-05-30_132917.png)

この問題はそれでも完全に治らなくて度々、髪の毛が動かなくなっていました。game modeの`BP_Player`が`spawn`されていないからではないかと色々やってみたのですが治りませんでした。`superhero fligth animations`をupdateしたら治ったと思いましたが60秒後に動かなくなります。

そこでmapのbpにevent tickを追加して、そこで`dealy`, `add child actor component BP_Player`することで無理やり動かしています。これは良い方法ではありません。また、stand aloneとpackageの動作が大きく異なります。stand aloneでうまくいってもbuildすると上手くいかないのが基本です。簡易な方法、負担が少ない方法はことごとく動きません。event beginでは対処できません。

なお、ここでadd child actorする`BP_Player`はmeshとmotionさえあれば良く、eventは必要ありません。削っておきましょう。そして、title.mapにBP_Playerを置きます。

ちなみに、必殺技のシーケンスを呼び出したときだけ動く様になるのは変だなと思っていましたが、BP_Playerがその時にmapにspawnされるからだと思います。つまり、長時間設定のシーケンサを置いておけばうまくいくかとも思いましたが、うまくいきませんでした。どうやらmapに置くだけではダメでゲーム中に呼び出す必要があるみたいです。

このような解決法を取るなら[KawaiiPhysics](https://github.com/pafuhana1213/KawaiiPhysics)を使いましょう。そのほうが安定します。

### [issue] 5.4でanimリターゲットすると頭の動きがおかしくなる

これは`Source IKRig : IK_UE4_Mannequin`などを使用すると正常になりますが、それではABP_Playerとの互換性などが損なわれます。つまり、`BP_Player`でanimを再生できなくなるということです。

![](/m/post/ue/ue5_2024-07-06_025510.png)

この問題の解決は少し複雑で録画からanimを作成しなければなりません。しかも普通の作り方ではありません。

まずは`Source Preview Mesh`を取りたいanim元にします。そして、使用したいanimをassetブラウザから再生します。

その後、`Source IKRig : IK_UEFN_Mannequin`などを指定してやると、anim元を再生しながらも`IK_UEFN_Mannequin`を使用することができます。この状態では不思議なことにanimが正常に再生されています。

そこで録画ボタンを押してanimを作ります。するとABP_Playerで使えるanimが生成されます。

### [idea] 作り直すもの

今まで実装開発してきたものはいくつかありますが、代表的なものを挙げます。記録のため動画にしておきます。

<video controls style="width:100%;"><source src="https://git.syui.ai/syui/media/raw/branch/main/yui_20240621.mp4"></video>

- account login system
- account item system
- character lv system
- character skill
- character sword & collision

一気に解説します。移動すると経験値が入ります。Lv1になると変身できるようになります。変身すると飛行できるようになります。飛行できる時間はlvに応じて変化します。特殊なアイテムを取るとスキルを覚えます。スキルにはクールタイムやcollisionなどが設定されており、敵が吹っ飛びます。剣のモーションは原作を再現しています。原作では輪が剣になりますので、剣を登場させたときは輪を消さなければなりません。meshを入れ替える処理などを書いています。アイテム画面やストーリー進行などもapiと連携するシステムを作りました。

これらを全部作り直すことになります。

## game animation sample

- [game animation sample](https://www.unrealengine.com/en/blog/game-animation-sample)
- [superhero flight animations](https://www.unrealengine.com/marketplace/ja/product/superhero-flight-animations)

今回は`game animation sample`と`superhero flight animations`を統合してみました。今までのモーションに加えて空を飛べるようにしたのですが、違和感ない形で自動的にブレンドされます。これは想像以上に大変なことをやっているので`5.4.2`に追従したほうが良さそうです。

ただ、今まで開発実装してきたものがすべて作り直しになります。

インポートできないのかと思われるかもしれませんが、ue5にそんなことできません。動かなくなります。仮に動かせたとしても、おそらく、作り直したほうが早いでしょう。

`game animation sample`と`superhero flight animations`の統合を解説します。

基本的には`BP_SandboxCharacter`にeventの`IA_Sprit`で`anim instance class(ABP_Player)`を指定しますが`BP_Player_UE5`から様々な設定や変数を持ってきて動くように改変していきます。

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-21_025510.mp4"></video>

<iframe src="https://blueprintue.com/render/7z11v96t/" scrolling="no" width="100%" height="400px"></iframe>

## custom gravity

重力をactorに設定し、月の上を歩けるようにします。`gravity direction`を使います。

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-21_225510.mp4"></video>

youtube : [Unreal Engine 5 Tutorial - Custom Gravity UE5.4 Preview](https://www.youtube.com/watch?v=CZK7QplEbJs)

基本的には`bp_actor`を作成し範囲を設定します。`bp_actor`を置いたとき惑星(bp_planet)に親子付けするといいですね。この場合はlocationは`0`, scaleは`1.1`を設定します。

動作は`bp_player(bp_character)`のeventで設定します。具体的には`actor begin`から`gravity direction`します。

gravity directionを無効にする方法が用意されていないようなので、`actor end`で`destroy actor`して`restart player`しています。

<iframe src="https://blueprintue.com/render/tybb0lyd/" scrolling="no" width="100%" height="400px"></iframe>

https://dev.epicgames.com/community/learning/tutorials/w6l7/unreal-engine-custom-gravity-in-ue-5-4

## city sample

今回は、[city sample](https://www.unrealengine.com/marketplace/ja/product/city-sample)と[game animation sample](https://www.unrealengine.com/marketplace/en-US/product/game-animation-sample)を統合する方法を紹介します。どちらも`epic games`が提供しているため無料で使えます。最初のスターターキットとして使用されることが多くなるはずです。

- [city sample](https://www.unrealengine.com/marketplace/ja/product/city-sample)
- [game animation sample](https://www.unrealengine.com/marketplace/en-US/product/game-animation-sample)

city sampleのほうが複雑なので、city sampleをベースにgame animation sampleをコピーする形で統合します。

まずコピーするファイルです。

```sh
# game-animation-sample
Content
Binaries
└─Win64
    └─GameAnimationSampleEditor.target
```

編集するファイルです。これはcity sampleの方を編集します。

```sh
# city-sample
city-sample.uproject
Binaries
└─Win64
    └─UnrealEditor.modules
Config
   └─DefaultGameplayTags.ini
```

まずrootにある`${project_name}.uproject`にgame animation sampleのpluginを追加します。これはコピー側のuprojectを参照してください。長くなるのでここでは全て列挙していません。

```json:city-sample.uproject
"Plugins" : [
    { "Name":"ModelingToolsEditorMode","Enabled":true,"TargetAllowList":["Editor"] },
    .
    .
    .
]
```

次に`Binaries/Win64/UnrealEditor.modules`もコピー側のものを見て追記します。

```json:city-sample/Binaries/Win64/UnrealEditor.modules
{
  "BuildId": "0000000",
  "Modules": {
    "CitySample": "UnrealEditor-CitySample.dll",
    "CitySampleAnimGraphRuntime": "UnrealEditor-CitySampleAnimGraphRuntime.dll",
    "CitySampleEditor": "UnrealEditor-CitySampleEditor.dll",
    "GameAnimationSample": "UnrealEditor-GameAnimationSample.dll"
  }
}
```

次に`Config/DefaultGameplayTags.ini`もコピー側を見て追記します。

```sh:city-sample/Config/DefaultGameplayTags.ini
+GameplayTagList=(Tag="GameplayCue.ContextualAnim",DevComment="")
+GameplayTagList=(Tag="MotionMatching",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Default",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Idle",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Loops",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Pivots",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Starts",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Stops",DevComment="")
```

大体こんな感じでやればgame animation sample(ABP_SandboxCharacter)が動くでしょう。

city sampleはnightmodeのblueprintにerrが出ます。これは`set daytime`, `set nighttime`を飛ばしてやればでなくなります。昼夜の切り替えはこちらの記事が参考になります。

https://qiita.com/EGJ-Nori_Shinoyama/items/429804dc2d7cc99fc0ea

city sampleは何かと問題が多いassetですが、その一番の原因は`one file per actor`を採用していて、外部アクタの読み込みを変更できないからでしょう。

基本的にlvをcopyしたものを使用し、バグが発生したときは`Content/_ExternalActors_/Map/`にある自身が使っているmapのフォルダを削除しましょう。その後、またlvをcopyしてそれを使います。こんな方法しかありません。

## ocean waves

星と海と空をつなげるには`ocean waves`が参考になります。このassetは結構すごいことをやっています。

- [ocean waves](https://www.unrealengine.com/marketplace/ja/product/ocean-waves)

まずは`ocean waves`でplayerを動かし不要なものを削除します。

`OceanWaves/Levels/EarthSizedOceanPlanet`を開いて必要なものを列挙します。

```sh
Lighting
    DirectionLight
    SkyAtmosher
    SkyLight
    VolumetricCloud

OceanMaterialPresets
 OceanMaterial_Opaque
 OceanMaterial_Opaque_AF
 OceanMaterial_SLW
 OceanMaterial_SLW_AF

Planet
    BP_EarthSizedClouds
    BP_EarthSizedOcean
    BP_EarthSizedSphercialMesh
    BP_SkyAtmposhereAdjuster

PostProcessVolume
WaterVolume

+PlayerStart
+Plane
```

もしlvからcopyして使用する場合は`BP_xxx`の値が一部抜けるので注意してください。例えば、`BP_EarthSizedOcean`は海の設定です。詳細のOceanVolumeに`WaterVolume`を参照するようにしてください。

雲の形式は`VolumetricCloud`で設定していきます。大体の使い方としてはこんな感じです。詳しくはblueprintを見ます。

### [issue] buildすると雲が中央に集中する

package buildすると光が中央に集中し、雲も全体的におかしくなります。中央に向かってレンダリングが伸びているように見えます。

`BP_EarthSizedClouds`の`Global Wind`が原因です。ここで`Ocean : BP_EarthSizedOcean`に指定するとこの現象が発生します。

### [issue] 海に入った直前だけ背景が映り込む

`BP_EarthSizedOcean`を編集します。

私が独自に設定している`SM_SkySphere`が潜った瞬間だけそれが表示されてしまうので、`Volume Material Height`は0にしています。

`Above Water Material`にも`Underwater`と同じものを入れてください。

### [idea] atmoshereで宇宙をつなげる

私が作ってきたlv(map)は宇宙と街でわけられていました。

これは特別なことではなく当たり前のことで、mapは基本的に平面なのです。平面のmapにキャラクターやフィールドを配置していくのです。

私の場合はサークルのアクターを用意してぶつかると別の場所に移動するように設定していました。

しかし、これは本来やりたかったことではありません。現実に基づいたものを作りたかった。宇宙と街が異なる場所に置かれるのではなく、最初からつながっている形が良かったのです。

例えば、空に上昇して大気圏を抜けると宇宙に行ける形です。空に上昇すると宇宙マップに移動させられる形ではありません。

なぜこのようなことがやりたかったのかというと「目に見えない部分もしっかり作られているゲームを作りたかったから」です。

昼と夜がゲーム内で再現されていることがよくあります。これは単にライトと月の絵を背景で回しているだけなのです。しかし、私はゲーム内でもその場所に行くと本物そっくりの天体が動いている、そういうのがいいなと思っていました。

今回は、それを実現するために[sky atmosphere](https://dev.epicgames.com/documentation/en-us/unreal-engine/sky-atmosphere-component-in-unreal-engine)を利用するようにしました。

また、月などの天体には重力がありませんでした。そのまま丸い球体が浮いているという形だったのです。ですから、上から落下すると月に乗れますが、横からだと乗れません。ぶつかるだけです。これを改善したかった。

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-21_125510.mp4"></video>

> `game animation sample`には飛び越せるブロックがあります。あれをフィールドに設置して岩にかぶせ見えないようにすることで動作します。見えないようにというのはブロックのmeshをvisibilityで制御します。

しかし、注意点もあります。太陽と月を追加するとあまりに負荷が高くなったのか落ちるようになったことがありました。いくつか改善すると治りましたが、この形を採用するとbuildが通らなくなることもあります。

## dynamic volumetric sky

今回は、`dynamic volumetric sky`と`ocean waves`の統合してみました。

- [dynamic volumetric sky](https://www.unrealengine.com/marketplace/ja/product/dynamic-volumetric-sky/)
- [ocean waves](https://www.unrealengine.com/marketplace/ja/product/ocean-waves)

なお、`superhero fligth animations`, `game animation sample`, `city sample`も入っています。

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-29_025510.mp4"></video>

結果として理想の地表と海面、空と雲を手に入れました。

### [tips] default setting

- BP_DynamicVolumetricSky(self) -> Coloud : Coloud Fly Option
- BP_DynamicVolumetricSky(self) -> Height Fog Max Opacity : 0
- SkyAtmosphere -> Transform Mode : Planet Center at Component Transform
- SkyAtmosphere -> Transform(location-z : -6360)

### [tips] option setting

- BP_DynamicVolumetricSky(self) -> Single Player Fps Lock : 60 FPS
- VolumetricCloud -> Layer Bottom Sltitude : 20
- VolumetricCloud -> Tracking Start Max Distance : 400
- VolumetricCloud -> Tracking Max Distance : 400
- 2DSky -> visible : false

### [issue] 地平線

まずはdynamic volumetric skyの地平線を消していきましょう。

普通に考えて地平線を消したいことなんてありそうですけど、英語は[こちら](https://forums.unrealengine.com/t/how-can-i-remove-the-foggy-horizon-in-the-default-skysphere/339893)で説明されています。日本語は見つかりませんでした。これは通常、`Horizon Falloff`で調整しています。

ただし、dynamic volumetric skyは少し特殊です。`Height Fog Max Opacity`を0にすれば消えます。

どうやら`BP_Dynamic_VoluemetricSky`にある`ExponentialHeightFog`で地平線を設定しているようです。これを削除していくか、設定を変更してもいいですが、削除した場合はbuildがおかしくなるかもしれません。削除する場合はcompileするとerrorが出るので使用している箇所の関数やblueprintを削除します。

### [issue] 海の波紋

dynamic volumetric skyと合わせることで海に波紋が現れます。

これはocean wavesのsky atmosphereが星の中心を規定していることから発生します。つまり、sky atmosphereを星の中心に設定しないと描写の問題が出るということです。

![](/m/post/ue/ue5_2024-06-24_025510.png)

この解消方法はdynamic volumetirc skyのatmoshereのtransformのlocation-zを`-6360`にすることで回避できました。

ただし、わからないところもあって、私は`BP_EarthSizedSpericalMesh`の中に`BP_DynamicVolumetircSky`を入れています。ですから、そのままでも座標は星の中心を指しています。

### [issue] 海の影

海に円形の影が現れることがあります。これは`BP_DynamicVolumetircSky`の`VolumetricSkySupport`のtransform-scaleを大きくすると海に入る影が大きくなり、1にするとなくなります。

この辺も星の内部に展開される領域に関係します。

### [issue] city sampleとの統合

city sampleとocean waves + dynamic volumetric skyを統合するのは容易ではありません。buildの結果が異なるからです。

具体的には以下の画像の通りの構成にしなければなりません。oceanの他のactorを入れてはいけません。

![](/m/post/ue/ue5_2024-06-30_025510.png)

まずdynamic volumetric skyは0に置きます。oceanの惑星の中心ではありません。そして、dynamicのatmosphereを念の為に`location-z:-636000001`とします。`location-z:-636000000`でもいいと思います。これは`Ground Raidus:6359`になっているからです。

### [idea] 具体的な統合

重要な問題は以上の2点ですが統合には他にやらなければならないことがたくさんあります。

例えば、「dynamic volumetric skyの範囲を超えたとき、一体どうやって地球と太陽と月を表現するのか」です。

さっきまであった太陽がいきなり消えて別の場所に出現したり、見た目が変わったりするのはできれば避けたい。しかし、それだと見た目のクオリティは一気に落ちます。

まずは月を消すことからですが、月は`2DSky`で実装されています。`visible:false`にすればいいでしょう。

次に本物の月を地球の外に回します。ここでは`spline`で軌道を設定しています。

![](/m/post/ue/ue5_2024-06-29_025510.png)

loopさせるには`spline len`をmaxにして`float wrap`します。

<iframe src="https://blueprintue.com/render/8gfrd45h/" scrolling="no" width="100%" height="450px" allowfullscreen></iframe>

### [idea] 地球の外側

そのままでは宇宙に出たときの見栄えがよくありません。したがって、宇宙に出たとき地球の見た目を整える必要があります。

しかし、これもunreal engineの問題から解決が難しい。私は以下のように実装していますが、良い方法ではありません。

<iframe src="https://blueprintue.com/render/t46sbleq/" scrolling="no" width="100%" height="450px" allowfullscreen></iframe>

### [idea] 地球の自転

これは失敗談ですが、地球に自転を設定してみました。これで外側を回っている月や太陽はゆっくりした速度で動けば良くなります。つまり、現実に合わせることができる。

しかし、地球を自転させることで地面は揺れマップは崩壊。様々な問題が発生しました。

やはり、ゲーム上で地動説を実現するのは難しいようです。太陽側を回すしかありません。

### [idea] 本物の地球を作る

`cesium`を使うとgoogle mapと連携できます。
- [cesium](https://www.unrealengine.com/marketplace/ja/product/cesium-for-unreal)

## pixel streaming

個人的にやりたかったのは`multiple full stacks with matchmaking`です。具体的には複数のインスタンスを起動して、各ユーザーごとにsessionをわけます。これにより異なる画面(自分の画面)で操作できるようになります。

> multiple full stacks with matchmaking
>
> すべてのユーザーが同じストリームに接続するのではなく、各ユーザーに対して独自のインタラクティブなエクスペリエンスを提供したい場合もあります。これを実行するためには、各ユーザーに対して Pixel Streaming コンポーネントの個別スタックを実行して、各ユーザーを個別の Signaling and Web サーバーに誘導し、接続を開始します。
> 
> 個別ホストで Pixel Streaming コンポーネントの各スタックを設定できます。または、全員が異なるポートで通信するように各スタック内でコンポーネントに対してポートを設定をすることで、同じホストで複数のスタックを配置することもできます。これらのポートの詳細については[ Pixel Streaming リファレンス](https://docs.unrealengine.com/4.27/en-US/SharingAndReleasing/PixelStreaming/PixelStreamingReference)を参照してください。

具体的な手順は、まずmatchmaker serverを建てます。signaling serverをmatchmakerに接続します。

```sh
# https://github.com/EpicGamesExt/PixelStreamingInfrastructure
$ cd ~/github/PixelStreamingInfrastructure/Matchmaker/platform_scripts/cmd/
$ ./setup.bat
$ ./run.bat
# https://dev.epicgames.com/documentation/ja-jp/unreal-engine/unreal-engine-pixel-streaming-reference
# --HttpPort 90
# --MatchmakerPort 9999

# Signaling and Web サーバーに対する次のコンフィギュレーション パラメータを設定します。
$ cd ~/github/PixelStreamingInfrastructure/SignallingWebServer/platform_scripts/cmd/
$ ./setup.bat
$ ./Start_SignallingServer_nopublic.ps1 --UseMatchmaker true --MatchmakerAddress 127.0.0.1 --MatchmakerPort 9999 --PublicIp localhost --HttpPort 80
```

https://dev.epicgames.com/documentation/ja-jp/unreal-engine/hosting-and-networking-guide-for-pixel-streaming-in-unreal-engine

https://dev.epicgames.com/documentation/ja-jp/unreal-engine/getting-started-with-pixel-streaming-in-unreal-engine

基本的にはweb uiで各ユーザーが使用する`StreamerId`を選択して別々のstackにアクセスします。

urlは`http://127.0.0.1/?StreamerId=DefaultStreamer`, `http://127.0.0.1/?StreamerId=DefaultStreamer1`という形になります。このidは起動しているアプリの数だけ生成されます。

ただ、アプリの起動数が多すぎるとserverの負荷が大きくなります。これはゲーム内容にもよりますが私が作っているゲームだと4つくらいが限界でしょう。gpuの制限もあります。例えば、`streamer id`を3つ作りたいならアプリを6つ起動するようにしてください。そのほうが確実です。

> 同じコンピュータで Pixel Streaming を使用して Unreal Engine の複数インスタンスを実行する計画の場合、NVIDIA GeForce ラインなど一般ユーザー レベルの多くのグラフィック カードで同時に実行できるエンコーダは最大 3 つであることに注意してください。Quadro や Tesla などプロフェッショナル グレードのカードには、これと同じ制限はありません。

> stun/turn server
> 
> Signaling and Web サーバーが Unreal Engine アプリケーションとブラウザ間で接続を直接ネゴシエートできるようにするためには、互いに相手に自身の IP アドレスを送信する必要があります。つまり、ブラウザは Unreal Engine アプリケーションにより送信された IP アドレスにアクセスできる (その逆も同様) ことが必要です。
> 
> シンプルな LAN では、各エンドポイントは通常、それ自身のネットワーク カードで把握しているプライベート IP アドレスを使用して、相手がアクセスできることを前提にしています。オープンなインターネットやサブネットにまたがる場合、またはブラウザと UE4 アプリケーションの間にネットワーク アドレス変換 (NAT) がある場合、一般的にこの前提は当てはまりません。代わりに、各パーティは STUN (Session Traversal Utilities for NAT) プロトコルを実装しているサーバーにクエリを送信して、それ自身のパブリック公開の IP アドレスを検出する必要があります。STUN サーバーが各エンドポイントにパブリック公開の IP アドレスを通知した後、Signaling and Web サーバーは直接接続を引き続き仲介できます。

例えば、login時にipをgetして、それを保存します。そのipと一致しないと操作できないようにすれば一人のユーザーのみ操作可能になります。ですが本来は各ユーザーが別々のスタック、ストリームでゲーム画面を実行できるようにするのが望ましいでしょう。

## http helper + jsonparser

これまで`put`ができるhttp requestはありましたが、`patch`ができるものはありませんでした。しかし、[RLoris/HttpHelperDoc](https://github.com/RLoris/HttpHelperDoc)がそれを可能にします。無料で使えるものには[ufna/VaRest](https://github.com/ufna/VaRest)があります。

```sh
$ curl -X PUT -sL example.com
$ curl -X PATCH -sL example.com
```

これと[jsonparser](https://www.unrealengine.com/marketplace/ja/product/jsonparser)を組み合わせることでかなりblueprintが楽に書くことができます。もちろん、無料でやることは可能ですが、相当な時間と手間がかかってしまうので、こういったpluginは購入しておくのも手です。ただし、本来は公式が対応する機能ではないかとも思っていて、pluginを購入してもsupportがいつまで継続されるのかは未知数です。

<iframe src="https://blueprintue.com/render/mb0s7e_a/" scrolling="no" allowfullscreen width="100%" height="400px"></iframe>

## [error] install asset

> インストールに失敗しました
> 
> エラーコード: II-E1001

https://forums.unrealengine.com/t/i-keep-getting-error-code-ii-e1001-when-attempting-to-create-some-unreal-projects/535863

この問題は修正されていません。

assetをinstallするときにerrorが出ます。原因は`Epic Games Launcher`のダウンロードキャッシュフォルダである`VaultCache`です。これを内部であれ外部であれ指定しているわけですが、原因不明の`II-E1001`というerrorが出て解消できないことがあります。基本的には全く新しいフォルダを作ってそれを指定するとうまくいく場合があります。上手くいかない場合もあります。この際、`VaultCache`という名前にしてはいけませんし、選択してもいけません。

そもそもこの問題が発生するのは不定期で、何もしていないのに治ることがあります。ハードディスクをlauncherが認識できていないからかもしれませんが、なぜ認識できないのかわかりません。

とはいえ、unreal engineは基本的にバグだらけであり、ほとんどがバグっているので、この問題もその中の一つに過ぎません。特に困っているので書きました。

## [error] package to generate with the same ID

> PackagingResults: Error:: [Cook] Tryning to add package in context but there is already a package to with the same ID

大体は[これ](https://forums.unrealengine.com/t/cant-package-game-an-item-with-the-same-key-has-already-been-added/329072)と似たような問題です。基本的にはocean wavesのactorを追加した後に削除すると発生します。

city sampleで頻発します。`Content/_ExternalActors_`を削除して新しいcity sampleの`Content/`を上書きします。

## [tips] モデルを法線で強調する

モデルのoutline(法線)を強調する設定を行います。`Content/yui/model/SK_xxx`を開いて`レンダリング > overlay material`で以下のマテリアルを作成して適用します。

- `Content/yui/model/SK_xxx`

![](/m/post/ue/ue5_2024-05-28_135604.png)

<iframe src="https://blueprintue.com/render/t1xc2azx/" scrolling="no" allowfullscreen width="100%" height="400px"></iframe>

[blueprintue.com](https://blueprintue.com/blueprint/t1xc2azx/)

## [tips] 待機モーションをランダムにする

`ABP_xxx`の`locomotion > idle`にて`random sequence player`を追加します。詳細からanimを追加してランダムで再生できます。

![](/m/post/ue/ue5_2024-05-30_132836.png)

## [tips] アニメーションにエフェクトを付ける

animに時間制限のエフェクトを付けます。通知に`timed niagara effect`を追加して詳細からniagaraを追加します。

![](/m/post/ue/ue5_2024-05-30_132915.png)

## [tips] 剣のモーションを作る

新しくswordのactor(static mesh)を作成し、collisionを作ります。

それを`BP_Player_UE5`に装備し、motionを作成し、キーに割り当てます。剣をしまうのはniagaraで作成しました。

<iframe src="https://blueprintue.com/render/cu104wg0/" scrolling="no" allowfullscreen width="100%" height="400px"></iframe>

by [ai](https://blueprintue.com/blueprint/cu104wg0/)

これは`sword_open`, `sword_close`というactor, blueprintを作成して、それを`BP_Player`のmeshに当てます。そして、`set visible`で切り替えています。

![](https://raw.githubusercontent.com/syui/img/master/other/ue5_ai_2023-12-10_00.39.01.png)

ではparticle(粒子)はどうやって実現しているのかというと`niagara`です。

![](https://raw.githubusercontent.com/syui/img/master/other/ue5_ai_2023-12-10_00.39.02.png)

まずはboneを追加します。このboneを元にtrailというeffectをつけていくわけです。`sword-trail`は検索タグとしても有効です。effectはanim sequence(アニメ・シーケンス)で設定します。

![](https://raw.githubusercontent.com/syui/img/master/other/ue5_ai_2023-12-09_16.35.44.png)

`PSTemplate`, `Socket Name`を指定します。

![](https://raw.githubusercontent.com/syui/img/master/other/ue5_ai_20231203_203306.png)

また、niagaraで作成してもいいですね。`sword-trail-naigara`とでも検索してみてください。

- [ソードトレイル](https://www.youtube.com/watch?v=0vYPkxEZEtQ)

sword motion(ソード・モーション)はanim montage(アニメ・モンタージュ)を使用しているのですが、実行後に元のlocation(位置)に戻ってしまう問題がありました。

これは`root motion`をenableにしたり、他の設定をやっても戻ってしまうのです。

原因はIKリターゲットしたときrootが動いていないために起こります。animationを開いてsrcとtargetを比較してみると、srcのほうはrootが動いていますが、targetのアニメは動いていません。具体的には、srcはlocationが変動しますが、targetは変動していません。

これを変動するようにしないといけないのですが、bone(ボーン)の`root`を選択してFKの平行移動モードを`Globally Scaled`に設定します。

これでtargetのrootが変動しているのを確認後、リターゲットし、montageを作成します。

![](https://raw.githubusercontent.com/syui/img/master/other/ue5_ai_2023-12-09_16.37.18.png)

- [UE5でルートモーションを有効にしたままリターゲットをする方法](https://happynetwork2019.hatenablog.com/entry/2023/10/02/191340#:~:text=%E3%83%BB%E3%83%81%E3%82%A7%E3%83%BC%E3%83%B3%E3%83%9E%E3%83%83%E3%83%94%E3%83%B3%E3%82%B0%E3%82%BF%E3%83%96%E3%81%A7%E3%83%AB%E3%83%BC%E3%83%88,%E3%81%95%E3%82%8C%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%AA%E3%82%8B%E3%80%82)

## [tips] apiを使って処理を行う

pluginである[varest](https://www.unrealengine.com/marketplace/ja/product/varest-plugin)のpostですが、macで動いたものがwindowsでは動きませんでした。ですが、windowsでイチから作成すると動きました。

ue5は`PATCH`に対応していません。この辺はapiを作り直さないといけないかもしれない。

<iframe src="https://blueprintue.com/render/4qo0qydu/" scrolling="no" width="100%" height="400px"></iframe>

by : [ai](https://blueprintue.com/blueprint/4qo0qydu/)

login処理です。atprotoと連携できればいいなと考えています。

あと、ゲーム公開/非公開はaiのアカウントで判断しています。ある値がtrueなら公開、falseなら非公開です。ここをapiで変更すれば基本的にゲームの起動自体をコントロールできるようになってる。

<iframe src="https://blueprintue.com/render/9v24l5h6/" scrolling="no" allowfullscreen width="100%" height="400px"></iframe>

by : [ai](https://blueprintue.com/blueprint/9v24l5h6/)

## [tips] カメラを近づけるとキャラの表示を変える

透明にフィードアウトする形がいいのですが、非常に面倒なのでoverlayで対応します。

`get world location`, `get actor location`を`distance(vector)`で差を取り`180 >= value`, `100 >= value`で比較して`branch`で`overlay`、100以下の場合は`set visibility`します。

https://historia.co.jp/archives/23521/

`m_outline_7`を変換して使いました。パラメータの調整は厄介で基本設定が`surface, masked, subsurface profile`, パラメータを`U_pos_01 : 0.2`以外は0にします。これは自分が購入したassetの設定です。

## [system] レベルアップ

移動するとrandomで経験値が入るようにしました。大体、40秒間移動すれば1 expです。経験値をapiに保存します。expに応じてlvを表示します。この辺はstatusのuiを再度表示しないといけなかったり、anim-eventを作ったり大変でした。

## [system] アイテムストレージ

アイテムストレージと言っても`wp`です。uiとボタンで作ります。

uiをマウスで動かすには`Set Input Game And UI`を使用します。これ以外だと色々と問題があります。例えば、`Set Input Only`は2回クリックしないとボタンを押せないなど。

基本的にアイテムをapiに保存して、それがある場合はスキルやテレポートを開放します。テレポートはカードを拾う場所に`PlayStart`を置いておきます。`Open Level`の`options`にtagを入れて移動します。

## [tips] 瞳の変化

`create dynamic material instance`

https://historia.co.jp/archives/33401/

これを利用することでmaterialを光らせてそれを設定することで瞳や輪を光らせることができます。ただ常時はやめたほうがいいでしょう。プレイヤーがつかれてしまいます。

## [tips] 物の破壊

> 選択モードから「フラクチャ」モードに変更します。このフラクチャモードで実際に Chaos Destructionに関わるメッシュの分割などを行います。複数選択する。新規作成。一様化で分割。色はジオメトリコレクションの詳細から「Show Bone colors」のチェックを外します。

https://logicalbeat.jp/blog/11044/

## [tips] 表情を動かす

![](/m/post/ue/ue5_2024-05-30_132916.png)

## [tips] 必殺技をつける

レベルシーケンスで作成しました。カメラ移動に苦戦しましたが、それさえやれば割と簡単かも。あと爆発と同時に見えないsphereを作成してsimulate physics, collisionを設定しています。これによりダメージや吹っ飛び判定ができます。なお、play後は`input enable`しておいてください。

<iframe src="https://blueprintue.com/render/xn4sm3ok/" scrolling="no" allowfullscreen width="100%" height="400px"></iframe>

## [issue] シーケンサを5.3から5.4にインポートしたらバグっていた

原子爆発をシーケンサで作成していましたが、バグに遭遇しましたので記録しておきます。

5.3から5.4にシーケンサを持ってきて使用していましたが、一度でも編集するとおかしくなります。例えば、BP_Playerを置いたとして、mesh(skeltal)も追加しなければならなくなりました。なぜならanimを追加できないからです。meshを追加したあとanimを追加できます。しかし、これでもまだ正常ではありません。buildが進まなくなり、編集するとanimが機能しなくなります。つまり、meshを追加、animを追加、meshを削除という手順を踏まなければいけません。BP_Playerの直下にanimを置くことでようやく正常になります。

これは5.4.3にしたら治りました。基本的にはskeltal meshがSKM_UEFN_Mannequinのもの`CharacterMesh0`を置いて、その下にanimを置きます。この際、Mannequinのanimが必要です。リターゲットで作成します。そして、transformを0にしておいてください。animは右クリックで`ルートコンポーネントを交換`にしておくといいかもしれません。
今もbuild後の画質問題に悩まされています。私はcity sampleをベースにprojectを作成し、package buildしていますが、build後は画質が悪くなります。editor上では問題ありません。`高DPIを許可`なども試してみましたが効果がありませんでした。

以下のようなscalability(エンジン拡張機能設定)をしています。DeviceProfilesでも設定できます。ツール -> プラットフォーム -> デバイスプロファイル -> Windows, rはレンダリングで、sgはscalability group

```
#DefaultEngine.ini
[ConsoleVariables]
sg.AntiAliasingQuality=4
sg.EffectsQuality=4
sg.FoliageQuality=4
sg.GlobalIlluminationQuality=4
sg.LandscapeQuality=4
sg.ReflectionQuality=4
sg.ResolutionQuality=100
sg.ShadingQuality=4
sg.ShadowQuality=4
sg.PostProcessQuality=4
sg.TextureQuality=4
sg.ViewDistanceQuality=4
r.MaterialQualityLevel=3

#DefaultScalability.ini
[ScalabilitySettings]
sg.AntiAliasingQuality=4
sg.EffectsQuality=4
sg.FoliageQuality=4
sg.GlobalIlluminationQuality=4
sg.LandscapeQuality=4
sg.ReflectionQuality=4
sg.ResolutionQuality=100
sg.ShadingQuality=4
sg.ShadowQuality=4
sg.PostProcessQuality=4
sg.TextureQuality=4
sg.ViewDistanceQuality=4
```

また、blueprintで`r.SetRes 1920x1080f`や`Set Screen Resolution`+`Apply Settings`を実行し、build後のwidgetから確認済みです。`Get Game User Settings`から`Get Screen Resolution`して`1920x1080`が表示されています。ウィンドウ形式なども`Set Fullscreen Mode`で変更できているようです。念の為`.ini`に以下の項目なども追加しています。

```
[ConsoleVariables]
r.SetRes=1920x1080f
```

他にはゲーム中にscalabilityやscreen size(Screen Resolution)を変更できるようにしていて、これを変更すると画質や表示が切り替わっているように感じます。ウィンドウ形式は確実に切り替えられます。

ただ、肝心のタイトル文字はぼやけていて、ゲーム中の雲の画質が解像度でいうと`1280x720`相当になってしまいます。雲はdynamic volumetric skyを使用しており、editor上の画質に問題はありません。

## [tips] vrm4uの見た目の調整

今回は誰も解説していないBP_PoseCopyToonを使ったvrmモデルの見た目を改良する手順を紹介します。ドキュメントにも書かれていませんが、大体は以下の手順になります。

1. ファイラーでPlugins/を見えるようにする(プラグインコンテンツを表示)

2. All/Plugins/VRM4U/Util/Actor/PostShadow/BP_PoseCopyToonをlevel(map)に配置し、target actorにBP_Playerを選択して調整する(BP_Playerもlevelに配置しないといけない)

3. All/Plugins/VRM4U/Util/Actor/PostShadow/MI_PostToonが更新されているのでAll/Plugins/VRM4U/ImportData/DS_VRMCustomを開いて、全部をMI_PostToonにする

4. vrmファイルをインポートする。この際、type:customを選択する

5. 奇妙なSK_${name}ができるが、重ねがけ用なので正常です。BP_PoseCopyToonを開いてVrmPoseableMesh_translucentをコピーし、BP_Playerに貼り付ける

6. VrmPoseableMesh_translucentでSK_${name}を参照する

## [issue] 背景がチカチカする

dynamic volumetric skyで2dskyが原因である領域に視線を向けるとチカチカ背景の色が変わる現象に遭遇しました。2dskyをdisableにすることで解消しました。

## [tips] 雲を綺麗にする

dynamic volumetric skyのtime speedをゆっくりにすることで、雲がきれいになりました。fpsはfreeにしました。projectでもfpsを高めに設定しました。

## [issue] SoStylizedのskyでmodelが光る

これは`BP_StylizedSky`にあるPostProcessのBloomが原因です。強度を0にしましょう。ただし、blueprintから直接変更するしかない場合があります。

![](/m/post/ue/ue5_2024-07-18_01.png)
![](/m/post/ue/ue5_2024-07-18_02.png)

## [tips] キャラの切り替え

game animation sampleの実装を基準にキャラを切り替えていきます。

キャラの切り替えは`Widgets/GameAnimationWidget`の一部を使用します。具体的には`EUW_CharacterSelectButton`を以下のように書き換えれば使用できるでしょう。

<img src="/m/post/ue/ue5_2024-07-19_02.png">

![](/m/post/ue/ue5_2024-07-20_01.png)

<iframe src="https://blueprintue.com/render/7z9nt-bi/" scrolling="no" width="100%" height="450px" allowfullscreen></iframe>

## [issue] city sampleでcloth simulationが機能しない

他のprojectでは機能するのに`cloth simulation`が機能しない場合、project settingの問題です。

https://forums.unrealengine.com/t/no-cloth-simulation-in-ue5-but-works-in-ue4/619532

```sh:Config/DefaultEngine.ini
[ConsoleVariables]
- p.ClothPhysics=0
+ p.ClothPhysics=1
```

## [tips] デフォルトの姿勢では足が開いてしまい可愛くない

走っている姿やアイドル状態などをよく見てみると可愛くありません。

`RTG_UEFN_${name}`で右足と左足にあるボックスを選択して、IK -> スタティックローカルオフセットを左を`x:1.0`, 右を`x:-1.0`にします。

## [issue] 一つのwidgetで各キャラのiconを設定する

objectに`cbp_character_${name}`を指定してボタンをクリックするとキャラが切り替えるwidgetを作成していました。

以前はiconごとに読み込むファイルを別々に作っていたのですが、その処理を簡略化しました。まずは各キャラのcbpをobjectに指定しているので、名前が異なります。objectからdisplay nameやobject name, object pathを取ってきて、brush(image)を設定するようにしたのですが、これはeditorでは動作しますが、buildで動作しないことがわかりました。

理由は不明ですが、object(name)がNoneになります。ボタンを押すと正常に動作するためobjectはそのキャラのものが使われているはずです。これは少し奇妙です。

そんなことを言っていても問題は解決しないので別の方法でやることにしました。objectとは別の値を用意して処理します。また、とりあえず`インスタンス編集可能`, `スポーン時に公開`, `シネマティックスに公開`にチェックを入れておくことにしました。

<iframe src="https://blueprintue.com/render/afervnjy/" scrolling="no" allowfullscreen width="100%" height="450px"></iframe>

## [issue] bp_playerのキャラを切り替えるときに装備を外す

これも以前から放置していた問題ですが、アイの衣装を変更したときに他キャラで`visibility:false`するのがめんどくさかったので、自動で処理されるようにしました。

`cbp_sandbox_character`をcastしてobjectのdisplay nameでもobject nameでも取ってきて、それが`ai`じゃなければ`set visibility`します。childrenにチェックを入れておきます。

<iframe src="https://blueprintue.com/render/7z9nt-bi/" scrolling="no" allowfullscreen width="100%" height="450px"></iframe>

なお、最初は`destroy actor child`のようなものを探したのですが、unreal engineにそんなものはありませんでした。

unreal engineは「これくらい基本的なことはできるでしょう」ということができませんし、そんなものはありません。splineをいじっていたときも驚きました。

## [issue] fbxからunityを使ってvrmaを作成するときの罠

fbxをvrmaにする際に[malaybaku/AnimationClipToVrmaSample](https://github.com/malaybaku/AnimationClipToVrmaSample)を使うんだけど、univrmのvrm 1.0をインストールしないといけない。両方必要なのかもしれない。つまり、インストールするものは以下の3つ。また、AnimationClipToVrmaSampleはwindowsでは動きません。macでのみ動きます。今後は`vrm 1.0`を使っていったほうがいいですね。

- [malaybaku/AnimationClipToVrmaSample](https://github.com/malaybaku/AnimationClipToVrmaSample)
- [VRM 1.0 Import/Export](https://github.com/vrm-c/UniVRM/releases/download/v0.124.2/VRM-0.124.2_dd50.unitypackage)
- [VRM 0.x Import/Export](https://github.com/vrm-c/UniVRM/releases/download/v0.124.2/UniVRM-0.124.2_dd50.unitypackage)

ue5からfbxをexportする際は、animationですべてのチェックを付けましょう。精度が高まります。あと、コリジョンは外しました。

unityでの操作は以下の通り。

- 1. Rig -> Animation Type : Humanoid
- 2. Animation Clip(Unreal Take) -> 右クリック -> VRM -> Convert to VRM Animation -> .vrma

## [tips] three-vrm v3

three-vrmを使って`.vrm`を表示します。`unity + vrm 1.0`でexportしたものを使います。

react-three-fiberはsceneなどを自動でやってくれて、コードもシンプルになります。

> anim(vrma)を動かす場合は注意が必要で動きますが動きがおかしくなります。これは`react-three-fiber`で書く場合に発生します。個人環境では`unity + vrm 1.0`でexportしたものを使うと正常に動きました。

```sh
$ npx create-react-app vrm-model --template typescript
$ npm i
$ npm run start
```

```ts:src/pages/vrm-model.tsx
import * as THREE from 'three'
import React, { useState, useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei'
import { useFrame, Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM, VRMUtils, VRMLoaderPlugin } from '@pixiv/three-vrm';
import { VRMAnimationLoaderPlugin, VRMAnimation, createVRMAnimationClip } from "@pixiv/three-vrm-animation";

interface ModelProps {
	url: string
	url_anim: string
}

const VRMModel: React.FC<ModelProps> = ({ url, url_anim }) => {

	const [vrm, setVrm] = useState<VRM | null>(null);
	const mixerRef = useRef<THREE.AnimationMixer | null>(null);

	useEffect(() => {
		const loader = new GLTFLoader();
		loader.register((parser) => new VRMLoaderPlugin(parser));
		loader.register((parser) => new VRMAnimationLoaderPlugin(parser));
		loader.load(url, (gltf) => {
			const vrmModel = gltf.userData.vrm as VRM;
			VRMUtils.removeUnnecessaryJoints(vrmModel.scene);
			setVrm(vrmModel);
			const mixer = new THREE.AnimationMixer(vrmModel.scene);
			mixerRef.current = mixer;
			loader.load(url_anim, (animGltf) => {
				const vrmAnimations = animGltf.userData.vrmAnimations as VRMAnimation[];
				if (vrmAnimations && vrmAnimations.length > 0) {
					const clip = createVRMAnimationClip(vrmAnimations[0], vrmModel);
					mixer.clipAction(clip).play();
				}
			});
		});
	}, [url, url_anim]);

	useFrame((state, delta) => {
		if (mixerRef.current) mixerRef.current.update(delta);
		if (vrm) vrm.update(delta);
	});

	return vrm ? <primitive object={vrm.scene} /> : null;
};

export const VRMModelCanvas = () => {
	return (
		<div style={{ height: '100vh', width: '100vw' }}>

		<Canvas
		shadows
		gl={{
			//toneMapping: THREE.ACESFilmicToneMapping,
			//toneMapping: THREE.ReinhardToneMapping,
			toneMapping: THREE.NeutralToneMapping,
				toneMappingExposure: 1.5,
				alpha: true,
				powerPreference: "high-performance",
				antialias: true,
				//stencil: false,
				//depth: false
		}}
		camera={{ position: [1, 1, 1] }}>

		<directionalLight 
		color="white" 
		castShadow 
		position={[0, 10, 0]} 
		intensity={1.5} 
		shadow-mapSize={[1024, 1024]}/>

		<OrbitControls />
		<ambientLight intensity={1} />
		<pointLight position={[10, 10, 10]} />

		<VRMModel url="./models/default.vrm" url_anim="./models/default.vrma" />

		</Canvas>
		</div>
	)
}
export default VRMModelCanvas;
```

```ts:src/App.tsx
import React from 'react'
import VRMModelCanvas from './pages/vrm_model'

const App = () => {
	return (
	<VRMModelCanvas/>
	)
}

export default App;
```

```json:package.json
{
  "name": "vrm-model",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@pixiv/three-vrm": "^3.0.0",
    "@pixiv/three-vrm-animation": "^3.0.0",
    "@react-three/drei": "^9.109.2",
    "@react-three/fiber": "^8.16.8",
    "@react-three/postprocessing": "^2.16.2",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.104",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.167.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "5.0.1",
    "three": "^0.167.1",
    "three-stdlib": "^2.30.5",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

```json:tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
```

## [issue] blenderでvrmのtextureが剥がれる

modelにつけるアクセサリをblenderで統合させ、three-vrmで表示していましたが、textureが剥がされていることに気づきました。

最初はthreeの`toneMapping`の問題だろうと思っていましたが、model(vrm)の問題です。

`unity + vrm 1.0`でアクセサリを付けて、exportしましょう。

## [issue] build後の画質問題

今もbuild後の画質問題に悩まされています。私はcity sampleをベースにprojectを作成し、package buildしていますが、build後は画質が悪くなります。editor上では問題ありません。`高DPIを許可`なども試してみましたが効果がありませんでした。

![](/m/post/ue/ue5_2024-08-12_01.png)

左:build / 右:editor

以下のようなscalability(エンジン拡張機能設定)をしています。DeviceProfilesでも設定できます。ツール -> プラットフォーム -> デバイスプロファイル -> Windows, rはレンダリングで、sgはscalability group

```
#DefaultEngine.ini
[ConsoleVariables]
sg.AntiAliasingQuality=4
sg.EffectsQuality=4
sg.FoliageQuality=4
sg.GlobalIlluminationQuality=4
sg.LandscapeQuality=4
sg.ReflectionQuality=4
sg.ResolutionQuality=100
sg.ShadingQuality=4
sg.ShadowQuality=4
sg.PostProcessQuality=4
sg.TextureQuality=4
sg.ViewDistanceQuality=4
r.MaterialQualityLevel=3

#DefaultScalability.ini
[ScalabilitySettings]
sg.AntiAliasingQuality=4
sg.EffectsQuality=4
sg.FoliageQuality=4
sg.GlobalIlluminationQuality=4
sg.LandscapeQuality=4
sg.ReflectionQuality=4
sg.ResolutionQuality=100
sg.ShadingQuality=4
sg.ShadowQuality=4
sg.PostProcessQuality=4
sg.TextureQuality=4
sg.ViewDistanceQuality=4
```

また、blueprintで`r.SetRes 1920x1080f`や`Set Screen Resolution`+`Apply Settings`を実行し、build後のwidgetから確認済みです。`Get Game User Settings`から`Get Screen Resolution`して`1920x1080`が表示されています。ウィンドウ形式なども`Set Fullscreen Mode`で変更できているようです。念の為`.ini`に以下の項目なども追加しています。fはfull, wはwindowed

```
[ConsoleVariables]
r.SetRes=1920x1080f
```

> Unreal Engineのr.SetResコマンドは、画面やウィンドウの解像度を変更するために使用されます。このコマンドは、解像度を指定した後にオプションでウィンドウモードを示すことで構成されます。例えば、r.SetRes 1920x1080wは1920x1080のウィンドウモードに設定し、r.SetRes 1920x1080fはフルスクリーンモードに設定します。ただし、特定のバージョンのUnreal Engine（例えば4.5.1）では、r.SetResコマンドが信頼性を持って動作しないという報告があります。特にウィンドウモードからフルスクリーンモードに切り替える際に、解像度が正しく更新されないという問題が発生しています。この不具合はハードウェアやドライバの特性に関連している可能性があり、ウィンドウモードの方がフルスクリーンよりも信頼性が高いと指摘されています。Unreal Engine 5.1では、解像度やその他の画面設定は一般的にUGameUserSettingsクラスを通じて管理され、特定のプロジェクトニーズに合わせてカスタマイズすることができます。

他にはゲーム中にscalabilityやscreen size(Screen Resolution)を変更できるようにしていて、これを変更すると画質や表示が切り替わっているように感じます。ウィンドウ形式は確実に切り替えられます。

ただ、肝心のタイトル文字はぼやけていて、ゲーム中の雲の画質が解像度でいうと`1280x720`相当になってしまいます。雲はdynamic volumetric skyを使用しており、editor上の画質に問題はありません。

その後、dynamic volumetric skyの雲や時間が動いていない事に気づきました。editorでは動いていますが、buildは動いていません。他のassetやmap(level)は動いています。これが雲の画質に関係しているのかもしれません。ただ、そう考えるとタイトル文字のぼやけが奇妙です。

## [close] build後の画質問題

特にdynamic volumetric skyの画質問題は`BP_DynamicVolumetricSky`のSingle Player Fps Lockを`Free`にしていると発生するようです。これを`60 FPS`に変更すると雲が動くようになり、画質も改善されました。

ただ、タイトル文字の画質は改善されていません。

> nvidiaの`グラフィック -> グローバル設定`が原因で、アプリが新しくなったからとインストール通知が来てて、そこから低画質が始まってたっぽい。イメージスケーリング(maxが解像度85%)をオフにすると治った。この設定は一体何なのだろう。windowsとゲームで設定できるから解像度はそれでいいと思ってた。でも違った。windows + ue + nvidiaの全部で解像度をうまく設定しないとおかしくなる。

## [issue] loading widget

ue5はloading画面を作るのにも苦労します。個人的にはwidgetがそもそも使いづらいのと、open levelの扱いがおかしいのです。例えば、widgetは`all remove`しか用意されていません。

私はprojectのconfigを用意して、変数にwidget blueprint(loading)のobjectを作成し、BP_Playerのevent beginでcreate widgetしてから、cast configからset loadingしています。

ocean waveは少し特殊で読み込みが遅いので、ここで待たなければなりません。ocean waveの読み込みが終わったときconfigから取ってきたloading(object)を`remove parent`します。

```sh
title -> create loading -> open level -> bp_palyer -> create loading, set config -> ocean wave(loadend) -> cast config -> remove parent
```

### [issue] 家を置くとexeが落ちる

> 建物の上に浮かんでいる輪っかみたいなactorを消したら正常に動くようになった。なんか変なのが浮かんでいると思っていた。`WeatherOccluder`

ビデオメモリが足りないと言われ落ちます。editorでは落ちません。

円形の家でライトは周りを取り囲むように設置されてて、それが重くなる一つの要因だとは思ってた。ちょっとおかしいけど、でもライトを少なくすると落ちなくなったのでそれが原因だったぽい。

ちなみに、ビデオメモリは足りてる。全然使っていない。最初の読み込みのところでmapが起動しない。小さな家の中にあるライトが原因でゲームが起動しないなんてこと普通ないと思うけど。

その後、また落ちるようになり、今度はライトを消しても落ちるようになったみたいだ。試しにコードをうまく行ったときの状態に戻してbuildしてみると落ちる。

### [issue] city sampleで少しでも遠ざかると追加したactorが消える

これはcity sampleに持ってくるといつの間にかインスタンスの親子関係がバラバラに解除されるからです。

最初はうまく構成されていますが、いつの間にかおかしいフォルダ構成になっていたり、親子付が解除されていたりします。

一度アプリを落とすと次に起動したときにはおかしくなっているのでしょう。

つまり、保存したものがいつの間にか勝手に変更されているのです。ですから場合によっては気づかないことがあります。

actorをまたもとのインスタンス下に置くと遠ざかっても建物が消えないようになります。

これはあらゆるものをcity sampleに追加するときに見られる挙動でもあります。

追加するとそのときは問題ないのですが、アプリを落とした以降におかしな挙動や構成になり再設定しないと適切に描写されず、距離に応じて消えてしまうactorになります。

また、再度設定して親子付けしたはずのものがいつの間にか解除されてたりもします。描写されないのでおかしいなと見てみると勝手に変更されています。定期的にあるので、毎回チェックするのが大変です。

色々な距離設定やプロジェクト設定、ワールド設定を見てみましたが、どれも効果を発揮しませんでした。

> 目の前のactorしか表示しないのは負荷軽減になります。正常な描写に戻すよう努力することでビデオメモリが足りないと落ちる可能性が高まります。ただ、ビデオメモリが足りなくなるようなものは追加していないし、負荷を監視していますがメモリは足りているので、ue(もしくはcity sample)が壊れているのかもしれません。その証拠にeditorからの起動では落ちません。あるいはdynamic volumetric skyとocean wavesを追加したことで相当な負荷がかかっており、少しactorを追加するだけでも落ちるようになっている可能性もあります。

### [tips] twinmotionがすり抜け

twinmotionで実装するものはcollisionが設定されていないのですり抜けます。

これを解消するにはmeshを全選択して、右クリックで`アセットアクション -> プロパティマトリクスで選択内容を... -> collision complexity(use complex collision as simple...)`を選択します。

これはtwinmotionに限らず`AutomotiveBridgeScene`にも見られる挙動でした。とはいえ設置したい場所にもよります。

### [issue] nvidiaの画面がちらつく

特にue5でひどかった画面のチラ付きに対処するには、nvidiaコントロールパネルを開いて解像度の変更からリフレッシュレートをディスプレイに合わせたあと`nvidiaのカラー設定を使用`を選択して再起動します。

### [tips] 音声を読み取り、chatgptで変換する

https://github.com/gtreshchev/RuntimeSpeechRecognizer/wiki/1.-How-to-use-the-plugin

https://www.youtube.com/watch?v=xBs-nXzXwoM&list=LL&index=1

- https://github.com/gtreshchev/RuntimeSpeechRecognizer
- https://github.com/gtreshchev/RuntimeAudioImporter
- https://blueprintue.com/blueprint/et6u52bm/

最後の`Get Sample Rate -> Process Audio Data(Sample Rate)`のところだけコピーでは対応できないので手動でつなげること。

### [tips] city sampleのbgmをcustomする

[suno](https://suno.com/@syui)を使用して作ると良いでしょう。

https://www.youtube.com/watch?v=99uP2WuU2Jo

`Audio/MetaSounds/Music/music_leavebehind_New_mix_Meta`を編集して、引用されているbaseの音楽を変更します。ただし、補助楽器を鳴らしているものは変更しません。

基本的にはそれぞれのパターンに合わせて、baseとなるbgmを改変して複数用意して入れていきます。そこまで面倒な手間をかけていられない場合は全部同じものを入れます。

### [issue] build後にcity sampleの風の音が消える

```sh
# [close] 
この問題は最初にPlayStartする場所が鍵でした。私は上空の家でスタートさせているのですが、これを地上でスタートさせるようにしなければなりません。
あるいは、再度スタートさせる場所を変更、移動して読み込みましょう。
```

build後にcity sampleの風の音が消えていることに気づいた。

いつ頃から消えていたかはよくわからないけど、多分、音声認識のpluginを入れてからだと思う。

しかし、おかしなところはopen levelでまずはtitle画面を読み込んでそこからmapに移行するんだけど、title画面では風の音が聞こえている。mapに移行してから消える。

それもただ消えるだけじゃなく、他の音は聞こえる。他の音もcity sampleの同じシステムで作成、管理されている。

でも風の音だけ消えているように思う。なお、これらの問題はeditorやpreviewでは確認できず、あくまでbuild後のpackage(exe)で発生している。

参照ビューアで辿っていると、`Script/CitySampleWorldAudioDataScript`に行き当たり、そこで`MetaSounds/Ambint/sfx_amb_Pawn_Wind_lp_meta`を追加したがbuild後に再生されていない。

### [tips] ultra dynamic skyの雲がきれいになった

updateが来てから雲の質が上がったので、`dynamic volumetric sky`と比べてもそこまで差がないです。したがって、天候もあるultra skyを使用することにしました。ちなみに、未だ雲の質はdynamic skyのほうが少し上です。

oceanと同時に使うには`BP_EarthSizedSphericalMesh`のtransform-location-zを`-636000100`にすると波紋が軽減される。ただし、この問題を完全に解決するには、sky-atmosphereを惑星の中心にするしかなく、ultra skyはそれだと問題が発生します。

### [issue] 画面がチカチカする2

nvidiaのスケーリングをONにしたら治った。でもこれをONにするとbuildしたpackageで雲の画質が悪くなったのを思い出した。

### [tips] 音声で操作する

これは前からやろうか迷ってたけど、簡単に実装できる。

configで音声を保存してstatus画面でも表示する。

### [tips] 音声でNPCを喋らせる

まず音声認識からchatgpt,elevenlabsを使うのは前回まででやっているけど、これを利用するとNPCを喋らせることができる。

この場合、会話のバリエーションは無限大だが制御はできない。

NPC(collision)にあたったとき、configにNPCのnumを入れてボタンが表示されるようにする。キーを押すとchatgptにNPCの設定をいれる。

### [issue] ビデオメモリ不足で落ちる2

これはまず重くないmapを開くことで次に開くmapをクラッシュを防ぐことができます。起動後にすぐ重いmapを開くと大体はクラッシュします。

ちなみに、原因はわかりませんし、メモリは不足していません。おそらく、GPUの性能にかかわらずクラッシュすると思われます。

