+++
date = "2020-05-23"
title = "udrs"
description = "| rustで書かれたurl支援するツール"
+++

`udrs`は、rustで書かれたurlの整形支援するcliツールです。base64のencode,decodeや指定した区切りで取得することができます。

[Download](https://github.com/syui/udrs/releases)

```sh
#base64 encode
$ udrs e "hello world."
aGVsbG8gd29ybGQu

$ udrs d "aGVsbG8gd29ybGQu"
hello world.

$ udrs ud "foo%20bar"
foo bar

$ udrs ud "https://github.com/ksk001100/seahorse" -l
/ksk001100/seahorse

$ udrs ud "https://github.com/ksk001100/seahorse" -p
https

$ udrs ud "https://github.com/ksk001100/seahorse" -d
github.com
```

