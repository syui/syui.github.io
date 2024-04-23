+++
date = "2021-08-14"
tags = ["github","keepass","bitwarden","heroku"]
title = "bitwardenをself-hostで試してみた"
slug = "bitwarden"
+++

password managerの`bitwarden`を試してみました。self-hostしますので、herokuを使います。

https://bitwarden.com

bitwardenはossのcloud pass managerみたいなものだと思われます。web domainを使ってdbにアクセスし、そっから情報を読み込みます。

つまり、passwordにアクセスするには、networkにつながっていなければなりません。また、自分のserverからdbを管理する場合、updateなどの手間がかかります。ですが、その手段が採れるというのはいいですね。

self-hostの利点として挙げられるのは、例えば、「bitwardenがhackされてもpasswordが流出しない」と公式では言われています。ですが、様々な可能性が考えられるため、本当のところはわかりませんが。

私が使ったのは、非公式clientであるvaultwardenのdocker-imageです。それをheroku deployする便利なrepoがありましたので、それを使いました。

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

bitwarden-serverを立ち上げたあとは、webからアクセスし、管理者アカウントを作成します。

そのserver(address)を使って、bitwarden-clientからpass管理や自動入力を行います。もちろん、pass管理はwebからもできます。

ですが、多くの人がやりたいのは自動入力だと思うので、やはり、bitwarden-clientは必要になると思われます。

bitwarden-clientでは、初期画面に設定アイコンみたいなものがあると思うので、そこから先程立ち上げたserverのaddressを設定します。

![](https://raw.githubusercontent.com/syui/img/master/other/bitwarden_01.png)

例えば、chromeからtwitterに自動入力したい場合は、`twitter.com/login`にアクセスして、chrome addonのbitwardenのアイコンをクリックします(あらかじめtwitterのpassを登録しておく必要があります)。

使ってみた感想ですが、自動入力も便利ですが、登録とかも便利でした。

ですが、そのためにcloudに情報を置くのはちょっとオーバーだなと思いました。self-hostする場合、bitwarden-serverの運用や管理、維持も必要になってきます。

### 現在の運用段階

現在の運用では、dbに保存するpassを制限し、つまり、流出してもあまり問題なさそうなアカウントのみで登録を行い、運用テストしています。

また、当該repoは、dbに`heroku-postgresql`ではなく、`autobus`, `jawsdb`などのaddonを使いますが、個人的には、これらのaddonを使用するのは不安要素も大きいです。

このようなsecure要請が高い事柄においては、herokuでhostする場合、herokuが提供するaddonに限定したほうがいいと思ったので、`heroku-postgresql`を使用するようにしました。option:envに項目はありましたが、あまり有効に機能してないような気もしましたので。

```sh
# yes
$ heroku addons:create heroku-postgresql -a "$APP_NAME"

# no
$ heroku addons:create autobus -a "$APP_NAME"
$ heroku addons:create jawsdb -a "$APP_NAME"
```

backupも基本的には、herokuが提供するcmdで足りると思います。ただし、plan:hobby(free)の場合、backup数は限りがありますので注意です。

```sh
# backup
$ heroku pg:backups:capture -a "$APP_NAME"

# restore
$ heroku pg:backups -a "$APP_NAME"
x001
$ heroku pg:backups:restore x001 -a "$APP_NAME"
```

herokuはfreeの場合、30minでsleepしますので、以下のaddonは必要になるかもです。

```sh
$ heroku addons:create scheduler:standard -a "$APP_NAME"
$ heroku addons:open scheduler -a "$APP_NAME"
every10min $curl https://$APP_NAME.herokuapp.com
```

感想としては、bitwardenは便利です。主に登録と自動入力が便利で、これに慣れてしまうと、keepass時代のcopy/pasteはつらさがあります。

ですが、入力頻度がそれほどない場合は、私のことですが、keepassでいいんじゃないかという気もしてます。

bitwarden-serverの運用や管理、維持する手間、危険性などを考えると、安全なのは、間違いなくkeepassのcopy/pasteだと思います。とはいえ、状況にもよりますが、基本的には。

### bitwarden-cloudとcopy/pasteの安全性

例えば、bitwarden-cloudは、必ずnetwork上のaddressを持ちます。

だからこそ、そのaddressからuser accountにloginできるわけです。それぞれのclientも動作するにはこの情報を必要とします。

ここでlogin passなどが漏れてしまった場合、情報にアクセスされてしまいます。

逆に、copy/paste領域の安全性について考えてみましょう。

copy/pasteはlogin passが漏れると、アクセス可能になりますか?

いいえ、可能にはなりません。そもそもcopy/paste領域が必ずしもnetwork上の住所を持っているわけではありません。

そうでなくてもbitwardenのserver自体が、bitwardenやdb, web-serverなどのsoftwareのexploitをついて、そこから設定や権限を書き換えられ、loginされてしまうという事も考えられる。つまり、login passが漏れていなくても攻撃が成功する危険性は複数考えられます。これは、server運用上、仕方のないことです。

bitwarden-cloudの利用は、端末がnetworkにつながっており、かつ、bitwarden-serverがnetwork上に公開されている必要があります。

逆に、copy/pasteはnetworkにつながっていないofflineでも利用できます。network接続を切れば、そもそも外部からはアクセスできません。もちろん、offlineでもcopy/paste領域には端末の占有者が情報にアクセスできます。bitwarden-cloudはできません。

次に、copy/paste領域におけるexploitの可能性について考えてみます。これについては、公開されているserverよりも明らかに低いと考えられます。

まず、使用可能なexploitが限定的で、大抵の場合、osに依存します。つまり、cloudは、osまたはsoftwareのどちらかのexploitで攻撃が成功する可能性があるのに対し、copy/pasteはos+softwareの両方を必要とするexploitが必要になる可能性が高い。

そのため、bitwardenのほうが便利ですが、例えば、copy/pasteを使用するようなkeepassに比べ、安全性は低いと思います。

これは当然の帰結だと思います。便利であればあるほど、つまり、networkにつながってると便利なわけですが、危険も高くなる、ということです。

そのため、offlineで使うもの、使えるもののほうが、一般的には安全です。offlineで使うもの、使えるものは、共有やらなんやらのことを考えると、不便ではあります。不便さの解消に、例えば、key-fileやmaster-fileなどを共有するとなると、危険性も増します。

個人的には、入力頻度などを考慮した上で、結論を出すと良いと思います。

例えば、入力頻度が高い人は、bitwardenという選択肢は非常に有用だと思います。

逆に入力頻度、つまり、登録や自動入力の機会がそこまで高くない場合は、bitwarden-serverの運用、維持などはオーバーに感じますね。危険性も高くなるので。

以上です。
