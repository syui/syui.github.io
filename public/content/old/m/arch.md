+++
date = "2022-10-29"
lastmod = "2022-12-05"
tags = ["arch","m"]
title = "archlinux"
slug = "arch"
+++

# install

archのinstallは簡単で`/`にpacstrapでarch(linux,base)を入れること。bootを設定することです。grubが簡単なのでgrubを使用します。bootloaderは起動時にlinux.imgを実行したり選択するものです。

現在は、macbook air(intel)の2台にインストールしています。serverやdockerもほとんどarchlinuxを使用しています。

`arch-install-script`が用意されているので、面倒な人は実行するといいでしょう。

https://wiki.archlinux.org/title/Installation_guide

```sh
# https://gitlab.archlinux.org/archlinux/arch-install-scripts
$ archinstall
```

私は毎回手動でinstallしています。昔は自動化していましたがメンテナンスが面倒になりました。

```sh
$ fdisk -l
/dev/nvme0n1p1
/dev/nvme0n1p2

$ mkfs.vfat /dev/nvme0n1p1
$ mkfs.ext4 /dev/nvme0n1p2
$ mount  /dev/nvme0n1p2 /mnt
$ mkdir -p /mnt/boot/efi
$ mount  /dev/nvme0n1p1 /mnt/boot/efi
$ pacstrap /mnt base linux grub efibootmgr
$ arch-chroot /mnt
$ grub-install --force /dev/nvme0n1p1
$ grub-mkconfig -o /boot/grub/grub.cfg
$ passwd
$ useradd -m -g wheel -s /bin/bash ${username} 
$ passwd ${username}
```

```sh
# mkfs.vfat /dev/sda1
# mkfs.ext4 /dev/sda2
# grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=arch_grub
```

```sh
$ pacman -S base-devel zsh git vim tmux sudo dhcpcd openssh
$ systemctl enable dhcpcd
$ systemctl enable sshd
$ chsh -s /bin/zsh
```

```sh
$ exit
$ reboot
```

## network

`dhcpcd`を使う方法と`systemd-networkd`を使う方法があります。基本的にどのlinuxもdhcpcdを入れておりnetworkを設定しています。

まずkernelで自動設定されるインターフェイス名を`eth0`などに戻しましょう。

```sh
$ ip route show
enp0s12 192.168.1.23
```

```sh
# 伝統的な名前を使う
$ mkdir -p /etc/systemd/network/99-default.link.d
$ vim /etc/systemd/network/99-default.link.d/traditional-naming.conf
[Link]
NamePolicy=keep kernel

# こちらの方法も使える
$ ln -s /dev/null /etc/udev/rules.d/80-net-setup-link.rules
```

### dhcpcd

> /etc/dhcpcd.conf

```sh:/etc/dhcpcd.conf
interface eth0
static ip_address=192.168.1.23/24	
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 1.1.1.1
```

### systemd-networkd

```sh
$ systemctl disable dhcpcd
$ vim /etc/systemd/network/eth.network
```

```sh:/etc/systemd/network/eth.network
[Match]
Name=eth0

[Network]
Address=192.168.1.23/24
Gateway=192.168.1.1
DNS=192.168.1.1
```

```sh
$ systemctl enable systemd-networkd
```

なお、デバイスによってはこの方法で接続できない場合があります。その場合は`dhcpcd`が有効です。

nameserverは`/etc/resolv.conf`を見てください。

## ssh

次にsshで接続する方法です。

```sh
# 接続する側
$ ssh-keygen -f ~/.ssh/archlinux
$ ssh-copy-id -i ~/.ssh/archlinux.pub ${username}@192.168.1.23

# 接続される側:archlinux
$ vim /etc/ssh/sshd_config
PasswordAuthentication no

$ systemctl restart sshd
```

```sh
$ ssh ${username}@192.168.1.23
```

## xorg

デスクトップ環境の構築です。

```sh
$ pacman -S tilix xterm zsh git tmux chromium otf-ipaexfont i3 xorg xorg-xinit pcmanfm lightdm lightdm-gtk-greeter
```

```sh
# autologin
$ groupadd -r autologin
$ gpasswd -a $USER autologin
$ vim /etc/lightdm/lightdm.conf
[Seat:*]
pam-service=lightdm
pam-autologin-service=lightdm-autologin
autologin-user=${USER}
autologin-user-timeout=0
session-wrapper=/etc/lightdm/Xsession
autologin-session=i3
```

