+++
date = "2016-12-22"
tags =  ["memo"]
title = "前回の記事をちょっとだけ補足"
slug = "docker-arch"
+++

## 前回の記事をちょっとだけ補足

まず、Arch Linuxってしばらくアップデートしないと動かなくなるんですよね。もちろん、Archで作ったイメージもそうです。巷にあるDockerのArchイメージも古くなっていて動かないものが多いんですよね。

ということで、Dockerで作ったArchのイメージを自動アップデートしようと考えたのが前に紹介した記事の内容。

これをどうやってやってるのかというのは、それ自体簡単。けど、色々と問題もあって。

一応、GitHubにある[archlinuxjp/docker-archlinux](https://github.com/archlinuxjp/docker-archlinux)のREADMEやもしくはその他のリポジトリだったりにまとめてあったり、[slack/archlinuxjp](https://archlinuxjp.slack.com)の`#repository`チャンネルに通知されるようになっていて、定期のDocker PushやTravisのBuildが流れるようになったりしてます。

readmeに書いてることはわかりにくいかもしれませんが、このブログよりはわかりやすく書いてあるとは思います。

あと、やっぱり、ArchのDockerイメージは使いやすいです。Alpineはglibcなどの問題があって、あのあたり本当に面倒ですし、特に調べなくてもぱっと書いて、ぱっと動く、思った通り動くのはやっぱりArchなので(自分にとっては)、色々なことをしようとすると、やっぱり、AlpineではなくArchのイメージを使うことになります。
	  
