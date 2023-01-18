+++
date = "2022-10-29"
lastmod = "2022-12-05"
tags = ["arch","m"]
title = "archlinux"
slug = "arch"
+++

archlinuxのinstaller(script)です。

https://github.com/syui/arch

```sh
$ fdisk -l
sda
$ export x=a
$ curl -sL git.io/air | zsh
```

archlinuxの一般的なinstall手順です。

```sh
$ cfdisk /dev/sda
sda1 200M linux-system
sda2 8GB linux-system
write(yes), quit

$ mkfs.vfat /sda1
$ mkfs.ext4 /sda2
$ mount /dev/sda2 /mnt
$ pacstrap -K /mnt base linux base-devel
$ genfstab -U /mnt >> /mnt/etc/fstab

$ arch-chroot /mnt
$ user=syui
$ echo xxx >> /etc/hostname
$ pacman -S zsh git tmux vim openssh grub dhcpcd efibootmgr atool net-tools inetutils zsh-syntax-highlighting cronie jq
$ grub-install --force --recheck /dev/sda
$ grub-mkconfig -o /boot/grub/grub.cfg

$ vim /etc/systemd/network/eth.network
[Match]
Name=en*
[Network]
#DHCP=ipv4
Address=192.168.11.15
Gateway=192.168.11.1
DNS=192.168.11.1
[DHCP]
#RouteMetric=10
$ systemctl enabel systemd-networkd
$ ip link
$ systemctl enable dhcpcd
$ systemctl enable sshd 

$ useradd -m -G wheel -s /bin/zsh $user
$ passwd
$ passwd $user
$ vim /etc/sudoers
Defaults env_keep += "HOME"
%wheel ALL=(ALL) ALL
%wheel ALL=(ALL) NOPASSWD: /usr/bin/pacman -Syu --noconfirm, /usr/bin/reboot, /usr/bin/poweroff, /usr/bin/rm -rf /var/lib/pacman/db.lck

$ su $user
$ crontab -e
0 0 * * * sudo rm -rf /var/lib/pacman/db.lck && sudo pacman -Syu --noconfirm
$ systemctl enable cronie

$ exit
$ reboot
```

### ssh

```sh:host.txt
$ vim /etc/ssh/sshd_config
Port 2299
PasswordAuthentication no
$ systemctl restart sshd
```

```sh:guest.txt
$ ssh-keygen -f ~/.ssh/xxx
$ ssh-copy-id -i ~/.ssh/xxx.pub -p 2299 $user@192.168.11.15
$ ssh -p 2299 $user@192.168.11.15
```

### app

