+++
date = "2016-08-01"
tags =  ["memo"]
title = "swift-swiftra"
slug = "swift-swiftra"
+++

[swiftra](https://github.com/takebayashi/swiftra)というものがあります。名前からも分かるように[sinatra](http://www.sinatrarb.com/)をリスペクトして作成されているぽい。

```bash
$ git clone https://github.com/takebayashi/swiftra-example.git
$ cd swiftra-example
$ swift build
$ ./.build/debug/swiftra-example
$ curl 'http://localhost:8080/abc'
/abc was requested with GET
$ curl -X POST -d foo=bar 'http://localhost:8080/abc'
/abc was requested with POST, body = foo=bar  
```
