# ailog

atproto blog cli

https://git.syui.ai/ai/log

```sh
$ git clone https://git.syui.ai/ai/log
$ cd log
$ cat public/config.json
$ npm run dev
```

## cli 

```sh
$ cargo build
$ ./target/debug/ailog
```

### login (l)

login to atproto pds.

```sh
$ ailog login <handle> -p <password> [-s <server>]
$ ailog l user.bsky.social -p mypassword
$ ailog l user.syu.is -p mypassword -s syu.is
```

### post (p)

post a record to collection.

```sh
$ ailog post <file> -c <collection> [-r <rkey>]
$ ailog p ./post.json -c ai.syui.log.post
$ ailog p ./post.json -c ai.syui.log.post -r 3abc123
```

### get (g)

get records from collection.

```sh
$ ailog get -c <collection> [-l <limit>]
$ ailog g -c ai.syui.log.post
$ ailog g -c ai.syui.log.post -l 20
```

### delete (d)

delete a record from collection.

```sh
$ ailog delete -c <collection> -r <rkey>
$ ailog d -c ai.syui.log.post -r 3abc123
```

### sync (s)

sync pds data to local content directory.

```sh
$ ailog sync [-o <output>]
$ ailog s
$ ailog s -o ./public/content
```

### lexicon

update lexicon schema.

```sh
$ ailog lexicon <file>
$ ailog lexicon ./lexicons/ai.syui.log.post.json
```

```sh
$ ailog did syui.ai
did:plc:uqzpqmrjnptsxezjx4xuh2mn
```

```txt
_lexicon.log.syui.ai  txt  "did=did:plc:uqzpqmrjnptsxezjx4xuh2mn"
```

### gen

generate lexicon code from atproto lexicon json files.

```sh
$ ailog gen [-i <input>] [-o <output>]
$ ailog gen
$ ailog gen -i ./repos/atproto/lexicons -o ./src/lexicons
```

### lang

translate content files using lms.

```sh
$ ailog lang <input> [-f <from>] [-t <to>]
$ ailog lang ./post.json
$ ailog lang ./public/content -f ja -t en
```

requires `.env`:

```
TRANSLATE_URL=http://127.0.0.1:1234/v1
TRANSLATE_MODEL=plamo-2-translate
```
