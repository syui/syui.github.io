## hugo + vue

```sh
$ yarn install
$ yarn serve
$ yarn build
$ cp -rf ./dist/*.js ./static/manga/
$ cp -rf ./dist/*.css ./static/manga/

$ hugo serve
```

## update

vue-cli 4

## vue illust view

```sh
$ cd ./src-imgauto
$ yarn install
$ yarn serve
$ ../run.sh

$ vim ../content/imgall.md
```

## pacman

```
$ curl -sL "https://archlinux.org/packages/search/json/?q=cursor&repo=Community&repo=Extra"|jq ".results|.[]|select(.last_update |match(\"^2021-07-04*\"))|.pkgname,.installed_size,.last_update"
```

