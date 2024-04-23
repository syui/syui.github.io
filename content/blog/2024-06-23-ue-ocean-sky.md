+++
date = "2024-06-23"
tags = ["ue5","ue"]
title = "ue5.4でocean wavesで星と空と海をつなげる"
slug = "ue-ocean-sky"
+++

今回は星と空と海を融合する方法を紹介します。この現実方式はgame engineでは相当に難しいことです。そのためこれをやる人はあまりいませんし、必要性もありません。おすすめもできません。

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-22_025510.mp4"></video>

これには様々な問題があり不便があります。また、ゲームプレイでは必要ない部分、見えない部分になるので、多くの開発者は一般的なゲーム方式を採用します。

それでもこの方式を採用したい場合は`ocean waves`が参考になります。このassetは結構すごいことをやっています。

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

### buildすると雲が中央に集中する

package buildすると光が中央に集中し、雲も全体的におかしくなります。中央に向かってレンダリングが伸びているように見えます。

`BP_EarthSizedClouds`の`Global Wind`が原因です。ここで`Ocean : BP_EarthSizedOcean`に指定するとこの現象が発生します。

### 海に入った直前だけ背景が映り込む

`BP_EarthSizedOcean`を編集します。

私が独自に設定している`SM_SkySphere`が潜った瞬間だけそれが表示されてしまうので、`Volume Material Height`は0にしています。

`Above Water Material`にも`Underwater`と同じものを入れてください。

## 統合は難しい

これを他のmapと統合するのはかなり難しいです。新しく自分で作っていくのも難しい部分が多いでしょう。

なぜならこの方式はmapのすべてに関係してくるからです。ものを作る場合、通常は部品を分割しながら作ります。ですが、この方式はそれが難しいのです。

一般的によく使用されている`volumetric sky`なども使用は難しいでしょう。昼夜や天候を変えるのは大変で、天体を動かしてlightを連動しなければならなりません。

他にも難しいところはたくさんあって、ロードも遅いですし、この方式でmapを作っていくと取り返しがつかないことになりかねません。

ですから、よほどのこだわりがない限り一般的な方式をおすすめします。

city sampleをベースに作ってみました。city sampleをベースにすることには様々な問題があり、難しい部分が存在します。例えば、city sampleの読み込みは少し特殊です。色合いの調整なども複雑でbuildに相当の時間がかかるようになります。buildすると見た目が変更されることも多く、確認や修正も大変になります。また、よく落ちるようになります。これが分離しているならいいですが、この方式にcity sampleを入れるのは危険です。

また、現実方式を採用すると、その空間内でのみ美しく表現する一般方式に比べ品質の粗が目立つようになります。例えば、雲や海、星などです。天候や季節の表現もより難しくなるでしょう。品質も落とさなければなりません。

なぜかというと、ゲームは近づけば近づくほど品質は下がります。つまり、一般方式では遠くに置いて近づけないようにするからこそ綺麗に表現できているのです。それ以外にマップを分けたり、空間を区切ったりすることで高品質を実現しています。

それが現実方式ではすべてを一つの空間に置くことになります。置かれたものには近づくことができます。この状態で高品質を実現するのは難しいのです。

仮に品質を下げない場合、広いマップすべてに高品質のテクスチャを使うことになりパソコンのスペックをオーバーします。

また、オーバーしなければそれでいいのかというと、そうでもありません。今のゲームはあらゆるデバイスで動作することを求められます。したがって、できる限りスペック要求を低くするのが望ましいのです。

つまり、この方式は開発も品質も統合も難しくて、あまりおすすめできるものではありません。

相当なこだわりがある人向けという感じのものです。

