+++
date = "2024-10-26"
tags = ["cloudflare", "bluesky", "atproto"]
title = "atprotoのfrontpageを触ってみる"
[params]
  comment = "3l7nuqahc7q27"
+++

前回、live配信にatprotoでoauth loginして掲示板(bbs)に書き込めるサイトを作成し、bbsは簡単にrustで自作したものを使っていました。

しかし、やはり機能的に不足していたのと、公式のoauth exampleがpythonで書かれていたため、python + rustでやっていました。

そこに[likeandscribe/frontpage](https://github.com/likeandscribe/frontpage)というものを見つけて、これはいいものだと思ったので触っていきます。


詳しくはこちらを見てください。

- https://frontpage.fyi/post/tom.frontpage.team/3l6nbjyjmcg2v

これがどういったものかというと、おそらく、bsky.socialとは別サービスですがoauthでlogin(signin)でき、投稿情報は自身のpdsに保存されるのでしょう。また、`drainpipe`はこう書かれています。

> Drainpipe is a atproto firehose consumer written in rust. It knows how to reliably* take messages from the firehose, filter them, and forward them over HTTPs to a webhook receiver some place else on the internet.

```sh
$ git clone https://github.com/likeandscribe/frontpage
$ cd !$:t

$ nvm use 20
$ pnpm i
$ cat turbo.json
$ pnpm exec turbo run --affected type-check
```

turboを見て分かる通り、dbはtursoを使用するようです。また、`drainpipe`は`fly.io`ですね。

```sh
TURSO_CONNECTION_URL
TURSO_AUTH_TOKEN
```

```sh
$ cd packages-rs/drainpipe
$ cargo install diesel_cli --no-default-features --features sqlite
$ diesel setup
$ diesel migration run

$ cp .env .env.local
FRONTPAGE_CONSUMER_SECRET

$ docker compose up
```

なお、ubuntuなどrustcのversionが古い場合は[rustup](https://rustup.rs/)を使ってpathを設定してください。

```sh
$ rustup update

# ~/.zshrc
export PATH="$HOME/.cargo/bin:$PATH"
. $HOME/.cargo/env
```

```sh
$ cd packages/frontpage
$ pnpm exec tsx ./scripts/generate-jwk.mts

# https://docs.turso.tech/quickstart
$ turso db create
TURSO_CONNECTION_URL
TURSO_AUTH_TOKEN
DRAINPIPE_CONSUMER_SECRET

$ pnpm run db:generate 
$ pnpm run db:migrate

$ cloudflared tunnel --url http://localhost:3000

$ pnpm run dev
```

![](https://raw.githubusercontent.com/syui/img/master/other/atproto_frontpage_preview_0001.png)

基本的に`drainpipe`を裏で動かします。これがpostを取得したり投稿したりします。

```sh:packages-rs/drainpipe/.env
# .env.local
- FRONTPAGE_CONSUMER_URL="http://localhost:3000/api/receive_hook"
+ FRONTPAGE_CONSUMER_URL="http://example.com/api/receive_hook"
```

## rewrite

```sh
$ cd packages/frontpage
$ PUBLIC_URL=example.com
$ grep -R frontpage.fyi .|cut -d : -f 1|sed -i "s/frontpage.fyi/$PUBLIC_URL/g"
```

`pnpm run start`と`pnpm run dev`では`client_id`が異なります。これは`/oauth/client-metadata.json`を見てください。

```.env
# .env.local
# packages/frontpage/lib/auth.ts
VERCEL_PROJECT_PRODUCTION_URL=example.com
VERCEL_BRANCH_URL=example.com
```

## local-infra

self-hostするのに必要なserver構成だと思います。

https://github.com/likeandscribe/frontpage/tree/main/packages/frontpage/local-infra

```sh
$ cd local-infra
$ cat README.md
docker-compose up
Create a test account with ./scripts/create-account.sh <email> <handle>
DRAINPIPE_CONSUMER_SECRET=secret
TURSO_CONNECTION_URL=libsql://turso.dev.unravel.fyi
PLC_DIRECTORY_URL=https://plc.dev.unravel.fyi
```

これらのnameserverはcaddyを見てください。

plcはerrorが出るので、以下のようにします。おそらく、postgresのdatabaseが必要なのでしょう。portsは開けなくて大丈夫です。

```yml:docker-compose.yml
  plc:
    image: ghcr.io/bluesky-social/did-method-plc:plc-f2ab7516bac5bc0f3f86842fa94e996bd1b3815b
    container_name: plc
    restart: unless-stopped
    ports:
      - '4000:8080'
    depends_on:
      - plc_db
    env_file:
      - ./plc.env

  plc_db:
    image: postgres:16-alpine
    restart: always
    env_file:
      - ./postgres.env
    volumes:
      - ./configs/postgres/init/:/docker-entrypoint-initdb.d/
      - ./data/postgres/:/var/lib/postgresql/data/
    healthcheck:
      test: "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"
      interval: 5s
      retries: 20
```

```sh:.env
# plc.env
DEBUG_MODE=1
LOG_ENABLED=true
LOG_LEVEL=debug
LOG_DESTINATION=1
PORT=8080
DATABASE_URL=postgres://postgres:postgres@plc_db/plc
DB_CREDS_JSON='{"username":"postgres","password":"postgres","host":"plc_db","port":"5432","database":"plc"}'
ENABLE_MIGRATIONS=true
DB_MIGRATE_CREDS_JSON='{"username":"postgres","password":"postgres","host":"plc_db","port":"5432","database":"plc"}'
```

## pds

大体の原理が理解できてきたので、わかっていることをまとめます。

まずoauth(session)でpdsUrlをgetする感じなのかなと思います。sessionがあれば投稿などは操作できます。

```sh
$ grep -R pdsUrl .
./lib/data/user.ts:  const pdsUrl = await getPdsUrl(session.user.did);
```

あるいは`ws://pds:3000`を使用する可能性も考えられますが、基本は`bsky.network`を使うのだと思います。

```sh:packages-rs/drainpipe/.env
RELAY_URL=wss://bsky.network
```

次に`unravel.frontpage`についてです。これは主に`collection`に書き込まれているようです。この場合、`frontpage.fyi`と投稿は共通します。

```sh
$ grep -R unravel.frontpage ./app ./lib
./app/api/receive_hook/route.ts:    if (collection === "fyi.unravel.frontpage.vote") {
./lib/data/atproto/comment.ts:export const CommentCollection = "fyi.unravel.frontpage.comment";
./lib/data/atproto/vote.ts:    collection: "fyi.unravel.frontpage.vote",
./lib/data/atproto/vote.ts:    collection: "fyi.unravel.frontpage.vote",
./lib/data/atproto/event.ts:  z.literal("fyi.unravel.frontpage.vote"),
./lib/data/atproto/post.ts:export const PostCollection = "fyi.unravel.frontpage.post";

# HOST_REVERT=com.unravel.example
# grep -R unravel.frontpage ./app ./lib |cut -d : -f 1|xargs sed -i "s/fyi.unravel.frontpage/${HOST_REVERT}/g"
```

```js
// https://atproto.com/ja/guides/applications
// レコードの時間ベースのキーを生成します
const rkey = TID.nextStr()

// 書き込み
await agent.com.atproto.repo.putRecord({
  repo: agent.assertDid, // ユーザー
  collection: 'xyz.statusphere.status', // コレクション
  rkey, // レコード キー
  record: { // レコード値
    status: "👍",
    createdAt: new Date().toISOString()
  }
})
```

`drainpipe`はpdsの`fyi.unravel.frontpage(collection)`を検索してfirehoseの`subscribeRepos`にcommitするようです。この2つの部分を変更すると`frontpage.fyi`と連動しません。

```rust:packages-rs/drainpipe/src/main.rs
let mut ws_request = format!(
        "{}/xrpc/com.atproto.sync.subscribeRepos{}",
        relay_url, query_string
)

// https://github.com/likeandscribe/frontpage/blob/e7444ec6c19f0ccef3776f04702c3bb033ed3bfc/packages-rs/drainpipe/src/main.rs#L66-L97
/// Process a message from the firehose. Returns the sequence number of the message or an error.
async fn process(message: Vec<u8>, ctx: &mut Context) -> Result<i64, ProcessError> {
    let (_header, data) = firehose::read(&message).map_err(|e| ProcessError {
        inner: e.into(),
        seq: -1,
        source: message.clone().into(),
        kind: ProcessErrorKind::DecodeError,
    })?;
    let sequence = match data {
        firehose::SubscribeRepos::Commit(commit) => {
            let frontpage_ops = commit
                .operations
                .iter()
                .filter(|op| op.path.starts_with("com.unravel.example."))
                //.filter(|op| op.path.starts_with("fyi.unravel.frontpage."))
                .collect::<Vec<_>>();
            if !frontpage_ops.is_empty() {
                process_frontpage_ops(&frontpage_ops, &commit, &ctx)
                    .map_err(|e| ProcessError {
                        seq: commit.sequence,
                        inner: e,
                        source: message.clone().into(),
                        kind: ProcessErrorKind::ProcessError,
                    })
                    .await?;
            }
            commit.sequence
        }
        msg => msg.sequence(),
    };

    Ok(sequence)
}
```

ただ、infraのpdsは`pds.dev.unravel.fyi`となっていて、中の人の話を聞くと`frontpage.fyi`のpdsにpostされるように感じました。

