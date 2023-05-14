+++
title = "api"
date = "2022-02-27"
lastmod = "2023-05-14"
+++

[api.syui.ai](https://api.syui.ai)の解説です。

blueskyで`ai`からカードをもらうことができます。

- [@yui.bsky.social](https://staging.bsky.app/profile/yui.bsky.social) `/card`


```sh
$ curl -sL api.syui.ai/users/1 | jq .
{
  "id": 1,
  "username": "syui",
  "did": "did:plc:uqzpqmrjnptsxezjx4xuh2mn",
  "delete": false,
  "created_at": "2023-04-13T16:32:14+09:00",
  "updated_at": "2023-05-12T19:45:00+09:00",
  "next": "20230512"
}
```

```sh
# user search
$ curl -sL "api.syui.ai/users?itemsPerPage=2000" | jq ".[]|select(.username == \"syui\")"

# user card
$ curl -sL "api.syui.ai/users/1/card?itemsPerPage=2000" |jq ".[].card"
```

`status`には引いた同キャラのレア度を表示します。低い確率でレアカード`super`を排出します。対戦を重ねると`normal`がまれに変化することがあるかもしれません。

自分の手持ちを確認するためには、[こちら](https://card.syui.ai)からフォームに入力してください。

## pass, token

ここからはpass, tokenが必要です。passとtokenは`ai`しか持ちません。

```sh
$ url=https://api.syui.ai

# create user
$ curl -X POST -H "Content-Type: application/json" -d "{\"username\":\"$username\",\"password\":\"$pass\",\"did\":\"$did\"}" -s "$url/users"
```

```sh
# draw
$ curl -X POST -H "Content-Type: application/json" -d "{\"owner\":0, \"password\":\"$pass\"}" -sL $url/cards

# draw select 
$ curl -X POST -H "Content-Type: application/json" -d "{\"owner\":0,\"card\":0,\"status\":\"normal\",\"cp\":0,\"password\":\"$pass\"}" -sL $url/cards

```

```sh
$ updated_at_n=`date --iso-8601=seconds`

# user patch
$ curl -X PATCH -H "Content-Type: application/json" -d "{\"updated_at\":\"$updated_at_n\",\"token\":\"$token\"}" -sL $url/users/0
```

## command

```sh
/card -u : user dataを見る

/card 1 : id:1のdataを見る

/card -b : battle

/card -r : battle raid

/card aa : ascii art

/card ai : 隠しコマンド, user:aiのカードを引く

その他にも隠しコマンドあり
```

## link

- https://api.syui.ai

- https://card.syui.ai
