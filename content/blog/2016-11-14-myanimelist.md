+++
date = "2016-11-14"
tags =  ["memo"]
title = "myanimelistapi"
slug = "myanimelist"
+++

## myanimelist api		

https://myanimelist.net/modules.php?go=api

```bash
url=https://myanimelist.net/api/account/verify_credentials.xml 
pass=xxxxx
curl -i -u $USER:$pass $url
```

通らないときはしばらく時間を置きましょう。私はある時突然通るようになりました。

非公式

http://mal-api.com

doc : https://classes.soe.ucsc.edu/cmps161/Winter12/proposals/bbtran/proposal/malunofficialapi.html

twitter : https://twitter.com/sliceoflifer/status/394805419006103552 , https://twitter.com/sliceoflifer/status/395211403721588736

https://api.atarashiiapp.com/ , https://atomiconline.wufoo.com/forms/mal-api-usage-notification/

正直、公式APIも非公式APIもよくわからないです。というかmyanimelist.netのインターフェイス諸々(多分、バックグラウンド含め)古すぎてやばいように思います。
	
