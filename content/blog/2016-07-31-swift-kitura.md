+++
date = "2016-07-31"
tags =  ["memo"]
title = "swift-kitura"
slug = "swift-kitura"
+++

Swiftには[Kitura](https://github.com/IBM-Swift/Kitura)というWeb Frameworkがあります。IBMが提供していて、[Bluemix](https://www.ibm.com/cloud-computing/jp/ja/bluemix/)で動かすことも出来ます。

```bash
$ git clone https://github.com/IBM-Swift/Kitura
$ cd Kitura

$ brew install http-parser pcre2 curl hiredis
$ export PATH="/Library/Developer/Toolchains/swift-latest.xctoolchain/usr/bin:$PATH"

$ make test

$ mkdir MyApp 
$ cd MyApp
$ swift build --init
$ cat Package.swift >> MyApp/Package.swift
$ vim !$
$ swift build
$ cp Packages/Kitura-net-0.3.0/Makefile-client Makefile
$ vim MyApp/main.swift

$ vagrant up
$ docker pull ibmcom/kitura-ubuntu:latest
$ docker run -i -p 8090:8090 -t ibmcom/kitura-ubuntu:latest /bin/bash
```
	  
