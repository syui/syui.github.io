+++
date = "2024-06-19"
tags = ["ue5","ue"]
title = "ue5.4でgame animation sampleを試してみる"
slug = "ue-game-animation"
+++

## 前提

- [ue 5.4.2](https://www.unrealengine.com/en)
- [game animation sample](https://www.unrealengine.com/en/blog/game-animation-sample)

## 解説

`game animation sample`を使うと標準的なモーションをキャラクターに適用することができます。しかも、`epic games`が提供しているため無料です。

今回はゲームモードで自身のキャラクターを選択する方法を紹介します。

1. pluginのvrm4uを有効にする
2. vrmを`/Character/ai/Rigs`に読み込む
3. `/Blueprints/ABP_Sandbox_Character`を右クリックでアニメーションをリターゲットして`/Character/ai/anim/`に作成する。

> source : SKM_UEFN_Mannequin
> 
> target : SK_ai
>
> retarget : RTG_UEFN_ai

なお、この手順は本来不要です。読み飛ばしても構いません。しっかりとしたアニメーションを利用したいときに使えるのでやっておくのがおすすめです。

4. `/Blueprints/RetargetedCharacters/CBP_SandboxCharacter_Manny`を複製して`/Blueprints/RetargetedCharacters/CBP_SandboxCharacter_ai`にする
5. SkeletalMeshを`/Character/ai/Rigs/SK_ai`に設定して、Tag(Component Tags)を`RTG_UEFN_ai`に変更する

> tags[0] : RTG_UEFN_ai

6. `/Blueprints/RetargetedCharacters/ABP_GenericRetarget`を開いて変数の`IKRetargeter_Map`を追加する

> RTG_UEFN_ai : /Character/ai/Rigs/RTG_UEFN_ai

7. GameMode : GM_Sandbox > Bone : CBP_SandboxCharacter_ai

これで自身のキャラクターを動かせるようになります。今まで色々なモーションを試してきましたが、これは相当しっかり動きます。

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-20_125510.mp4"></video>

髪の毛が途中から動かなくなるのは以前解説したvrm4uのバグだと思います。standaloneで確認してください。

