+++
date = "2021-09-23"
tags = ["windows", "m"]
title = "windowsの使い方"
slug = "windows"
+++

### local account

windowsをinstallする際に、microsoft accountを要求されます。これを回避するには、インターネット接続を停止、つまり、回線を引っこ抜いてから初期設定を行う必要があります。

### openssh

https://github.com/PowerShell/Win32-OpenSSH

```sh
$ winget install microsoft.openssh.beta
```

`sshd_config`は`c:programdata/ssh/sshd_config`にあります。public-key方式でアクセスするには、最後の方の行に`authorized_keys`のpathが記載されており、そこにpublickeyを記述します。ここでは、`c:programdata/ssh/administrators_authorized_keys`になります。なお、`ssh-copy-id`コマンドは機能しません。

```sh
Match Group administrators
       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

ADD userの場合、publickey認証が通らないことがあるようです。このようにして`c:/users/$user/.ssh/authorized_keys`に置いてみましょう。

> c:/programdata/ssh/sshd_config

```sh
PasswordAuthentication no
PermitEmptyPasswords yes
AuthorizedKeysFile      .ssh/authorized_keys
#Match Group administrators
#       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

shellをpwshに変更するには、以下のコマンドを実行します。

https://docs.microsoft.com/ja-jp/windows-server/administration/openssh/openssh_server_configuration

```sh
$ New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Program Files\PowerShell\7\pwsh.exe" -PropertyType String -Force
```

default-shellを変更した場合の注意ですが、更新した際に以下のerrが出るようになる場合があります。default-shellのpathが違うとpassword/publickey認証のどちらも通りません。

> Permission denied (publickey,keyboard-interactive).

### ultravnc

https://www.uvnc.com/downloads/ultravnc.html

```sh
$ winget install uvncbvba.UltraVnc
```

管理者権限で実行しなければ、すべてのウィンドウに対して操作することができません。

したがって、exeやstartup(shell:startup)は、`プロパティ > 管理者としてこのプログラムを実行する`にチェックを入れます。

また、場合によっては`nusrmgr.cpl`から`制御設定の変更`が必要になるかもしれません。

### virtualbox

https://www.virtualbox.org/

virtualboxのimgを起動時にbackgraundで実行するには、以下のようなscriptをstartupを置きます。

```sh:startup/vm-arch.bat
"C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" startvm arch --type headless
```

### auto-login

起動時のパスワードを省略する設定です。

仮に`ユーザーがこのコンピューターを使うには、ユーザー名とパスワードの入力が必要`のチェックボックスが表示されない場合、レジストリの値が`2`になっているので変更する必要があります。

`regedit`を開き、`HKEY_LOCAL_MACHINE > SOFTWARE > Microsoft >Windows NT > CurrentVersion > PasswordLess > Device`を`0`にします。

https://docs.microsoft.com/ja-jp/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon

### winget

wingetでpwshをinstall, upgradeしてopensshのdefault-shellにする手順です。

```sh
$ ssh windows

$ winget -v
# 7.2.6
$ winget upgrade microsoft.powershell
# 7.3.0
$ winget install microsoft.powershell.preview

$ pwsh-preview

# winのpathは面倒なので適当に補完。下記でも行けると思いますが、念の為tabで変換するといいかも
$ vim c:/programdata/ssh/sshd_config
PasswordAuthentication no
ForceCommand pwsh-preview

# default-shellにする手順(forcecommandより早くなるけど注意が必要)
$ get-command pwsh-preview
$ New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Program Files\PowerShell\7-preview\preview\pwsh-preview.cmd" -PropertyType String -Force

$ net stop sshd
$ net start sshd

$ exit
$ ssh windows
powershell 7.3.0-preview

$ winget upgrade --all
```
