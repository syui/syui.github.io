+++
date = "2024-01-29"
lastmod = "2024-05-27"
tags = ["ue", "m", "ue5"]
title = "ue"
slug = "ue"
+++

ここでは[epic games](https://www.epicgames.com/)の[unreal engine 5](https://www.unrealengine.com/ja/unreal-engine-5)の使い方をまとめます。現在はversionの`5.4.2`に追従しています。昔は`5.3.2`を使っていました。

- [ue 5.4.2](https://dev.epicgames.com/documentation/ja-jp/unreal-engine/unreal-engine-5.4-release-notes)
- [ue 5.3.2](https://dev.epicgames.com/documentation/ja-jp/unreal-engine/unreal-engine-5.3-release-notes)

ブログで説明しづらい部分が多いので[blueprintue](https://blueprintue.com/profile/ai/)を参考にしてください。

- repo : https://git.syui.ai/ai/ue
- blueprint : https://blueprintue.com/profile/ai

## unreal engine 5.4

### 無料

使用しているassetなどです。

- asset : [city sample](https://www.unrealengine.com/marketplace/ja/product/city-sample)
- asset : [game animation sample](https://www.unrealengine.com/marketplace/en-US/product/game-animation-sample)
- plugin : [pixel streaming](https://dev.epicgames.com/documentation/ja-jp/unreal-engine/pixel-streaming-in-unreal-engine)
- plugin : [vrm4u](https://github.com/ruyo/VRM4U)
- plugin : [varest](https://www.unrealengine.com/marketplace/ja/product/varest-plugin)

### 有料

おすすめのassetです。

- asset : [superhero fligth animations](https://www.unrealengine.com/marketplace/ja/product/superhero-flight-animations)
- asset : [dynamic volumetric sky](https://www.unrealengine.com/marketplace/ja/product/dynamic-volumetric-sky/)
- asset : [ocean waves](https://www.unrealengine.com/marketplace/ja/product/ocean-waves)

### [asset] vrm4u + superhero fligth animations 

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

#### [issue] 飛行するとカメラがモデル内部に入り込む

再生してみると飛行が正常に動きません。カメラがモデル内部に移動します。これは`scale`が間違っているためです。`apply additive`が原因でそこのscaleを変更すると回避できます。

また代わりに`blend bone by channel`を使用することでも回避できます。

これはv5.4で発生し、v5.3では発生しません。

- `Content/yui/anim/ABP_Player_xxx`

![](/m/post/ue/ue5_2024-05-28_132554.png)
![](/m/post/ue/ue5_2024-05-28_134214.png)
![](/m/post/ue/ue5_2024-05-28_134235.png)

また、`flying > flying state machine -> idle/hover`の`look_at`にエラーが出てるので`bone`の`j_bip_c_neck`を入れます。

これらの飛行中の問題については、リターゲットしない方法でmeshを活用することで問題は発生しません。詳しくは`game animation sample`との統合を見てください。

#### [issue] 飛行の上下左右の向きが反映されない

飛行すると向きが一定になります。視点を動かしても変わりません。

通常だと視点を下に向けると、頭も下を向いて移動しますが、それがありません。下に移動してもずっと横飛行を行います。

これもv5.4で発生し、v5.3では発生しません。

#### [issue] vrm4uのmaterialについて考える 

私は`SubsurfaceProfile`を使用していますが、他のタイプだと影(shadow)と反射(light)の問題がかなり強く出てしまい、あらゆる場面で常用できません。移動したら背景の加減でおかしくなるなど問題が多いのです。

そこで完全に影響を受けない`MToon Unlit`を使用することも考えられます。一部分だけ他のタイプのmaterialを利用して調整していきます。この場合の肌の色を以下に調整するといいでしょう。

<iframe src="https://blueprintue.com/render/wi2aobel/" scrolling="no" width="100%" height="400px"></iframe>

#### [issue] buildすると髪が動かなくなる

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

#### [idea] 作り直すもの

今まで実装開発してきたものはいくつかありますが、代表的なものを挙げます。記録のため動画にしておきます。

<video controls style="width:100%;"><source src="https://git.syui.ai/syui/media/raw/branch/main/yui_20240621.mp4"></video>

- account login system
- account item system
- character lv system
- character skill
- character sword & collision

一気に解説します。移動すると経験値が入ります。Lv1になると変身できるようになります。変身すると飛行できるようになります。飛行できる時間はlvに応じて変化します。特殊なアイテムを取るとスキルを覚えます。スキルにはクールタイムやcollisionなどが設定されており、敵が吹っ飛びます。剣のモーションは原作を再現しています。原作では輪が剣になりますので、剣を登場させたときは輪を消さなければなりません。meshを入れ替える処理などを書いています。アイテム画面やストーリー進行などもapiと連携するシステムを作りました。

これらを全部作り直すことになります。

### game animation sample

- [game animation sample](https://www.unrealengine.com/en/blog/game-animation-sample)
- [superhero flight animations](https://www.unrealengine.com/marketplace/ja/product/superhero-flight-animations)

今回は`game animation sample`と`superhero flight animations`を統合してみました。今までのモーションに加えて空を飛べるようにしたのですが、違和感ない形で自動的にブレンドされます。これは想像以上に大変なことをやっているので`5.4.2`に追従したほうが良さそうです。

ただ、今まで開発実装してきたものがすべて作り直しになります。

インポートできないのかと思われるかもしれませんが、ue5にそんなことできません。動かなくなります。仮に動かせたとしても、おそらく、作り直したほうが早いでしょう。

`game animation sample`と`superhero flight animations`の統合を解説します。

基本的には`BP_SandboxCharacter`にeventの`IA_Sprit`で`anim instance class(ABP_Player)`を指定しますが`BP_Player_UE5`から様々な設定や変数を持ってきて動くように改変していきます。

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-21_025510.mp4"></video>

<iframe src="https://blueprintue.com/render/7z11v96t/" scrolling="no" width="100%" height="400px"></iframe>

### custom gravity

重力をactorに設定し、月の上を歩けるようにします。`gravity direction`を使います。

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-21_225510.mp4"></video>

youtube : [Unreal Engine 5 Tutorial - Custom Gravity UE5.4 Preview](https://www.youtube.com/watch?v=CZK7QplEbJs)

基本的には`bp_actor`を作成し範囲を設定します。`bp_actor`を置いたとき惑星(bp_planet)に親子付けするといいですね。この場合はlocationは`0`, scaleは`1.1`を設定します。

動作は`bp_player(bp_character)`のeventで設定します。具体的には`actor begin`から`gravity direction`します。

gravity directionを無効にする方法が用意されていないようなので、`actor end`で`destroy actor`して`restart player`しています。

<iframe src="https://blueprintue.com/render/tybb0lyd/" scrolling="no" width="100%" height="400px"></iframe>

https://dev.epicgames.com/community/learning/tutorials/w6l7/unreal-engine-custom-gravity-in-ue-5-4

### city sample

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

### ocean waves

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

#### [issue] buildすると雲が中央に集中する

package buildすると光が中央に集中し、雲も全体的におかしくなります。中央に向かってレンダリングが伸びているように見えます。

`BP_EarthSizedClouds`の`Global Wind`が原因です。ここで`Ocean : BP_EarthSizedOcean`に指定するとこの現象が発生します。

#### [issue] 海に入った直前だけ背景が映り込む

`BP_EarthSizedOcean`を編集します。

私が独自に設定している`SM_SkySphere`が潜った瞬間だけそれが表示されてしまうので、`Volume Material Height`は0にしています。

`Above Water Material`にも`Underwater`と同じものを入れてください。

#### [idea] atmoshereで宇宙をつなげる

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

### dynamic volumetric sky

今回は、`dynamic volumetric sky`と`ocean waves`の統合してみました。

- [dynamic volumetric sky](https://www.unrealengine.com/marketplace/ja/product/dynamic-volumetric-sky/)
- [ocean waves](https://www.unrealengine.com/marketplace/ja/product/ocean-waves)

なお、`superhero fligth animations`, `game animation sample`, `city sample`も入っています。

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-29_025510.mp4"></video>

結果として理想の地表と海面、空と雲を手に入れました。

#### [tips] default setting

- BP_DynamicVolumetricSky(self) -> Coloud : Coloud Fly Option
- BP_DynamicVolumetricSky(self) -> Height Fog Max Opacity : 0
- SkyAtmosphere -> Transform Mode : Planet Center at Component Transform
- SkyAtmosphere -> Transform(location-z : -6360)

#### [tips] option setting

- BP_DynamicVolumetricSky(self) -> Single Player Fps Lock : 60 FPS
- VolumetricCloud -> Layer Bottom Sltitude : 20
- VolumetricCloud -> Tracking Start Max Distance : 500
- VolumetricCloud -> Tracking Max Distance : 500
- 2DSky -> visible : false

#### [issue] 地平線

まずはdynamic volumetric skyの地平線を消していきましょう。

普通に考えて地平線を消したいことなんてありそうですけど、英語は[こちら](https://forums.unrealengine.com/t/how-can-i-remove-the-foggy-horizon-in-the-default-skysphere/339893)で説明されています。日本語は見つかりませんでした。これは通常、`Horizon Falloff`で調整しています。

ただし、dynamic volumetric skyは少し特殊です。`Height Fog Max Opacity`を0にすれば消えます。

どうやら`BP_Dynamic_VoluemetricSky`にある`ExponentialHeightFog`で地平線を設定しているようです。これを削除していくか、設定を変更してもいいですが、削除した場合はbuildがおかしくなるかもしれません。削除する場合はcompileするとerrorが出るので使用している箇所の関数やblueprintを削除します。

#### [issue] 海の波紋

dynamic volumetric skyと合わせることで海に波紋が現れます。

これはocean wavesのsky atmosphereが星の中心を規定していることから発生します。つまり、sky atmosphereを星の中心に設定しないと描写の問題が出るということです。

![](/m/post/ue/ue5_2024-06-24_025510.png)

この解消方法はdynamic volumetirc skyのatmoshereのtransformのlocation-zを`-6360`にすることで回避できました。

ただし、わからないところもあって、私は`BP_EarthSizedSpericalMesh`の中に`BP_DynamicVolumetircSky`を入れています。ですから、そのままでも座標は星の中心を指しています。

#### [issue] 海の影

海に円形の影が現れることがあります。これは`BP_DynamicVolumetircSky`の`VolumetricSkySupport`のtransform-scaleを大きくすると海に入る影が大きくなり、1にするとなくなります。

この辺も星の内部に展開される領域に関係します。

#### [idea] 具体的な統合

重要な問題は以上の2点ですが統合には他にやらなければならないことがたくさんあります。

例えば、「dynamic volumetric skyの範囲を超えたとき、一体どうやって地球と太陽と月を表現するのか」です。

さっきまであった太陽がいきなり消えて別の場所に出現したり、見た目が変わったりするのはできれば避けたい。しかし、それだと見た目のクオリティは一気に落ちます。

まずは月を消すことからですが、月は`2DSky`で実装されています。`visible:false`にすればいいでしょう。

次に本物の月を地球の外に回します。ここでは`spline`で軌道を設定しています。

![](/m/post/ue/ue5_2024-06-29_025510.png)

loopさせるには`spline len`をmaxにして`float wrap`します。

<iframe src="https://blueprintue.com/render/8gfrd45h/" scrolling="no" width="100%" height="450px" allowfullscreen></iframe>

#### [idea] 地球の外側

そのままでは宇宙に出たときの見栄えがよくありません。したがって、宇宙に出たとき地球の見た目を整える必要があります。

しかし、これもunreal engineの問題から解決が難しい。私は以下のように実装していますが、良い方法ではありません。

<iframe src="https://blueprintue.com/render/t46sbleq/" scrolling="no" width="100%" height="450px" allowfullscreen></iframe>

#### [idea] 地球の自転

これは失敗談ですが、地球に自転を設定してみました。これで外側を回っている月や太陽はゆっくりした速度で動けば良くなります。つまり、現実に合わせることができる。

しかし、地球を自転させることで地面は揺れマップは崩壊。様々な問題が発生しました。

やはり、ゲーム上で地動説を実現するのは難しいようです。太陽側を回すしかありません。

#### [idea] 本物の地球を作る

`cesium`を使うとgoogle mapと連携できます。
- [cesium](https://www.unrealengine.com/marketplace/ja/product/cesium-for-unreal)

### pixel streaming

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

### [error] install asset

assetをinstallするときにerrorが出ます。原因は`EpicLaucher`のダウンロードキャッシュフォルダ、`VaultCache`です。これを外部であれ内部であれ指定しているわけですが、原因不明のerrorが出て解消できないことがあります。基本的には全く新しいフォルダを作ってそれを指定するとうまくいく場合があります。この際、`VaultCache`という名前にしてはいけませんし、選択してもいけません。

### [error] package to generate with the same ID

> PackagingResults: Error:: [Cook] Tryning to add package in context but there is already a package to with the same ID

大体は[これ](https://forums.unrealengine.com/t/cant-package-game-an-item-with-the-same-key-has-already-been-added/329072)と似たような問題です。

city sampleで頻発します。`Content/_ExternalActors_`を削除して新しいcity sampleの`Content/`を上書きします。

## unreal engine 5.3

ここからは個人的に実装したものをまとめます。

### [tips] モデルを法線で強調する

モデルのoutline(法線)を強調する設定を行います。`Content/yui/model/SK_xxx`を開いて`レンダリング > overlay material`で以下のマテリアルを作成して適用します。

- `Content/yui/model/SK_xxx`

![](/m/post/ue/ue5_2024-05-28_135604.png)

<iframe src="https://blueprintue.com/render/t1xc2azx/" scrolling="no" allowfullscreen width="100%" height="400px"></iframe>

[blueprintue.com](https://blueprintue.com/blueprint/t1xc2azx/)

### [tips] 待機モーションをランダムにする

`ABP_xxx`の`locomotion > idle`にて`random sequence player`を追加します。詳細からanimを追加してランダムで再生できます。

![](/m/post/ue/ue5_2024-05-30_132836.png)

### [tips] アニメーションにエフェクトを付ける

animに時間制限のエフェクトを付けます。通知に`timed niagara effect`を追加して詳細からniagaraを追加します。

![](/m/post/ue/ue5_2024-05-30_132915.png)

### [tips] 剣のモーションを作る

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

### [tips] apiを使って処理を行う

pluginである[varest](https://www.unrealengine.com/marketplace/ja/product/varest-plugin)のpostですが、macで動いたものがwindowsでは動きませんでした。ですが、windowsでイチから作成すると動きました。

ue5は`PATCH`に対応していません。この辺はapiを作り直さないといけないかもしれない。

<iframe src="https://blueprintue.com/render/4qo0qydu/" scrolling="no" width="100%" height="400px"></iframe>

by : [ai](https://blueprintue.com/blueprint/4qo0qydu/)

login処理です。atprotoと連携できればいいなと考えています。

あと、ゲーム公開/非公開はaiのアカウントで判断しています。ある値がtrueなら公開、falseなら非公開です。ここをapiで変更すれば基本的にゲームの起動自体をコントロールできるようになってる。

<iframe src="https://blueprintue.com/render/9v24l5h6/" scrolling="no" allowfullscreen width="100%" height="400px"></iframe>

by : [ai](https://blueprintue.com/blueprint/9v24l5h6/)

### [tips] カメラを近づけるとキャラの表示を変える

透明にフィードアウトする形がいいのですが、非常に面倒なのでoverlayで対応します。

`get world location`, `get actor location`を`distance(vector)`で差を取り`180 >= value`, `100 >= value`で比較して`branch`で`overlay`、100以下の場合は`set visibility`します。

https://historia.co.jp/archives/23521/

`m_outline_7`を変換して使いました。パラメータの調整は厄介で基本設定が`surface, masked, subsurface profile`, パラメータを`U_pos_01 : 0.2`以外は0にします。これは自分が購入したassetの設定です。

### [system] レベルアップ

移動するとrandomで経験値が入るようにしました。大体、40秒間移動すれば1 expです。経験値をapiに保存します。expに応じてlvを表示します。この辺はstatusのuiを再度表示しないといけなかったり、anim-eventを作ったり大変でした。

### [system] アイテムストレージ

アイテムストレージと言っても`wp`です。uiとボタンで作ります。

uiをマウスで動かすには`Set Input Game And UI`を使用します。これ以外だと色々と問題があります。例えば、`Set Input Only`は2回クリックしないとボタンを押せないなど。

基本的にアイテムをapiに保存して、それがある場合はスキルやテレポートを開放します。テレポートはカードを拾う場所に`PlayStart`を置いておきます。`Open Level`の`options`にtagを入れて移動します。

### [tips] 瞳の変化

`create dynamic material instance`

https://historia.co.jp/archives/33401/

これを利用することでmaterialを光らせてそれを設定することで瞳や輪を光らせることができます。ただ常時はやめたほうがいいでしょう。プレイヤーがつかれてしまいます。

### [tips] 物の破壊

> 選択モードから「フラクチャ」モードに変更します。このフラクチャモードで実際に Chaos Destructionに関わるメッシュの分割などを行います。複数選択する。新規作成。一様化で分割。色はジオメトリコレクションの詳細から「Show Bone colors」のチェックを外します。

https://logicalbeat.jp/blog/11044/

### [tips] 表情を動かす

![](/m/post/ue/ue5_2024-05-30_132916.png)

### [tips] 必殺技をつける

レベルシーケンスで作成しました。カメラ移動に苦戦しましたが、それさえやれば割と簡単かも。あと爆発と同時に見えないsphereを作成してsimulate physics, collisionを設定しています。これによりダメージや吹っ飛び判定ができます。なお、play後は`input enable`しておいてください。

<iframe src="https://blueprintue.com/render/xn4sm3ok/" scrolling="no" allowfullscreen width="100%" height="400px"></iframe>


