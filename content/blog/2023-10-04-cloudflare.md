+++
date = "2023-10-04"
tags = ["cloudflare"]
title = "cloudflare pagesでbasic認証"
slug = "cloudflare"
+++

https://github.com/Charca/cloudflare-pages-auth

- ./functions

- env:`CFP_PASSWORD`

cloudflareは、zero-trustで簡単に認証を追加することができます。

passwordのみの場合は、cloudflare pagesの`functions`を追加することで実現できます。

`./functions`というディレクトリを`/`に置いて、`.ts`を追加します。


