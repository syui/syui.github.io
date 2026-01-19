+++
date = "2024-01-09"
tags = ["windows", "stable-diffusion", "diffusers", "python"]
title = "[stable diffusion] diffusersのscriptを作る"
slug = "stable-diffusion"
+++

現在はstable diffusionはv2.1が最新らしい。

- https://huggingface.co/stabilityai/stable-diffusion-2-1
- https://github.com/Stability-AI/stablediffusion

今回は、前回同様に`txt2img.py`を動かせる環境を構築した上で、`.safetensors`を使用し画像生成してみました。

![](https://raw.githubusercontent.com/syui/img/master/other/stable_diffusion_model_anythingv5_20240109_0001.png)

txt2imgはcliから使うstable-diffusionのようなものです。

- origin : [txt2img.py](https://github.com/CompVis/stable-diffusion/blob/main/scripts/txt2img.py)
- fork : [txt2img.py](https://github.com/basujindal/stable-diffusion/blob/main/optimizedSD/optimized_txt2img.py)

1. [cuda](https://developer.nvidia.com/cuda-toolkit-archive)を12.3から12.1にdowngradeします。

2. [pytorch](https://pytorch.org/get-started/locally/)は`stable`ではなく`nightly`であるpre-versionを使わないとインストールできません。

```sh
# pytorch:nightly, cuda:12.1
$ pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu121
$ conda install pytorch==2.1.1 torchvision==0.16.1 torchaudio==2.1.1 pytorch-cuda=12.1 -c pytorch -c nvidia
```

scoopの`anaconda3`がなくなっていたので手動でインストールしました。具体的には`miniconda`を適当にインストールして`~/miniconda3/condabin`にpathを通します。私はpwshを使うので、以下のコマンドで自動設定します。これをやらないと`activate`を使えません。

```sh
$ conda init powershell
```

新しいgpuでは5-10分の生成が1-2分以内に変わっていました。

```sh
$ conda activate ldm
$ cd ./stable-diffusion
$ python ./optimizedSD/optimized_txt2img.py --prompt "masterpiece, high quality, very_high_resolution, large_filesize, full color, beautiful kawaii, gold hair, little girl" --H 512 --W 512 --seed $seed --n_iter 1 --n_samples 1 --ddim_steps 50
```

上記のscriptが動くなら`.safetensors`を読み込む環境は整っていると思われます。

### diffusers

今回はdiffusersを使って`.ckpt`ではなく`.safetensors`を使用します。

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

![](https://raw.githubusercontent.com/syui/img/master/other/stable_diffusion_model_anythingv5_20240109_0002.png)

