+++
date = "2016-10-12"
tags =  ["pc"]
title = "GitLabPagesでドメイン.cfを使うことにした"
slug = "freenom-cloudflare-gitlab"
+++

## GitLab Pagesでドメイン.cfを使うことにした

今回はドメインの取得からネームサーバーを使ったSSL有効化まで全部を無料(Free)で済ませています。

まず、ドメインは`.tk, .ml, .cf`などが無料になっている[Freenom](http://www.freenom.com/)を使って取得します。IPを辿ってみると、`dot tk`ぽいですね。

次に、[CloudFlare](https://www.cloudflare.com/)を使ってFreenomで取得したドメインを解析、登録します。内容は以下を参考に。

- `syui.cf A 104.208.235.32`

- `www CNAME syui.gitlab.io`

ちなみに、A(root)の[104.208.235.32](https://about.gitlab.com/2016/04/07/gitlab-pages-setup/#custom-domains)はGitLabのWebサーバーのものです。あとはCloudFlareで取得したネームサーバーを`Freenom`に登録します。登録されたか確認するのは以下のコマンド。

```bash
$ dig syui.cf +nostats +nocomments ns
```

最後に`CloudFlare`にてSSLの設定を行います。

![](https://raw.githubusercontent.com/syui/img/master/old/freenom_gitlab_11.png)

ここの`Crypto`, `Page Rules`を選択して適時設定。

![](https://raw.githubusercontent.com/syui/img/master/old/freenom_gitlab_12.png)

![](https://raw.githubusercontent.com/syui/img/master/old/freenom_gitlab_13.png)

結果をブラウザで確認。

![](https://raw.githubusercontent.com/syui/img/master/old/freenom_gitlab_16.png)

## なぜ.cfを選択したのか

無料のなかで色々あるのになぜ`.cf`を選択したのかというと、何となくです。

まあ、`.com`の`.c`が一致していることと、また個人的に`cf`はよく見かけるような気がするので(気のせいかもしれないけど)。

調べてみると、アフリカ中央らしい。ドメインには国別やら色々とあって、例えば、`.io`はイギリスで`.jp`は日本です。

でも、IT関連では`.io`が割りと人気で、その理由としてはGoogle IOなどがあり、そういった意味でIOとかけているからだと思われます。

まあ、ドメインにあまり深い意味を求めてはいけないということで。

おわり。
