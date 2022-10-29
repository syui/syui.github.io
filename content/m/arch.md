+++
date = "2022-10-29"
tags = ["arch","m"]
title = "arch"
slug = "arch"
+++

https://github.com/syui/arch

```sh
$ fdisk -l
sda
$ export x=a
$ curl -sL git.io/air | zsh
```

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

```sh:gest.txt
$ ssh-keygen -f ~/.ssh/xxx
$ ssh-copy-id -i ~/.ssh/xxx.pub -p 2299 $user@192.168.11.15
$ ssh -p 2299 $user@192.168.11.15
```

