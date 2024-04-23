+++
date = "2016-07-24"
tags =  ["pc"]
title = "Nexus7(2013)でWebサイトを編集するのが快適な理由"
slug = "android-hugo-theme"
+++

![](https://raw.githubusercontent.com/syui/img/master/old/android-hugo-theme-03.png)

写真多分でかいです、すいません。できれば端末回転で横にすればよかたんだけど面倒くさかった

## Nexus7(2013)でWebサイトを編集するのが快適な理由

ここで言うWebサイトとは、Webサーバー、Webテンプレート、Webテーマなどを含みます。

Webサーバーを操作する場合は、多くの人が使っているAWS(Amazon)やHerokuがありますが、個人的にはHerokuがおすすめですが、どちらでも可能です。

ただし、今回は主にWebテーマを編集する一例を紹介することになります。

現在、`Nexus7 7-inch`だけでHugoブログを管理できますが、専門的な知識がない私でも簡単にテーマの調整ができてます。

関係ありませんが、Nexus7は非常に良い端末です。Android端末では値段はあまり重要ではありません。高価なものが良いとは限らないし、安価なものが悪いとは限りません。そして、一つの重要な視点があり、そのポイントさえ抑えれば、あまり詳しくない人でも端末を選ぶ際、適切な判断が下せるでしょう。ここで、私にとってのポイントは端末のサイズと、Nexusシリーズであるかどうかです(今後、Googleが直接製造に踏み切る可能性があり、その場合はNexus以外も選択肢に入ります)。サイズの解説は省略するとして、なぜNexusシリーズでなければならないのかというと、一つはOSのアップデート対応です。Androidはバージョンアップが非常に早いOSの一つです。年々新たなアップグレードが配信されます。Nexusシリーズ以外はアップグレード対応が放置されている例が目につきます。次に、プリインアプリ(プリインストールアプリ)です。最初から入ってるアプリのことですね。Nexus以外は出荷段階で不要なアプリが入れられている可能性が高いです。場合によっては個人情報をGoogle以外の自社サーバーに送るアプリもインストールされているかもしれません。ただ、これらに関しては、最新のセキュリティ事情は出荷段階でハードに埋め込むタイプの侵害が増加しているようです。したがって、Nexusであれば安心と言える状況ではなくなってきているのも事実でしょう。セキュリティ上関わる企業が少なければ少ないほどユーザーにとっては安心できます。そのため、もしGoogleが端末を製造するなら、そちらのほうが良いということになります。

話を戻しましょう。Wordpressであろうとそれ以外であろうと、その編集においては、通常、ハッカーが取りうる選択肢は多義に渡ります。つまり、ありとあらゆる方法が考えられ、それを実行できるだろうということです。

具体的には、アプリを使って編集してもいいし、サーバーから操作してもいいし、仮想環境から編集することも可能です。

ここでは、仮想環境を作ってテーマ編集する方法を採用します。難易度的にもこれが最も難しいと思われます。正確には難しいというか面倒な方法です。ただし、応用可能性は格段に広がります。一度、仮想環境を作れば、例えば、Dockerを使って更に膨大なコンテナをAndroid上で操作することも可能です。

しかし、Docker自体はAndroidで動かすのはオススメしません。今回もDockerコンテナを作ろうと思えば可能です。例えば、Hugo用のコンテナなどを作っておくと便利でしょう。しかし、Alpineイメージを使ってさえ容量を相当圧迫するDockerはAndroid端末上で扱うのに向いているとは思いません。更に、Dockerを複数管理するにしてもスペックも不足しています。そして、単体で動かすのであればあまり意味が無いでしょう。ただ、Dockerイメージの中にはAndroidからも便利に扱えるイメージがいくつか在るのも事実です。その場合は都度紹介します。

とりあえず、まずは仮想環境の構築ですね。前提として`Root`は必須になるので、Androidのユーザー権限は書き換えておいてください。権限書き換え後は権限管理アプリ、例えば、`SuperSU`などを使えばよいでしょう。

次に、`Android Terminal Emulator`を使ってAndroid用にカスタマイズされたOSイメージを読み込みます。OSイメージは色々な種類がありますが、私は、`Arch Linux`のイメージを使います。

http://linuxonandroid.org/downloads/

配布されているイメージの容量が少ない場合は容量を拡張します。

``` bash
$ sudo pacman -S qemu --noconfirm
$ export img=arch.img
$ export size=3G
$ qemu-img resize $img $size
$ sudo losetup -f
$ sudo losetup /dev/loop0 $img 
$ sudo mount -t ext4 /dev/loop0 /mnt
$ sudo resize2fs /dev/loop0 $size
```

これで基本的な準備は完了です。後は、イメージと起動スクリプトをAndroidにPushします。起動スクリプトは適時好みにカスタマイズしてください。

``` bash
$ adb shell mkdir -p /sdcard/arch
$ adb push ./arch.boot /sdcard/arch
$ adb push ./arch.img /sdcard/arch
```

Androidで使うShellは`ash`がオススメでしょう。高機能ではありませんが。これは`busybox`を使えばインストールされるはず。以下は、Android Terminal Emulatorで実行するコマンド例。ここで起動スクリプトを実行しますが、起動スクリプトから分かるようにイメージには`chroot`でアクセスします。そのため幾つかの`chroot`制限があることは理解しておいてください。これを回避する幾つかのTipsがありますが、問題が起きた時はそれらを参照してください。

``` bash
$ su
$ ash -
$ sh /sdcard/arch/arch.boot
$ cat /etc/pacma.conf
$ cat /etc/pacman.d/mirror
$ pacman -Syu --noconfirm
$ pacman -S ca-certificates-utils go --noconfirm
$ update-ca-trust
```

次に、自身で使っているテーマをCloneしましょう。ほとんどの人はGit管理しているはずです。Privateリポジトリの場合は、適時アクセス権の設定などを行います。Publicの場合は証明書をアップデートした後、すぐに、Clone可能だと思われます。

私の場合はこんな感じです。テーマのプレビューまでを実行しています。あと、`chroot`のため多少の面倒が起こるのがわかります。ここでは主に権限上の問題ですね。回避したい方(本気で環境を整えたい人)は適時対応してください。

![](https://raw.githubusercontent.com/syui/img/master/old/android-hugo-theme-02.png)

``` bash
$ cd
$ mkdir -p blog;cd blog
$ git clone https://gitlab.com/syui/blog.git riot-mui-blog
$ cd riot-mui-blog
$ export GOPATH=~/go
$ export PATH=$PATH:~/go/bin
$ go get -v github.com/spf13/hugo
$ mkdir -p /data/local/go-build-XXXXXX
$ go get -v github.com/spf13/hugo
$ which hugo
$ hugo server
```



私は、Editorを`Vim`, Shellは`zsh`を使います。また、`peco`などを常用したりするので、それらを適時インストールすれば開発環境は便利になります。

![](https://raw.githubusercontent.com/syui/img/master/old/android-hugo-theme-04.png)

- zsh-completions

- zsh-syntax-highlighting

- vim-plug

- vim-monokai

プレビューが実行されているので、ブラウザとかを使ってアドレスにアクセスしましょう。ウィンドウ分割は、以下のようにすれば設定可能です。ただし、Android6.X以上を必要とします。

``` bash
$ ^d
Shutting down Linux ARM
$ vi /system/build.prop
:%s/ro.build.type=user/ro.build.type=userdebug/gc
$ adb shell am start -n com.android.settings/.DevelopmentSettings
"マルチウィンドウ=true"
```

マルチウィンドウをONにしましょう。これは再起動後に表示される場合があります。表示されない時は一旦、端末を再起動してください。この機能を使うことでウィンドウ選択画面にてウィンドウサイズを変更可能になります。

SSH接続が可能な方が便利です。元から用意されている仕組みを使います。

この場合は`arch.img.config`というファイルになります。

``` bash
run_ssh=yes
```

後は起動すると、SSHサーバーが動作します。接続して適時設定をしましょう。アドレスはAndroidから引き継ぎます。したがって、固定したい場合はAndroidの設定より固定してください。

``` bash
$ ssh archlinux@192.168.1.3
$ vim /etc/ssh/sshd_config
```

以上で`Nexus7(2013)でWebサイトを編集するのが快適な理由`についての説明を終わります。正直、パソコンのほうが圧倒的に快適ですが、タブレットでもそれほど不便のない、パソコンとあまり変わらない環境を構築することは可能という話です。

現在、日常的な行いをタブレット端末で事足りている人が多い気がします。一般で行われている日常的なコンピュータ作業はタブレットでも十分に代替可能であると思われます。もちろん、キーボードは必要になるかもしれませんが。このような事情から、今後、みんなタブレットしか使わないようになっていくのでしょうか。そんなことを感じています。

しかし、個人的にはパソコンは必須です。タブレットではどんなに頑張っても代替不可能。スペックが不足しているし、複数の作業が困難で、ウィンドウは狭く、ビルドも遅いので、色々と無理です。

ただ、ブログとかに関してはCIを使ってるので、稀にタブレットから更新することはあるかもしれません。

今回は、そんな環境を作ってみたという話でした。おしまい。