[アプリケーション一覧](https://wiki.archlinux.jp/index.php/%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E4%B8%80%E8%A6%A7)

window managerはi3(xorg), sway(wayland)を使用しています。かつては`awesome`を使用していました。

```sh
$ mkdir -p ~/.config/sway
$ cp -rf /etc/sway/config ~/.config/sway/
$ pacman -S sway swaybg xorg-xwayland polkit dmenu foot
```

file managerは`pcmanfm`です。かつては`spacefm`を使用していました。

```sh
# 自動マウント
$ pacman -S pcmanfm gvfs
```

login managerは`lightdm`です。かつては`slim`を使用していました。

```sh
$ pacman -S lightdm
$ systemctl enable lightdm
$ groupadd -r autologin
$ gpasswd -a USERNAME autologin
```

```sh:/etc/lightdm/lightdm.conf
[Seat:*]
autologin-user=syui
autologin-session=sway
```

アイコンは`blueman`, `network-manager(nm-applet)`, `pulseaudio`, `fcitx`, `clipman`, `rofi`など。

キーバインドは`xdotool`, `xmodmap`, `xbindkeys`などを使用しています。

screenshotは、`grim`を使用しています。

その他、画像関連はimagemagick, gimp, inkscape, kritaあたりが便利です。

音楽動画はffmpeg, vlc, mpv, mplayerあたりが便利です。

### aur

`yay`か`paru`が人気です。aurは、大抵の場合、公式packageにないapp(package)をinstallするときに使います。

ただし、aurを使用する場合、src(source)を手元のマシンでbuildするため時間がかかります。

pacmanでinstallされるpackageは、あらかじめarchでbuildされたbinaryをdownloadしてくるだけなので。

https://aur.archlinux.org/paru.git

```sh
$ sudo pacman -S --needed base-devel
$ git clone https://aur.archlinux.org/paru.git
$ cd paru
$ makepkg -si
$ ./paru
```

### vpn

vpn serverとclientは`pritunl`が便利です。

https://pritunl.com

#### vpn server

wanからlan(local-network)に入るには、様々な方法がありますが、ルーターのポートフォワーディングと呼ばれる機能とvpn serverを使用します。

ポートフォワーディングでssh-serverに接続し、dockerからpritunl(vpn server)を立ち上げ、profileを書き換えて、vpnにアクセスし、lanに入ります。lanに入ればlocal-ipが使えるはずですから、private-keyだけで様々なserverにアクセスできるはず。よく使うserverは[termius](https://syui.cf/m/post/ios/)に登録しておきましょう。

https://github.com/goofball222/pritunl

https://hub.docker.com/r/goofball222/pritunl

```yml:docker-compose.yml
version: '3'

services:
  mongo:
    image: mongo:latest
    container_name: pritunldb
    hostname: pritunldb
    network_mode: bridge
    volumes:
      - ./db:/data/db

  pritunl:
    image: goofball222/pritunl:latest
    container_name: pritunl
    hostname: pritunl
    depends_on:
        - mongo
    network_mode: bridge
    privileged: true
    sysctls:
      - net.ipv6.conf.all.disable_ipv6=0
    links:
      - mongo
    volumes:
      - /etc/localtime:/etc/localtime:ro
    ports:
      - 80:80
      - 443:443
      - 1194:1194
      - 1194:1194/udp
      - 14036:14036/udp
    environment:
      - TZ=UTC
```

```sh
$ sudo systemctl start docker
$ mkdir -p mongo
$ sudo docker-compose up -d
```

browser(chromiumなど)で`localhost`にアクセスし、web-uiから初期設定を行います。defaultのuserとpassは両方ともpritunlです。

profileをdownloadしてiosに共有しておきます。なお、global-ipは通常は変動しますので、固定ipを持っていない場合は、ddnsの登録を行ったうえでそれを使用するか、ipが変わったとき通知するか、してください。

固定ipやddnsの場合は、profileを書き換える必要はありませんが、そうでない場合は、profileのglobal-ipを書き換える必要があります。書き換えは`goodreader`などが便利です。

```sh
- remote 123.45.67.89 $port udp
+ remote 89.45.67.123 $port udp
```

vpn serverを常時起動しておくのは電力の無駄でsecurity上もよくありません。したがって、できればポートフォワーディング用のserverを用意して、使用するときに起動したほうがいいと思います。

また、securityを考慮するなら、ポートフォワーディング用のserver自体を必要最小限にし、wol serverにした上で、ssh serverをwolで起動する役割のみを与えます。wolしたあとは、sshの踏み台にして、private-key自体はiosに置いておくという形が理想的だと思います。そのssh serverにアクセスしたあとはvpn serverを立ち上げ、lanに入ればいいでしょう。ただし、手間がかかりますから、そのへんのsecurityは使用頻度を考慮した上で考えればいいと思います。

#### vpn client

[gotunl](https://github.com/cghdev/gotunl)でvpn serverにアクセスし、local-networkに入ります。

なお、`gotunl`を使うには、あらかじめ公式client(electron)をinstallして、profileを[import](https://syui.cf/m/post/arch/)しておく必要があります。

```sh:/etc/pacman.conf
[pritunl]
Server = https://repo.pritunl.com/stable/pacman
```

```sh
$ sudo pacman -Syu pritunl-client-electron
$ sudo pacman -S pritunl-client-electron-numix-theme
$ pritunl-client-electron
# ここでprofile(.vpn)をimport

$ git clone https://github.com/cghdev/gotunl.git
$ cd gotunl
$ go install
$ ./${GOPATH}/bin/gotunl -l
$ ./${GOPATH}/bin/gotunl -c 1
```

### continer(systemd-nspawn)

```sh
$ mkdir -p ~/arch
$ sudo pacstrap -c ~/arch base
# -D : chroot
$ sudo systemd-nspawn -D ~/arch
$ passwd
$ logout
# -b : コンテナ起動
$ sudo systemd-nspawn -b -D ~/arch
# -n : ネットワーク
$ sudo systemd-nspawn -b -D ~/arch -n
```

これは色んな意味で正しいのですが、私の環境では動作しません。

設定したpasswordでloginできない。なお、設定していないと空なのでenterでloginできるはず(たぶん)。ttyのsecurityが働いているからです。

```sh
Arch Linux 6.0.11-arch1-1 (pts/1)
arch login:
arch-nspawn login: root
Login incorrect
```

ここでホストから`~/arch/etc/securetty`を編集し、ここでは`pts/1`でloginしようとしているため、これを追記します。`pts/0`なら`pts/0`です。その他ならそのttyを記述してください。

```sh
$ sudo vim ~/arch/etc/securetty
```

一旦、`poweroff`して仮想環境(continer)を落とします。

```sh
$ poweroff
$ machinectl list
```

次に、本来の`systemd-nspawn`の一般的な使い方を説明します。

```sh
$ machinectl --help

$ sudo mv ~/arch /var/lib/machines/
$ sudo machinectl list-images
$ sudo machinectl start arch
$ sudo machinectl login arch

# vmの削除
$ sudo machinectl remove arch

# vmをdown
$ sudo machinectl poweroff arch
$ sudo machinectl terminate arch
```

continerにアクセスする場合、loginはおすすめしません。Ctrl+Dで抜けられません

shellの場合はexitで抜けられます。continerはupしたままになります。

```sh
$ sudo machinectl shell arch
```

`/var/lib/machines`においたcontiner image(dir)をmachinectlで呼び出します。

これは、`systemctl`の`systemd-nspawn@arch`でも同じようなことができます。

```sh
# archというcontinerをstart
$ sudo systemctl start systemd-nspawn@arch
$ sudo machinectl start arch

# archというccontinerをPC起動時に立ち上げる
$ sudo systemctl enable systemd-nspawn@arch
$ sudo machinectl enable arch

$ sudo systemctl daemon-reload
```

machinectl, systemd-nspawn, systemctlのどれを使ってもいいですが、個人的にはmachinectlをおすすめします。しかし、それぞれが使い方に微妙な違いを含んでいます。

machinectlは主にvm操作で、pacstrapはarchの構築、systemctlはホスト環境の構築、systemd-nspawnはdir(chroot)操作です。

```sh
# イメージのダウンロード
$ sudo machinectl pull-tar --verify=no http://localhost:8000/arch.tar.gz arch

# アーカイブ
$ sudo machinectl export-tar --format=[gz, bzip2, xz] [コンテナ名] [ファイル名]
# xz でマルチスレッド圧縮をする例 (一番お勧め！)
$ maxz() { machinectl export-tar $1 $1.tar && nice -n 20 xz -z -f -T $(nproc) -vv $1.tar; }
$ maxz gbase
# インポート
$ sudo machinectl import-tar [ファイル名] [コンテナ名]

# docker imgをインポート
$ sudo docker export $(docker create debian:latest) | machinectl import-tar - debian

# hostのnetworkを使う, VirtualEthernetもconfiguredにすると有効
$ networkctl
IDX LINK    TYPE     OPERATIONAL SETUP
  1 lo      loopback carrier     unmanaged
  2 eth0  ether    routable    configured
  3 ve-arch ether    no-carrier  configuring
$ sudo vim /etc/systemd/nspawn/arch.nspawn
```

```sh:/etc/systemd/nspawn/arch.nspawn
[Network]
VirtualEthernet=no
```

```sh
# ssh接続
$ ssh-keygen -f ~/.ssh/test
$ sudo cat ~/.ssh/test.pub >> /var/lib/machines/arch/root/.ssh/authorized_keys

$ sudo machinectl shell arch
$ pacman -S openssh
$ vim /etc/ssh/sshd_config
$ systemctl enable sshd
$ systemctl start ssh
$ exit

$ ssh root@localhost -p xxx -i ~/.ssh/test
```

```sh
$ sudo machinectl clone arch backup
$ sudo machinectl poweroff arch
$ sudo machinectl remove arch
$ sudo machinectl clone backup arch
```
