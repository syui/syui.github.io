+++
date = "2016-07-18"
tags =  ["pc"]
title = "gitbook-mdbook"
slug = "gitbook-mdbook"
+++

`gitbook`から`mdbook`に移行するのが最近の流行らしい。

https://github.com/azerupi/mdBook

`gitbook`は結構遅いし不満があるらしい。何より古い。

反対に`mdbook`は`rust`を使います。

```bash
# packager for rust
$ cargo install mdbook

$ git clone https://github.com/azerupi/mdBook.git
$ cargo build
```
