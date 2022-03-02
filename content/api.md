+++
title = "api"
date = "2022-02-27"
+++

<link href="/tarot-api/chunk-vendors.js" rel="preload" as="script">
<div id="app"></div>
<script src="/tarot-api/chunk-vendors.js"></script>
<script src="/tarot-api/app.js"></script>
<link href="/tarot-api/app.css" rel="stylesheet">

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

- 1日に引ける回数には制限があります

- アカウント作成時に引いたカードは基本的に変更できません

- 最初のカードと同じものをを引くとlv+1

- 毎日変わるカードは1/100くらいの確率でレアカードが出ます

- レアカードを引くとlv+5
