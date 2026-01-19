+++
date = "2025-06-10"
lastmod = "2025-06-10"
tags = ["ubuntu","m"]
title = "ubuntu"
slug = "ubuntu"
+++

稀にubuntu serverを使うことがあります。sshが遅いことがあります。ipv6を使用している場合などが影響しているのかもしれません。

```sh
$ ssh -4 user@server
```

> ~/.ssh/config

```sh:~/.ssh/config
Host ubuntu
	HostName 192.168.1.2
	User syui
	Port 22
	IdentityFile ~/.ssh/ubuntu
	AddressFamily inet
```

> /etc/ssh/sshd_config

```sh:/etc/ssh/sshd_config
UseDNS no
GSSAPIAuthentication no
GSSAPICleanupCredentials no
```
