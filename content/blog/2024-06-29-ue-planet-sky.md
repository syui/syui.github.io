+++
date = "2024-06-29"
tags = ["ue5","ue"]
title = "ue5.4でdynamic volumetric skyとocean wavesの統合"
+++

今回は、`dynamic volumetric sky`と`ocean waves`の統合してみました。

結果として理想の地表と海面、空と雲を手に入れました。

- [dynamic volumetric sky](https://www.unrealengine.com/marketplace/ja/product/dynamic-volumetric-sky/)
- [ocean waves](https://www.unrealengine.com/marketplace/ja/product/ocean-waves)

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-29_025510.mp4"></video>

## issue:地平線

まずはdynamic volumetric skyの地平線を消していきましょう。

普通に考えて地平線を消したいことなんてありそうですけど、英語は[こちら](https://forums.unrealengine.com/t/how-can-i-remove-the-foggy-horizon-in-the-default-skysphere/339893)で説明されています。日本語は見つかりませんでした。これは通常、`Horizon Falloff`で調整しています。

ただし、dynamic volumetric skyは少し特殊です。

どうやら`BP_Dynamic_VoluemetricSky`にある`ExponentialHeightFog`で地平線を設定しているようです。これを削除していくか、設定を変更していく必要があります。削除する場合はcompileするとerrorが出るので使用している箇所の関数やblueprintを削除します。

## issue:海の波紋

dynamic volumetric skyと合わせることで海に波紋が現れます。

これはocean wavesのsky atmosphereが星の中心を規定していることから発生します。つまり、sky atmosphereを星の中心に設定しないと描写の問題が出るということです。

![](/m/post/ue/ue5_2024-06-24_025510.png)

この解消方法はdynamic volumetirc skyのatmoshereのtransformのlocation-zを`-6360`にすることで回避できました。

ただし、わからないところもあって、私は`BP_EarthSizedSpericalMesh`の中に`BP_DynamicVolumetircSky`を入れています。ですから、そのままでも座標は星の中心を指しています。

## issue:海の影

海に円形の影が現れることがあります。これは`BP_DynamicVolumetircSky`の`VolumetricSkySupport`のtransform-scaleを大きくすると海に入る影が大きくなり、1にするとなくなります。

この辺も星の内部に展開される領域に関係します。

## 具体的な統合

重要な問題は以上の2点ですが統合には他にやらなければならないことがたくさんあります。

例えば、「dynamic volumetric skyの範囲を超えたとき、一体どうやって地球と太陽と月を表現するのか」です。

さっきまであった太陽がいきなり消えて別の場所に出現したり、見た目が変わったりするのはできれば避けたい。しかし、それだと見た目のクオリティは一気に落ちます。

まずは月を消すことからですが、月は`2DSky`で実装されています。`visible:false`にすればいいでしょう。

次に本物の月を地球の外に回します。ここでは`spline`で軌道を設定しています。

![](/m/post/ue/ue5_2024-06-29_025510.png)

loopさせるには`spline len`をmaxにして`float wrap`します。

<iframe src="https://blueprintue.com/render/8gfrd45h/" scrolling="no" width="100%" height="450px" allowfullscreen></iframe>

## 地球の外側

そのままでは宇宙に出たときの見栄えがよくありません。したがって、宇宙に出たとき地球の見た目を整える必要があります。

しかし、これもunreal engineの問題から解決が難しい。私は以下のように実装していますが、良い方法ではありません。

<iframe src="https://blueprintue.com/render/t46sbleq/" scrolling="no" width="100%" height="450px" allowfullscreen></iframe>

## 地球の自転

これは失敗談ですが、地球に自転を設定してみました。これで外側を回っている月や太陽はゆっくりした速度で動けば良くなります。つまり、現実に合わせることができる。

しかし、地球を自転させることで地面は揺れマップは崩壊。様々な問題が発生しました。

やはり、ゲーム上で地動説を実現するのは難しいようです。太陽側を回すしかありません。

