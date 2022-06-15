+++
title = "api"
date = "2022-02-27"
+++

```sh
$ curl api.syui.cf/users/1
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
# play(draw)
$ curl -X PUT api.syui.cf/users/1/d
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

### hint

> 最初に引いたキャラを対戦で強くしていくapi

```sh
// 対戦の開始
$ curl -X PUT api.syui.cf/users/1/d

// 結果の確認
$ curl api.syui.cf/users/1
{
	"win": 0,
	"comment": "loss"
}
```

このapiには遊びの要素があります。登録したユーザーに1人のキャラがランダムで割り当てられます。初期のステータスはランダムで決まり、1日に数回(上限2)、対戦することができます。対戦相手は`battle`で指定できます。自身のステータスと対戦相手のステータス、運によって勝敗が決まります。

```sh
$ curl -X PATCH -H "Content-Type: application/json" -d '{"battle":2}' api.syui.cf/users/1 
```

対戦に勝つとステータスが0-20の間でランダムに上昇します。より強い相手に勝つとより大きく上昇する可能性があります。しかし、負ける確率も高くなります。

```sh
$ curl api.syui.cf/users/1
{
	"win": 1,
	"comment": "attach+12"
}
```

`status`には引いた同キャラのレア度を表示します。低い確率でレアカード`super`を排出します。対戦を重ねると`normal`がまれに変化することがあるかもしれません。

自分の手持ちを確認するためには、以下のフォームに入力してください。

<link href="/tarot-api/chunk-vendors.js" rel="preload" as="script">
<div id="app"></div>
<script src="/tarot-api/chunk-vendors.js"></script>
<script src="/tarot-api/app.js"></script>
<link href="/tarot-api/app.css" rel="stylesheet">
