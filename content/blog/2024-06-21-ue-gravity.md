+++
date = "2024-06-21"
tags = ["ue5","ue"]
title = "ue5.4のcustom gravityを試す"
slug = "ue-gravity"
+++

<video controls style="width:100%;"><source src="/m/post/ue/ue5_2024-06-21_225510.mp4"></video>

youtube : [Unreal Engine 5 Tutorial - Custom Gravity UE5.4 Preview](https://www.youtube.com/watch?v=CZK7QplEbJs)

基本的には`bp_actor`を作成し範囲を設定します。`bp_actor`を置いたとき惑星(bp_planet)に親子付けするといいですね。この場合はlocationは`0`, scaleは`1.1`を設定します。

動作は`bp_player(bp_character)`のeventで設定します。具体的には`actor begin`から`gravity direction`します。

gravity directionを無効にする方法が用意されていないようなので、`actor end`で`destroy actor`して`restart player`しています。

<iframe src="https://blueprintue.com/render/tybb0lyd/" scrolling="no" width="100%" height="400px"></iframe>

https://dev.epicgames.com/community/learning/tutorials/w6l7/unreal-engine-custom-gravity-in-ue-5-4

