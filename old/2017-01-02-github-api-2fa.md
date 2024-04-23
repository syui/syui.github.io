+++
date = "2017-01-02"
tags =  ["memo"]
title = "github-api-2fa"
slug = "github-api-2fa"
+++

```bash
$ curl -sL -i -u $your_user -H "X-GitHub-OTP: $your_2fa_OTP_code" -d '{"scopes": ["repo", "user"], "note": "getting-started"}' https://api.github.com/authorizations
$ curl -i -H "Authorization: token $token" https://api.github.com/repos/$org/$repo/commits/$sha/comments -d "$json"
```

こういうやり方でトークンを取得した場合、`getting-started`の名前で発行されるので、管理画面からそれを見つけて削除しないと再度同じ名前で発行できない。
	  
