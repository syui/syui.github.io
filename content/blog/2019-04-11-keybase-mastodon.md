+++
date = "2019-04-11"
tags = ["mastodon","keybase"]
title = "keybaseにmastodonがやって来ました"
slug = "keybase-mastodon"
+++

mastodonにkeybaseが来たのか、keybaseにmastodonが来たのか、タイトルを少し迷いましたが、後者にしました。

まず、mastodonがkeybase proofに対応するjsonを出力する実装、その他を行い、keybaseが大手mastodonドメインを自サーバー内に登録することによって、連携が可能になりました。ここで、最も連携に重要だったポイントは、keybaseサーバーに特定のドメインが登録されるということでしたので、タイトルを後者にしました。

しかし、そんなことはどうでもいいです。ユーザーにとって重要なのは、keybaseが何であるのかや、プロフィールにチェックマーク(認証マーク)が付くことだけですから。

ここで、keybaseを、可能な限り個人証明に適したサイト、及びサービスのこととしておきましょう。

では、個人証明というのはなんなのかというと、これは、色々な外部サービスのアカウント(twitterやgithub)とkeybaseのアカウントを結びつけて、keybaseの"syui"は、twitterやgithubでは、このアカウントを所有していますよーという感じで行います。また、自分が管理するドメインも登録できたりします。

そうすることによって、なりすましの防止やネット上の同一性がわかりやすくなります。

ネット上でも、名前というのは意外に重要です。誰でもネット上で呼ばれる名前、呼ばれたい名前ってありますよね。私の場合は、"syui"です。由来は、本名からですが、それはどうでも良くて、重要なのは、おおよそ、ネット上での呼び名を個々人が持っているということですね。そして、それは他の人とよく重複(競合)します。本名でもそうですよね。たくさんの田中さんや太郎さんがいます。

そんな中、この太郎さんは、一体、どこの太郎さんなのかってのが、ネット上でも分かりづらいことがあります。keybaseは、それをわかりやすくしてくれるってことです。

今回は、それがmastodonでも可能になったという話ですが、mastodon上からもkeybaseのアカウント証明を示してくれるようになりました。で、連携させると、mastodonのプロフィールに書かれたkeybaseへのリンクに認証マークが付くんですよね、かっこいいですね。

どういうようにやるのかというと、keybaseのアプリを起動して、特定のコマンドを実行します。(あるいはWeb UIからも可能です、後々、どうなるかはわかりませんが

```sh
$ open -a keybase
# keybase prove $DOMAIN $USER
$ keybase prove mastodon.social syui
# ここに表示されたURLをクリックして、承認すると連携が可能になる
```

なお、keybaseには、個人証明だけでなく、他にも様々な機能があります。暗号化、非暗号化メッセージのやり取りや公開鍵、秘密鍵の管理など。

keybaseやmastodon、流行るといいですねー。(keybaseは"syui"というidをかろうじて取得できたため、id取りそこねたtwitterより流行って欲しさある。めちゃくちゃ個人的な理由

<iframe src="https://mastodon.social/@keybase/101903490896785857/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400" allowfullscreen="allowfullscreen"></iframe><script src="https://mastodon.social/embed.js" async="async"></script>

[もっと詳しく](https://qiita.com/syui/items/b60f8e1920930eff76b0)
