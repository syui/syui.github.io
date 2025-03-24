+++
date = "2024-06-20"
tags = ["ue5","ue"]
title = "ue5.4にupdateすることにした"
slug = "ue-game-animation"
+++

## 前提

- [ue 5.4.2](https://www.unrealengine.com/en)
- [game animation sample](https://www.unrealengine.com/en/blog/game-animation-sample)
- [superhero flight animations](https://www.unrealengine.com/marketplace/ja/product/superhero-flight-animations)

今回は`game animation sample`と`superhero flight animations`を統合してみました。今までのモーションに加えて空を飛べるようにしたのですが、違和感ない形で自動的にブレンドされます。これは想像以上に大変なことをやっているので`5.4.2`に追従したほうが良さそうです。

ただ、今まで開発実装してきたものがすべて作り直しになります。

インポートできないのかと思われるかもしれませんが、ue5にそんなことできません。動かなくなります。仮に動かせたとしても、おそらく、作り直したほうが早いでしょう。

## game animation sampleで飛べるようにする

`game animation sample`と`superhero flight animations`の統合を解説します。

基本的には`BP_SandboxCharacter`にeventの`IA_Sprit`で`anim instance class(ABP_Player)`を指定しますが`BP_Player_UE5`から様々な設定や変数を持ってきて動くように改変していきます。

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-21_025510.mp4"></video>

<iframe src="https://blueprintue.com/render/7z11v96t/" scrolling="no" width="100%" height="400px"></iframe>

## sky atmosphereを使って宇宙をつなげる

- [cesium](https://www.unrealengine.com/marketplace/ja/product/cesium-for-unreal)
- [ocean waves](https://www.unrealengine.com/marketplace/en-US/product/ocean-waves)

私が作ってきたlv(map)は宇宙と街でわけられていました。

これは特別なことではなく当たり前のことで、mapは基本的に平面なのです。平面のmapにキャラクターやフィールドを配置していくのです。

私の場合はサークルのアクターを用意してぶつかると別の場所に移動するように設定していました。

しかし、これは本来やりたかったことではありません。現実に基づいたものを作りたかった。宇宙と街が異なる場所に置かれるのではなく、最初からつながっている形が良かったのです。

例えば、空に上昇して大気圏を抜けると宇宙に行ける形です。空に上昇すると宇宙マップに移動させられる形ではありません。

なぜこのようなことがやりたかったのかというと「目に見えない部分もしっかり作られているゲームを作りたかったから」です。

昼と夜がゲーム内で再現されていることがよくあります。これは単にライトと月の絵を背景で回しているだけなのです。しかし、私はゲーム内でもその場所に行くと本物そっくりの天体が動いている、そういうのがいいなと思っていました。

今回は、それを実現するために[sky atmosphere](https://dev.epicgames.com/documentation/en-us/unreal-engine/sky-atmosphere-component-in-unreal-engine)を利用するようにしました。

また、月などの天体には重力がありませんでした。そのまま丸い球体が浮いているという形だったのです。ですから、上から落下すると月に乗れますが、横からだと乗れません。ぶつかるだけです。これを改善したかった。

https://dev.epicgames.com/community/learning/tutorials/w6l7/unreal-engine-custom-gravity-in-ue-5-4

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-21_125510.mp4"></video>

> `game animation sample`には飛び越せるブロックがあります。あれをフィールドに設置して岩にかぶせ見えないようにすることで動作します。見えないようにというのはブロックのmeshをvisibilityで制御します。

しかし、注意点もあります。太陽と月を追加するとあまりに負荷が高くなったのか落ちるようになったことがありました。いくつか改善すると治りましたが、この形を採用するとbuildが通らなくなることもあります。

## vrm4uのmaterialについて考える 

私は`SubsurfaceProfile`を使用していますが、他のタイプだと影(shadow)と反射(light)の問題がかなり強く出てしまい、あらゆる場面で常用できません。移動したら背景の加減でおかしくなるなど問題が多いのです。

そこで完全に影響を受けない`MToon Unlit`を使用することも考えられます。一部分だけ他のタイプのmaterialを利用して調整していきます。この場合の肌の色を以下に調整するといいでしょう。

<iframe src="https://blueprintue.com/render/wi2aobel/" scrolling="no" width="100%" height="400px"></iframe>

## 作り直すもの

今まで実装開発してきたものはいくつかありますが、代表的なものを挙げます。記録のため動画にしておきます。

- account login system
- account item system
- character lv system
- character skill
- character sword & collision

一気に解説します。移動すると経験値が入ります。Lv1になると変身できるようになります。変身すると飛行できるようになります。飛行できる時間はlvに応じて変化します。特殊なアイテムを取るとスキルを覚えます。スキルにはクールタイムやcollisionなどが設定されており、敵が吹っ飛びます。剣のモーションは原作を再現しています。原作では輪が剣になりますので、剣を登場させたときは輪を消さなければなりません。meshを入れ替える処理などを書いています。アイテム画面やストーリー進行などもapiと連携するシステムを作りました。

これらを全部作り直すことになります。
