+++
date = "2016-09-28"
tags =  ["memo"]
title = "RubyってArchLinuxにデフォルトで入ってなかったっけ?"
slug = "ruby-jekyll"
+++

## RubyってArch Linuxにデフォルトで入ってなかったっけ?	  

base, base-develに含まれていると勘違いしていたぽいのでインストールとPATHの追加。

```bash
$ sudo pacman -S ruby
$ gem i jekyll
$ which jekyll
...No
$ gem env
$ export PATH=$PATH:~/.gem/ruby/bin
$ which jekyll
...OK
```

面倒なので詳しくは調べてない。
	  
