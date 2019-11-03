+++
date = "2019-04-30"
tags = ["pokemon"]
title = "ポケモンバトルのアニメーションを作ってみた"
slug = "pokemongo"
+++

せっかくポケモントレーナーのイラストを書いたので、アニメーションでも作ってみようかなと思って作ってみました。

![](https://raw.githubusercontent.com/mba-hack/images/master/illust_pokemongo_2019-03.gif)

mp4でBGM付きのやつを作ろうかなとも思ったけど、そこまでの気力はなかった。BGMのほか、効果音とかも作らないとだし。

HPメーター動かすやつだけど、画面撮影して、長方形(白)をびゅーっと動かして、ffmpegでmp4からpngに変換して使えば行けそうだと思ったけど、macの画像編集は端に青い点が付くし、mediban paintは、最後に塗りつぶす感じだったのでやめた。なので、結局、HPメーターはtiffからpngに変換して使ったりしました。

追記 :

せっかくなので`.gif`だけでなく、動画にもしてみた。

<div style="position:relative;height:0;padding-bottom:56.25%"><iframe src="https://www.youtube.com/embed/il4KvHhGlng?rel=0&amp;controls=0&amp;showinfo=0&amp;ecver=2" width="640" height="360" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" style="position:absolute;width:100%;height:100%;left:0" allowfullscreen></iframe></div>

効果音とかはこちらから持ってきたりして編集。

https://www.youtube.com/audiolibrary/soundeffects

