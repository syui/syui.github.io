# ailog

atproto blog cli

https://git.syui.ai/ai/log

```sh
$ git clone https://git.syui.ai/ai/log
$ cd log
$ cat public/config.json
$ npm run dev
```

## oauth

Use ATProto OAuth to login from the browser and create, edit, or delete posts.

### Setup

#### 1. Edit client-metadata.json

Modify `public/client-metadata.json` with your own domain:

```json
{
  "client_id": "https://example.com/client-metadata.json",
  "client_name": "example.com",
  "client_uri": "https://example.com",
  "redirect_uris": ["https://example.com/"],
  "scope": "atproto transition:generic",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "application_type": "web",
  "token_endpoint_auth_method": "none",
  "dpop_bound_access_tokens": true
}
```

**Required changes:**

| Field | Description |
|-------|-------------|
| `client_id` | URL of this file. Must be `https://yourdomain.com/client-metadata.json` |
| `client_name` | App name (shown on auth screen) |
| `client_uri` | Your site URL |
| `redirect_uris` | Redirect URL after OAuth. Use your site's root URL |

#### 2. Deploy the file

`client-metadata.json` must be publicly accessible at:

```
https://yourdomain.com/client-metadata.json
```

The ATProto PDS fetches this file during authentication, so it **must be accessible via public URL**.

#### 3. Local development

No configuration needed for local development (localhost/127.0.0.1). The code automatically uses ATProto's loopback client ID:

```
http://localhost?redirect_uri=http://127.0.0.1:5173/&scope=atproto%20transition%3Ageneric
```

#### 4. Network configuration

To support multiple PDS servers, define networks in `public/network.json`:

```json
{
  "bsky.social": {
    "bsky": "https://bsky.social",
    "plc": "https://plc.directory"
  },
  "syu.is": {
    "bsky": "https://bsky.syu.is",
    "plc": "https://plc.syu.is",
    "web": "https://syu.is"
  }
}
```

The appropriate PDS is automatically selected based on the handle's domain.

### Troubleshooting

- **Auth error**: Verify `client_id` matches the actual file URL
- **Redirect error**: Verify `redirect_uris` matches your site URL
- **CORS error**: Verify `client-metadata.json` is served with correct Content-Type

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
