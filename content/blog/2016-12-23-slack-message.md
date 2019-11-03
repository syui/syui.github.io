+++
date = "2016-12-23"
tags =  ["memo"]
title = "slack-message"
slug = "slack-message"
+++

https://api.slack.com/docs/message-attachments

上記を参考にしつつweb hookを使ってメッセージを構築するんだけど、travisで通らなかった。長すぎたのかもしくは、`[]`が原因かどちらか。回避方法としては、ENVを使う方法があるかもしれないけど試してない。

```bash
script :
	- curl -X POST "$SLACK_WEB_URL" -d "payload=$JSON"
```
	  
