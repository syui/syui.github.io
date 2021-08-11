+++
date = "2021-08-13"
tags = ["github","keepass","bitwarden","heroku"]
title = "bitwardenをself-hostで試してみた"
slug = "bitwarden"
+++

password managerの`bitwarden`を試してみました。self-hostしますので、herokuを使います。

https://bitwarden.com

bitwardenはossのcloud pass managerみたいなものだと思われます。web domainを使ってdbにアクセスし、そっから情報を読み込みます。

つまり、passwordにアクセスルルには、networkにつながっていなければなりません。また、bitwardenのdomainではなく、自分でserverを作りdbを管理する方法ではupdateなどの手間がかかります。

ですが、その手段が採れるというのはいいですね。

また、bitwardenがhackされたとき、seof-hostしてる場合には、passwordが流出しないと公式では言われています(ですが、様々な可能性が考えられるため、本当のところはわかりません)。

私が使ったのは、bitwardenの非公式clientであるvaultwardenのdocker-imageです。それをheroku deployする便利なrepoがありましたので、それを使いました。

https://github.com/davidjameshowell/vaultwarden_heroku

基本的には、readmeにあるとおりですね。

```sh:vaultwarden_heroku/.github/workflows/deploy.yml
env:
  AUTOBUS_ENABLE: 1
  CREATE_APP_NAME: ${{ secrets.HEROKU_APP_NAME }}
  DUO_ENABLE: 1
  GIT_HASH: main
  HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
  USE_PSQL: 1
  HEROKU_VERIFIED: 0
  OFFSITE_HEROKU_DB: ${{ secrets.OFFSITE_HEROKU_DB }}
  HEROKU_CREATE_OPTIONS: ${{ secrets.HEROKU_CREATE_OPTIONS }}
```

bitwarden-serverを立ち上げたあとは、即座にwebからアクセスし、管理者アカウントを作成します。それを使って、bitwarden-clientからpass管理、例えば、自動入力だったり登録だったりを行います。もちろん、pass管理はwebからもできます。

ですが、多くの人の目当ては、自動入力なので、clientは必要になるかと思われます。

clientでは、初期画面に設定アイコンみたいなものがあると思うので、そこから先程立ち上げたserverのaddressを設定します。

例えば、chromeからtwitterに自動入力したい場合は、`twitter.com/login`にアクセスして、chromeアドオンのbitwardenのアイコンをクリックします(あらかじめtwitterのpassを登録しておく必要があります)。

使ってた感想ですが、自動入力も便利ですが、登録とかも便利だった。

ですが、そのためにcloudに情報を置くのはちょっとオーバーだなと思った場合、やっぱり、不便でもkeepassを使い続けると思います。

