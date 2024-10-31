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
$ pacstrap /mnt base linux grub efibootmgr dhcpcd openssh
$ arch-chroot /mnt
$ grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=arch_grub
$ grub-mkconfig -o /boot/grub/grub.cfg
$ systemctl enable dhcpcd
$ systemctl enable sshd
$ passwd
$ useradd -m -g wheel -s /bin/zsh ${username} 
$ passwd ${username}
```

## ssh

まずnetworkを設定しsshでaccessしましょう。

```sh
$ ip route show
enp0s12 192.168.1.23

$ ssh ${username}@192.168.1.23

$ vim /etc/systemd/network/eth.network
```

```sh:/etc/systemd/network/eth.network
[Match]
Name=enp0s12

[Network]
Address=192.168.1.23/24
Gateway=192.168.1.1
DNS=192.168.1.1
```

```sh
$ systemctl enable systemd-networkd
```

```sh
# 接続する側
$ ssh-keygen -f ~/.ssh/archlinux
$ ssh-copy-id -i ~/.ssh/archlinux.pub ${username}@192.168.1.23

# archlinux
$ vim /etc/ssh/sshd_config
PasswordAuthentication no

$ systemctl restart sshd
```

## 蓋を閉じてもsleepしないようにする

```sh:/etc/systemd/logind.conf
HandleLidSwitch=suspend
HandleLidSwitchExternalPower=ignore
HandleLidSwitchDocked=ignore
```
