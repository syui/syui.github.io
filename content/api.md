+++
title = "api"
date = "2022-02-27"
+++

```sh
# create
$ curl -X POST -H "Content-Type: application/json" -d '{"user":"syui"}' api.syui.cf/users

# info
$ curl api.syui.cf/users/1

# update
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

<link href="/tarot-api/chunk-vendors.js" rel="preload" as="script">
<div id="app"></div>
<script src="/tarot-api/chunk-vendors.js"></script>
<script src="/tarot-api/app.js"></script>
<link href="/tarot-api/app.css" rel="stylesheet">
