+++
date = "2016-12-24"
tags =  ["memo"]
title = "gitバージョンアップでrebaseでエラーが出るようになった"
slug = "git-rebase"
+++

## gitバージョンアップでrebaseでエラーが出るようになった

権限エラーっぽいのが出るようになった時の話。

例えば、コミットログを一括削除するには以下のような感じいける。面倒になった。

```bash
$ git checkout --orphan newroot
$ git rm -rf .
$ git commit --allow-empty -m 'root commit'
$ git rebase --onto newroot --root master
$ git branch -d newroot
$ git push

$ git rebase -i --root
```

とくにコミットログが肥大化すると、cloneが遅くなったり、必要なログが見つけられなかったり、HDD容量を圧迫したりするので、私は不要なログは削除するようにしてる。

ただ、弊害もあるのでケースバイケースやタイミングの問題だったりもする。
	  
