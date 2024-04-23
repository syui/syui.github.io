+++
date = "2016-06-19"
tags =  ["pc"]
title = "xclip-display"
slug = "xclip-display"
+++

クリップボードアプリで有名なのは`xsel`と`xclip`です。

ただし、`x`や`ssh`で扱うには多少のオプションが必要になります。

```bash
$ echo test | xclip -i -sel c -d :0
$ xclip -o -sel c -d :0
```

上記オプションは、`input, output`と`-sel clipboard`, `-display :0`になります。
