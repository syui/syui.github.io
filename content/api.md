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

