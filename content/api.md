+++
title = "api"
date = "2022-02-27"
+++

```sh
$ curl api.syui.cf/users/1
```

<link href="/tarot-api/chunk-vendors.js" rel="preload" as="script">
<div id="app"></div>
<script src="/tarot-api/chunk-vendors.js"></script>
<script src="/tarot-api/app.js"></script>
<link href="/tarot-api/app.css" rel="stylesheet">

```sh
# play(draw)
$ curl -X PUT api.syui.cf/users/1/d
$ curl api.syui.cf/users/1 | jq .
{
  "id": 1,
  "user": "syui",
  "chara": "ai",
  "skill": 9,
  "hp": 19,
  "attack": 27,
  "defense": 15,
  "critical": 50,
  "day": 14,
  "limit": false,
  "status": "admin",
  "comment": "attack+6",
  "created_at": "2022-06-11T10:22:11Z",
  "next": "20220612",
  "updated_at": "2022-06-11T11:17:31Z"
}
```

```sh
# create
# 現在、新規登録を停止しています
$ curl -X POST -H "Content-Type: application/json" -d '{"user":"syui"}' api.syui.cf/users

# delete
# 現在、ユーザーの削除を停止しています
$ curl -X DELETE api.syui.cf/users/1

# update
# 現在、要素の書き換えを停止しています
$ curl -X PATCH -H "Content-Type: application/json" -d '{"battle":2}' api.syui.cf/users/1 
```
