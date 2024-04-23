+++
date = "2016-10-08"
tags =  ["memo"]
title = "05/10(superuser-hidesu)"
slug = "pokemon-go"
+++

## 05/10(superuser-hidesu)

ちょっと情報が古いですが(自動ポストの関係で順番を入れ替えても書いた日より数日遅れることがあるため)、Pokemon GoとAndroid Root関連の情報です。

ちなみに、05/10というのは日本式には10月5日のことです。西洋では逆になります。この日、Root検知関連でまた動きがあったようです。

具体的には、Pokemon Go 0.39.1などに搭載されているRoot検知機能`SafetyNet(by Google)`がAPI経由?で更新されたらしく、Suhideなどを使ってもログインできなくなっている模様。

http://forum.xda-developers.com/apps/supersu/suhide-t3450396/page147

https://www.reddit.com/r/pokemongodev/comments/560o9a/safetynet_updated_again/

https://www.reddit.com/r/pokemongodev/comments/562vww/root_and_safetynet_passed_again_0510/

今度のやつはXposedを無効にしても起動せず、SuperSU(Root)などをアンインストールしないとアプリを起動できません。これによって`Magisk v7`, `Suhide`なども全滅ぽいですね。定番のRoot偽装手口ではPOGO(Pokemon Go)はログインできなくなりました。

しかし、PHH-SuperUser(hidesu)は大丈夫ぽいので、suhide,magisk,supersuなどをアンインストールした後、TWRP経由でsuperuser-hidesuをインストールします。

http://forum.xda-developers.com/android/software-hacking/wip-selinux-capable-superuser-t3216394/post68969947#post68969947

その後、再起動し、superuser-apkをストアなどからインストールし、ルート管理を行います。必要に応じてSELinuxの有効無効を切り替えるSELinux Mode Changerなどのアプリを使います。

### 注意点

superuser-hidesuの注意点ですが、手順通り以外のことを独自にやると動かない可能性があります。ここで言う動かないというのは、Pokemon Goでログインできないということですが、ログインできない可能性があります。

そのような場合は公式の`boot.img`を上書きします。

```bash
$ fastboot flash boot boot.img
```

また、supersuなどのアンインストールも慌てずやりましょう。処理が走っていることもありますので、再起動まで待つ必要があるかもしれません。具体的には`XX個中XX個のアプリを最適化しています`という処理を走らせる必要があるかもしれません。

私の場合、hidesuでのログイン成功後に色々とやってしまったので、再度動かなくなり、無駄な時間を費やしてしまいました。そんな感じで、この辺は注意です。

また、手順を間違えてAndroid自体が起動しなくなった場合などは`supersu`を再度インストールすると動くようになることが多いです。ダメな場合は、公式の`system.img`などを上書きしてみてください。

```bash
$ fastboot erase system
$ fastboot flash system system.img
```

あと、当然ですが、こういうことをやる場合、ある程度Androidの仕組み的なものを知っておかなければ対応できないことがあります。

### SELinux

SuperUser-HidesuではSELinuxがOFFにならないため、アプリによっては不都合を起こします。例えば、Frepで画像認識が使えなくなるとか。なので、以下のようなアプリが必要になります。

SELinux Mode Changer : http://forum.xda-developers.com/showthread.php?t=2524485

### その他の話題

NianticがF(Fack!)とか言われていますが、NianticよりGoogleのほうがRoot化は排除に積極的なんじゃないかという意見もあります。まあ、APIを更新しているのはGoogleですし、Nianticはどちらかというと、Googleの意向に従っているだけなんじゃないかという気はしますね。Pokemonはここまで流行っているので、その影響力は大きいのです。

Googleがなぜここまで躍起になっているかの理由の一つは決済サービス、銀行サービス関連ぽいですね。
