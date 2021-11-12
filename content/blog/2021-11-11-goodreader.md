+++
date = "2021-11-11"
tags = ["ios"]
title = "goodreaderからopnessh(fstp)にpublic-keyでアクセスする"
slug = "goodreader"
+++

> goodreader(latest)でopenssh 8.7に対応

iosには昔からgoodreaderという便利なアプリがあります。

これがずっと便利で(遥か昔から今日に至るまでiosには他に便利なアプリがあまりなかったとも言う)、このアプリ、すごく基本的なことができるのです。

androidでは普通にできるようなことができ、例えば、ssh(sftp) serverにpublic-key方式でアクセスしたりできるんですけど、一時期からupdateが滞り、openssh verによっては、public-keyなどによるアクセスが使えなくなっていました。

しかし、ここ最近のupdateで`openssh 8.7(openssl 1.1.1)`ならpublic-keyでも接続可能になりました。

