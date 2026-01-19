+++
date = "2024-10-29"
tags = ["arch", "macbook"]
title = "macbook air(intel)にarchlinuxをinstallした"
+++

いよいよm1の前に使っていたmacbook air(intel)の使い道がなくなっていたので、archをinstallすることにしました。例えば、homebrewはmac-intelのsupportを打ち切っています。packageのinstallはbuildが必要になり、現実的使用が困難です。

私がapple製品を買うのはハードがいいからです(長持ちです)。ただし、バッテリーは何度か交換しています。

しかし、近年は少し事情が変わってきました。apple製品を買うならgpuを買ったほうがいいかもしれません。私ならそうします。

## install

installは簡単で`/`にpacstrapでarch(linux,base)を入れること。bootを設定することです。grubが簡単なのでgrubを使用します。bootloaderは起動時にlinux.imgを実行したり選択するものです。

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
# grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=arch_grub
$ grub-install --force /dev/nvme0n1p1
$ grub-mkconfig -o /boot/grub/grub.cfg
$ passwd
$ useradd -m -g wheel -s /bin/bash ${username} 
$ passwd ${username}
```

```sh
$ pacman -S base-devel zsh git vim tmux sudo dhcpcd openssh
$ systemctl enable dhcpcd
$ systemctl enable sshd
$ chsh -s /bin/zsh
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

## displayが暗くならないようにする

```sh
$ vim ~/.xinitrc
xset s off -dpms
```

## 蓋を閉じてもsleepしないようにする

> /etc/systemd/logind.conf

```sh:/etc/systemd/logind.conf
HandleLidSwitch=suspend
HandleLidSwitchExternalPower=ignore
HandleLidSwitchDocked=ignore
```

