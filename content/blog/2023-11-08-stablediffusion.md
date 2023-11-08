+++
date = "2023-11-08"
tags = ["diffusion"]
title = "stable-diffusionのanimatediff-cliを試してみた"
slug = "stable-diffusion"
+++

https://github.com/neggles/animatediff-cli

```sh
$ git clone https://github.com/neggles/animatediff-cli
$ cd animatediff-cli
$ python3.10 -m venv .venv
$ source .venv/bin/activate
# install Torch. Use whatever your favourite torch version >= 2.0.0 is, but, good luck on non-nVidia...
$ pip3 install torch torchvision torchaudio

$ python
>>> import torch
>>> torch.backends.mps.is_available()
True

# install the rest of all the things (probably! I may have missed some deps.)
$ python -m pip install -e '.[dev]'
```

modelのloraは、基本的にアニメ絵がうまいやつで、このツールはloraの`motion-module`を使います。

motion-lora : https://drive.google.com/drive/folders/1EqLC65eR1-W-sGD0Im7fkED6c8GkiNFI

```sh
$ mv *.ckpt ./data/models/motion-module/

$ vim config/prompts/01-ToonYou.json
"motion_module": "models/motion-module/mm_sd_v15_v2.ckpt"

$ animatediff --help
```

