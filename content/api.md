+++
title = "api"
date = "2022-02-27"
+++

<link href="/tarot-api/chunk-vendors.js" rel="preload" as="script">
<div id="app"></div>
<script src="/tarot-api/chunk-vendors.js"></script>
<script src="/tarot-api/app.js"></script>

### card api

draw cards for cli.

```sh
# user create
# username : [a-z] 7 characters, lower-case letter
$ curl -X POST -H "Content-Type: application/json" -d '{"user":"${USER}"}' api.syui.cf/users

# user info
$ curl api.syui.cf/users/{id}

# card draw
$ curl -X PUT api.syui.cf/users/{id}/d
$ curl api.syui.cf/users/{id} | jq .
```

- あなたは、1日に1回、カードを引くことができます

- 最初のカードがあなた自身となります

- 最初に引いたカードは基本的に変更できません

- 最初のカードと同じカードを引くとレベルが上がります

- 最初のカードを得たとき1/10くらいの確率でレアカードが出ます

- 毎日変わるカードはあなたの今日の運勢を占います

- 毎日変わるカードは1/100くらいの確率でレアカードが出ます

今後の実装予定の遊びについて。vsで既存ユーザーと対戦できると面白そうと思っています。例えば、50%の勝率を基本に、lvを1/10した勝率をプラスします。例えば、lv15で相手がlv5なら1%の勝率がプラスされ、勝率は51%となります。勝利した場合、1/20の確率で相手のカードをfirstに置き換えることができるようにします。また、レアカードが出た場合、lvを+5するなどを考えています。

