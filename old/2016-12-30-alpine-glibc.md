+++
date = "2016-12-30"
tags =  ["memo"]
title = "Alpineでハマりそうな点(glibc)"
slug = "alpine-glibc"
+++

## Alpineでハマりそうな点(glibc)

```bash	  
FROM alpine:edge

RUN apk add --update fontconfig libstdc++ libc6-compat

RUN apk add --no-cache ca-certificates
RUN mkdir /lib64 && ln -s /lib/libc.musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2
RUN mkdir -p /usr/lib && ln -s /lib/libz.so.1 /usr/lib/libz.so.1
RUN ln -s /lib/libc.musl-x86_64.so.1 /usr/lib/libc.musl-x86_64.so.1

RUN echo -e "@testing http://dl-4.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk add --update cargo@testing
RUN cargo install mdbook
```

参考 : https://github.com/gliderlabs/docker-alpine/issues/11

どうしても面倒くさい場合は以下のイメージを使いましょう。

https://github.com/sgerrand/alpine-pkg-glibc

https://hub.docker.com/r/frolvlad/alpine-glibc/

Arch Linuxのほうがはるかに使いやすいです。ただ、Alpineはミニマムなのでその辺は仕方ないのでしょう。
