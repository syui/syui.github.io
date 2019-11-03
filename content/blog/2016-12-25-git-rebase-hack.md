+++
date = "2016-12-25"
tags =  ["pc"]
title = "git-rebase-hack"
slug = "git-rebase-hack"
+++

前回の記事の補足として一つのGitハックを紹介します。

(というか前回の記事に含めて書いてたつもりだったけど確認してみたところなぜか書かれてなかったという...。

```bash
# mac
$ GIT_SEQUENCE_EDITOR="sed -i '' -e '2,\$d'" git rebase -i --root
# linux
$ GIT_SEQUENCE_EDITOR="sed -i -e '2,\$d'" git rebase -i --root
```

これは最初のコミットへ強制的に戻すコマンドで`GIT_EDITOR`あたりの変数がポイントになりそう。rebaseの一つの使い方として、このようにcommitを戻して、最新のrepositoryをそこ(./.gitがあるところ)へコピーしcommit, pushすれば、履歴の上書きが可能。

基本的には`cat /usr/local/Cellar/git/$(git --version|cut -d ' ' -f 3)/libexec/git-core/git-rebase*`あたり見て色々確認したりするのが面白いかもしれません(実際、やらないけど)。

あと、上記は`/Cellar`からもわかるようにmac(brew)。一般的なlinuxの場合は`/share`とかになりそう(これはpackage managerによる)。

各種のGit Commandというのはあまり知られてなさそうなことですが、かなりの割合でShell Scriptだという気がしなくもないですね(適当)。

今回はちょっとまともに書いた気がしなくもない(補足含めて)。おわり。
