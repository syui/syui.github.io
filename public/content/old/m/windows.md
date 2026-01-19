+++
date = "2021-09-23"
lastmod = "2022-10-30"
tags = ["windows", "m"]
title = "windows"
slug = "windows"
+++

windowsの使い方をまとめます。windows11を使用しています。

|title|body|
|---|---|
|cpu|AMD Ryzen 7 5700X|
|memory|32GB / DDR4-3200 DIMM (PC4-25600)|
|gpu|GeForce RTX 4060Ti 8GB|
|storage|1TB M.2 NVMe SSD|
|inc|© INVERSENET|

## gpu

基本的にgpuのhdmi端子からdispalyに接続します。

nvidiaの[driver](https://www.nvidia.com/download)は常にupdateしてください。

download : [driver](https://www.nvidia.com/download/driverResults.aspx/216928/), [cuda v12.1](https://developer.nvidia.com/cuda-toolkit-archive), [cudnn](https://developer.nvidia.com/rdp/cudnn-archive)

現在、[pytorch](https://pytorch.org/get-started/previous-versions/)は`cuda v12.1`に対応しています。

## default setting

基本的には`pwsh`を使用します。これからはmcpからAIで操作してもらってもよいでしょう。

### search-bar(bing disable)

```sh
# 「Explorer」キーの存在確認 & 作成
New-Item -Path "HKCU:\Software\Policies\Microsoft\Windows\Explorer" -Force | Out-Null

# DisableSearchBoxSuggestions を 1 に設定（Bing無効化）
New-ItemProperty -Path "HKCU:\Software\Policies\Microsoft\Windows\Explorer" `
  -Name "DisableSearchBoxSuggestions" -PropertyType DWord -Value 1 -Force

# Explorer.exe を再起動
Stop-Process -Name explorer -Force
Start-Process explorer
```

## local account

windowsをinstallする際に、microsoft accountを要求されます。これを回避するには、インターネット接続を停止、つまり、回線を引っこ抜いてから初期設定を行う必要があります。

## winget

`choco`, `scoop`などがありますが、現在はwingetが使いやすくなっています。

```sh
# https://github.com/microsoft/winget-pkgs
$ winget install git.git
<Publisher>.<PackageName>

$ winget show --id=9NT1R1C2HH7J --source=msstore
公開元: OpenAI
発行元 URL: https://help.openai.com
```

|title|command(id)|url|
|---|---|---|
|terminal|microsoft.windowsterminal.preview|https://github.com/microsoft/terminal|
|pwsh|microsoft.powershell.preview|https://github.com/powershell/powershell|
|aishell|microsoft.aishell|https://github.com/powershell/aishell/|
|openssh|microsoft.openssh.preview|https://github.com/powershell/win32-openssh|
|wsl|microsoft.wsl|https://github.com/microsoft/wsl|
|vscode|microsoft.visualstudiocode|https://github.com/microsoft/vscode|
|vim|vim.vim|https://github.com/vim/vim-win32-installer|
|git|git.git|https://github.com/git/git|
|node|openjs.nodejs|https://github.com/nodejs/node|
|nvm|coreybutler.nvmforwindows|https://github.com/nvm-sh/nvm|
|python|python.python.3.12|https://github.com/python|
|conda|anaconda.miniconda3|https://github.com/anaconda|

|title|command(id)|
|---|---|
|cuda|nvidia.cuda|
|epicgameslauncher|epicgames.epicgameslauncher|
|blender|blenderfoundation.blender|
|discord|discord.discord|
|unity|unity.unity|
|unity hub|unity.unityhub|
|godot|godot.godot|
|obs|obsproject.obsstudio|
|ollama|ollama.ollama|
|chatgpt|--id=9NT1R1C2HH7J --source=msstore|

### default shell

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

## openssh

https://github.com/PowerShell/Win32-OpenSSH

```sh
$ winget install microsoft.openssh.beta
```

`sshd_config`は`c:/programdata/ssh/sshd_config`にあります。public-key方式でアクセスするには、最後の方の行に`authorized_keys`のpathが記載されており、そこにpublickeyを記述します。ここでは、`c:/programdata/ssh/administrators_authorized_keys`になります。なお、`ssh-copy-id`コマンドは機能しません。

```sh
$ ls c:/programdata/ssh/
```

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

## auto-login

起動時のパスワードを省略する設定です。

通常は`netplwiz`を起動して、パスワード入力が必要のチェックを外します。

仮に`ユーザーがこのコンピューターを使うには、ユーザー名とパスワードの入力が必要`のチェックボックスが表示されない場合、レジストリの値が`2`になっているので変更する必要があります。

`regedit`を開き、`HKEY_LOCAL_MACHINE > SOFTWARE > Microsoft >Windows NT > CurrentVersion > PasswordLess > Device`を`0`にします。

https://docs.microsoft.com/ja-jp/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon



### sysinternals

https://learn.microsoft.com/ja-jp/sysinternals/downloads/

### synthv

`suno`に移行しました。

作曲アプリです。

https://dreamtonics.com/synthesizerv

## stable-diffution

`comfyui`に移行しました。

AIによるイラスト生成です。

model-fileをdownloadします。今回は`stable-diffusion-v1-4`を使用します。novelaiのmodelがすごいらしい。他のmodelも`model.ckpt`に置き換えると動きます。

[huggingface.co](https://huggingface.co/)

```sh
$ git clone https://huggingface.co/CompVis/stable-diffusion-v-1-4-original
$ mv stable-diffusion-v-1-4-original stable-diffusion/models/ldm/stable-diffusion-v1
$ mv sd-v1-4.ckpt model.ckpt 
```

次に`anaconda`でstable-diffusionのpython環境を構築します。[cuda](https://developer.nvidia.com/cuda-toolkit-archive)をinstallしておいてください。

```sh
# 現在、scoop:extrasからanaconda3がなくなっています
# scoop bucket add extras
# scoop install anaconda3 

$ scoop install python rust
$ python -V
$ pip -V

$ pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu121

$ conda init powershell
$ git clone https://github.com/basujindal/stable-diffusion
$ mkdir -p ~/stable-diffusion/models/ldm/stable-diffusion-v1
$ mv sd-v1-4.ckpt ~/stable-diffusion/models/ldm/stable-diffusion-v1/model.ckpt
$ cd stable-diffusion
$ conda env create -f environment.yaml
$ conda activate ldm
# pytorchはcuda:12.1に対応しています
$ conda install pytorch torchvision torchaudio -c pytorch -c conda-forge
$ conda install jupyter pandas matplotlib -c conda-forge
$ pip install diffusers transformers scipy ftfy
$ pip install 

$ python -m pip install pytorch-lightning
$ pip install einops
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

追記 : update

[txt2img.py](https://github.com/CompVis/stable-diffusion/blob/main/scripts/txt2img.py)

1. [cuda](https://developer.nvidia.com/cuda-toolkit-archive)を12.3から12.1にdowngradeします。

2. [pytorch](https://pytorch.org/get-started/locally/)は`stable`ではなく`nightly`であるpre-versionを使わないとインストールできません。

```sh
# pytorch:nightly, cuda:12.1
$ pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu121
```

scoopの`anaconda3`がなくなっていたので手動でインストールしました。具体的には`miniconda`を適当にインストールして`~/miniconda3/condabin`にpathを通します。私はpwshを使うので、以下のコマンドで自動設定します。これをやらないと`activate`を使えません。

```sh
$ conda init powershell
```

### diffusers

`.ckpt`ではなく`.safetensors`を使用します。

- v2.1 : https://huggingface.co/stabilityai/stable-diffusion-2-1
- github : https://github.com/Stability-AI/stablediffusion
- model : [civitai](https://civitai.com/)
- prompt : [majinai](https://majinai.art/)

```sh
$ conda diactive
---
$ conda activate ldm
$ pip install diffusers
$ pip install git+https://github.com/huggingface/transformers$ 
```

```py:safe.py
# https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/text2img
from diffusers import StableDiffusionPipeline
import torch
import sys

pipe = StableDiffusionPipeline.from_single_file("model.safetensors", torch_dtype=torch.float16).to("cuda")

# Potential NSFW content was detected in one or more images. A black image will be returned instead. Try again with a different prompt and/or seed.
#pipe.safety_checker = None
#pipe.requires_safety_checker = False
# nsfw_content_detected

n = len(sys.argv)
if n == 2:
    prompt = sys.argv[1]
else:
    prompt = "masterpiece, best quality, 1girl, solo, flower, long hair, outdoors, letterboxed, school uniform, day, sky, looking up, short sleeves, parted lips, shirt, cloud, black hair, sunlight, white shirt, serafuku, upper body, from side, pink flower, blurry, brown hair, blue sky, depth of field"

print(prompt)
image = pipe(prompt=prompt, height=512, width=768).images[0]
image.save("test.png")
```

```sh
$ python safe.py
$ ls test.png

$ python safe.py "masterpiece, best quality, very_high_resolution, large_filesize, full color, beautiful kawaii, gold hair, little girl"
$ ls test.png
```

## mcafee remove

`Win`+`R`を押して`msconfig`からboot(セーフモード)を起動しましょう。以下のようなフォルダを削除します。

```sh
C:\Program Files\Common Files\McAfee
C:\Program Files\Common Files\AV
C:\Program Files(x86_64)\Common Files\McAfee
C:\Program Files(x86_64)\Common Files\AV
C:\ProgramData\McAfee
```

なお、以下のコマンドは管理者実行でも効果なし。

```sh
taskkill /im /f mfemms.exe
wmic process where "name='mfemms.exe'" delete
理由: アクセスが拒否されました。

sc stop "mfemms"
sc config "mfemms" start= disabled
sc delete "mfemms"
```

https://answers.microsoft.com/en-us/windows/forum/all/remove-all-mcafee-files/19ff126f-4378-4e43-ab7f-262a6f6e4853

## desktop

このアプリは現在非推奨です。

```sh
https://github.com/rocksdanister/lively
こういうのはあまり使わないんだけど、nasaのページが気に入っているので、それを設定したいということで。

https://eyes.nasa.gov/apps/solar-system/#/earth
```

## ultravnc

このアプリは現在非推奨です。

```sh
https://www.uvnc.com/downloads/ultravnc.html
$ winget install uvncbvba.UltraVnc

管理者権限で実行しなければ、すべてのウィンドウに対して操作することができません。

したがって、exeやstartup(shell:startup)は、`プロパティ > 管理者としてこのプログラムを実行する`にチェックを入れます。

その後、タスクスケジューラで設定しなければ自動起動しないようになりました。最上位の権限にチェックを入れます。
```

## virtualbox

このアプリは現在非推奨です。

```sh
https://www.virtualbox.org/
"C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" startvm arch --type headless

virtualboxのimgを起動時にbackgraundで実行するには、以下のようなscriptをstartupを置きます。
```