```sh
$ systemctl enable lightdm
```

## zip

```sh
$ pacman -S atool zip unrar
```

## displayが暗くならないようにする

```sh
$ vim /etc/X11/xorg.conf.d/10-monitor.conf
Section "ServerFlags"
    Option "BlankTime" "0"
    Option "StandbyTime" "0"
    Option "SuspendTime" "0"
    Option "OffTime" "0"
EndSection
```

## 蓋を閉じてもsleepしないようにする

> /etc/systemd/logind.conf

```sh:/etc/systemd/logind.conf
HandleLidSwitch=suspend
HandleLidSwitchExternalPower=ignore
HandleLidSwitchDocked=ignore
```

# make

archlinux.imgを作る方法です。

https://gitlab.archlinux.org/archlinux/archiso

```sh
$ pacman -Syuu --noconfirm base-devel archiso git
$ git clone https://gitlab.archlinux.org/archlinux/archiso
$ ./archiso/archiso/mkarchiso -v -o ./ ./archiso/configs/releng/
$ tar xf *bootstrap*.tar.gz
$ mkdir -p root.x86_64/var/lib/machines/arch
$ pacstrap -c root.x86_64/var/lib/machines/arch base
```

# old

ここからは古い情報です。

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
$ pacman -S zsh git tmux vim openssh grub dhcpcd efibootmgr atool net-tools inetutils jq
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
%wheel ALL=(ALL) NOPASSWD: /usr/bin/reboot, /usr/bin/poweroff

$ exit
$ reboot
```

### macbook air(intel)

macは`/dev/sda1`のrootに`.volumeicon.icns`を置くとアイコンを設定できます。

icns : https://www.iconfinder.com

```sh
## macbook air(intel)
$ cd;mkdir boot
$ mount /dev/sda1 boot
$ grub-install --target=x86_64-efi --efi-directory=boot

$ tree -L 2 ./boot
.
├── .volumeicon.icns
├── EFI
│   └── arch/grubx64.efi
├── System
│   └── Library/CoreServices/Boot.efi
└── grub
    ├── fonts
    ├── grub.cfg
    ├── grubenv
    ├── locale
    ├── themes
    └── x86_64-efi
```

### usb

img : http://ftp.tsukuba.wide.ad.jp/Linux/archlinux/iso/

```sh
$ d=`date '+%Y.%m'`
$ curl -sLO http://ftp.tsukuba.wide.ad.jp/Linux/archlinux/iso/$d.01/archlinux-$d.01-x86_64.iso
$ diskutil list
$ sudo dd bs=4M if=./archlinux-$d.01-x86_64.iso of=/dev/disk4 conv=fsync oflag=direct status=progress
```

### locale

```sh
$ vim /etc/locale.gen
ja_JP.UTF-8 UTF-8

$ locale-gen
$ vim /etc/locale.conf
LANG=ja_JP.UTF-8
```

### timezone

```sh
$ rm -rf /etc/localtime
$ pacman -S tzdata
$ ln -s /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
$ timedatectl set-timezone Asia/Tokyo 
```

### zsh

```sh
$ pacman -S zsh
$ pacman -S powerline zsh-completions zsh-syntax-highlighting

$ vim ~/.zshrc
source /usr/share/powerline/bindings/zsh/powerline.zsh
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
fpath=(usr/share/zsh/site-functions $fpath)
autoload -Uz compinit && compinit
```

### zip

```sh
$ pacman -S atool zip unrar

# 解凍
$ aunpack test.zip

# 圧縮
$ apack test.zip $dir

# rar
$ aunpack test.rar
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

### pacman

```sh
# install
$ pacman -S zsh

# search
$ pacman -Ss zsh

# uninstall
$ pacman -R zsh
$ pacman -Rc zsh

# clean
$ pacman -Scc
```

例えば、下記はcore, extra, communityのpkg(package) binaryをmirrorlistからdownloadするという意味です。

```sh:/etc/pacman.conf
[core]
Include = /etc/pacman.d/mirrorlist

[extra]
Include = /etc/pacman.d/mirrorlist

[community]
Include = /etc/pacman.d/mirrorlist
```

速度は使用回線の場所からmirror-serverの場所により変化します。

