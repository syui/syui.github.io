+++
title = "api"
date = "2022-02-27"
+++

<link href="/tarot-api/chunk-vendors.js" rel="preload" as="script">
<div id="app"></div>
<script src="/tarot-api/chunk-vendors.js"></script>
<script src="/tarot-api/app.js"></script>
<link href="/tarot-api/app.css" rel="stylesheet">

### api.syui.cf

```sh
# create
$ curl -X POST -H "Content-Type: application/json" -d '{"user":"syui"}' api.syui.cf/users

# info
$ curl api.syui.cf/users/1

# update
$ curl -X PUT api.syui.cf/users/1/d
$ curl api.syui.cf/users/1 | jq .
```

