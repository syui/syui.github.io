+++
date = "2021-09-23"
lastmod = "2022-10-30"
tags = ["windows", "m"]
title = "windows"
slug = "windows"
+++

windowsの使い方をまとめます。

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

ADD userの場合、publickey認証が通らないことがあるようです。このようにして`c:/users/$user/.ssh/authorized_keys`に置いてみましょう。pathに`authorizedKeyPath`:`c:/users/$user/.ssh/authorized_keys`を追加します。

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

scpで`Connection closed`が出る場合、pathが通っていない可能性があります。

`sshd_config`でfstp-serverのpathを記述するか、openssh(dir)のpathを追加しましょう。

```sh
$ get-command fstp

$ Set-Item Env:Path "c:C:\Program Files\OpenSSH;$ENV:Path"
```

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

### synthv

作曲アプリです。

https://dreamtonics.com/synthesizerv

### stable-diffution

AIによるイラスト生成です。

model-fileをdownloadします。今回は`stable-diffusion-v1-4`を使用します。novelaiのmodelがすごいらしい。他のmodelも`model.ckpt`に置き換えると動きます。

[huggingface.co](https://huggingface.co/)

```sh
# huggingface.coで同意すればcloneできるようになる 
$ git clone https://huggingface.co/CompVis/stable-diffusion-v-1-4-original
$ mv stable-diffusion-v-1-4-original stable-diffusion/models/ldm/stable-diffusion-v1
$ mv sd-v1-4.ckpt model.ckpt 
```

次に`anaconda`でstable-diffusionのpython環境を構築します。[cuda 11.6](https://developer.nvidia.com/cuda-toolkit-archive)をinstallしておいてください。

```sh
# cuda 11.6
$ scoop bucket add extras
$ scoop install anaconda3 python
$ conda init powershell
$ git clone https://github.com/basujindal/stable-diffusion
$ mkdir -p ~/stable-diffusion/models/ldm/stable-diffusion-v1
$ mv sd-v1-4.ckpt ~/stable-diffusion/models/ldm/stable-diffusion-v1/model.ckpt
$ cd stable-diffusion
$ conda env create -f environment.yaml
$ conda activate ldm
# pytorchはcuda 11.6に対応しています
$ conda install pytorch torchvision torchaudio cudatoolkit=11.6 -c pytorch -c conda-forge
$ conda install jupyter pandas matplotlib -c conda-forge
$ pip install diffusers transformers scipy ftfy
```

次回からは`$ conda activate ldm`で使います。

```sh
$ conda activate ldm
$ cd ~/stable-diffusion

# query(txt)から生成
$ python optimizedSD/optimized_txt2img.py --prompt "japanese anime of a beaultiful girl, fantasy costume, fantasy background, be autiful composition, cinematic lighting, pixiv, light novel, digital painting, extremely, detailed, sharp focus, ray tracing, 8k, cinematic postprocessing" --H 512 --W 512 --seed 27 --n_iter 2 --n_samples 10 --ddim_steps 50

# imgから生成
# convert -resize 700x510 o.png input.png
$ python optimizedSD/optimized_img2img.py --prompt "japanese anime of a beaultiful girl, pixiv, light novel, digital painting, 8k" --init-img C:\Users\syui\input.png --strength 0.2 --n_iter 2 --n_samples 2 --H 300 --W 230

# web-uiからパラメータを調整
$ python optimizedSD/inpaint_gradio.py --init-img C:\Users\syui\input.png
# open localhost:7860

$ ls outputs/*
```