```sh:/etc/pacman.d/mirrorlist
# japan
Server = https://ftp.jaist.ac.jp/pub/Linux/ArchLinux/$repo/os/$arch
```

armのmirrorは別です。armのjp-mirrorは`asashi linux`が用意してくれているようです。

```sh:/etc/pacman.d/mirrorlist
Server = jp.mirror.archlinuxarm.org/$arch/$repo
```

### aur

`yay`と`paru`が人気です。aurは公式にないappをinstallするときに使います。もちろん、公式にあるpkgをbuildしたいときにも使えます。

ただし、aurを使用する場合、src(source)を手元のマシンでbuildするため時間がかかります。

pacmanでinstallされるpkg(core,community,etc...)は、あらかじめarchでbuildされたbinaryをdownloadしてくるだけなので。

https://aur.archlinux.org/paru.git

```sh
$ sudo pacman -S --needed base-devel
$ git clone https://aur.archlinux.org/paru.git
$ cd paru
$ makepkg -si
$ ./paru
```

### desktop

window managerは`i3(xorg)`, `sway(wayland)`を使用しています。かつては`awesome`を使用していました。

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

その他、画像関連は`imagemagick`, `gimp`, `inkscape`, `krita`あたりが便利です。

音楽動画は`ffmpeg`, `vlc`, `mpv`あたりが便利です。

### theme

例えば、`pcmanfm`のthemeはgtk2です。

```sh
$ paru -S arc-icon-theme arc-gtk-theme ttf-font-awesome
$ ls /usr/share/{icon*,theme*,font*}
$ cp /usr/share/gtk-2.0/gtkrc ~/.gtkrc-2.0
$ vim ~/.gitrc-2.0
$ gtk-icon-theme-name = "Arc"
$ gtk-theme-name = "Arc"
$ gtk-font-name = "awesome-terminal-fonts"
```

### cron

cronie, fcron

```sh
$ sudo pacman -S fcron
$ fcrontab -e
# auto update
0 0 * * * sudo rm -rf /var/lib/pacman/db.lck && sudo pacman -Syu --noconfirm
$ systemctl enable fcron
```

`/etc/sudoers`に以下のような設定が必要です。これは、`sudo xxx`とする際にpasswordを要求しないコマンドを設定します。

```sh
%wheel ALL=(ALL) NOPASSWD: /usr/bin/pacman -Syu --noconfirm, /usr/bin/rm -rf /var/lib/pacman/db.lck
```

### vpn

vpn serverとclientは`pritunl`が便利です。

https://pritunl.com

#### vpn server

wanからlan(local-network)に入るには、様々な方法がありますが、ルーターのポートフォワーディングと呼ばれる機能とvpn serverを使用します。

ポートフォワーディングでssh-serverに接続し、dockerからpritunl(vpn server)を立ち上げ、profileを書き換えて、vpnにアクセスし、lanに入ります。lanに入ればlocal-ipが使えるはずですから、private-keyだけで様々なserverにアクセスできるはず。よく使うserverは[termius](https://syui.cf/m/post/ios/)に登録しておきましょう。

```sh
$ sudo pacman -S docker docker-compose
```

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
$ sudo pacman -S arch-install-scripts
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

# machinectlを使う場合はvmのrootフォルダはここに入れます
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

## test

```sh
# sound
$ sudo pacman -S sof-firmware
```

## docker

基本的に`docker volume prune -a`を実行しても問題ないように構築します。

`df -H`を実行して空きがあっても`100%`で`No space left on device`になることがあります。これは、大きく空き領域を確保しないと`df -i`の領域が確保されないためです。これは`docker builder prune`が有効です。

```Sh
docker-rm () {
        sudo docker system prune -a
        sudo docker builder prune -a

        sudo docker image prune -a
        sudo docker volume prune -a
        sudo docker container prune
        sudo docker network prune
        case $1 in
                (v) docker volume rm $(docker volume ls -qf dangling=true) ;;
                (p) docker rm $(docker ps -aq) ;;
                (i) docker rmi $(docker images -q) ;;
        esac
}
```

serverを移行する際は、volumeなどの権限を同じにしなければなりません。reposのdirごとtarします。したがって、以下のような手順を踏んでください。

```sh
sudo tar cvzfp app.tar.gz
scp -r app.tar.gz server:~
---
sudo tar xvzfp ~/app.tar.gz
```

