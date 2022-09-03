+++
date = "2022-09-03"
tags = ["python","ai","illust","diffusion"]
title = "diffusion img2imgでイラストを再生成してみた"
slug = "diffusion-img2img"
+++

[diffusion](https://github.com/huggingface/diffusers)というツールがあり、[huggingface.co](https://huggingface.co/)からtokenをもらってAIによる画像ファイルを生成できます。

なお、cudaをサポートしている環境下で実行してください。

```sh
$ pip install transformers scipy ftfy
$ pip install git+https://github.com/huggingface/diffusers.git
```

```python:t.py
import torch
from diffusers import StableDiffusionPipeline
from torch import autocast
 
MODEL_ID = "CompVis/stable-diffusion-v1-4"
DEVICE = "cuda"
YOUR_TOKEN = "xxx"
 
pipe = StableDiffusionPipeline.from_pretrained(MODEL_ID, revision="fp16", torch_dtype=torch.float16, use_auth_token=YOUR_TOKEN)
pipe.to(DEVICE)
 
prompt = "a dog painted by Katsuhika Hokusai"
 
with autocast(DEVICE):
  image = pipe(prompt, guidance_scale=7.5)["sample"][0]
  image.save("test.png")
```

```sh
$ python3 t.py
```

次に、img2imgを使って画像ファイルを参照した上で生成してみます。input.pngを置いておきます。

```python:tt.py
import torch
from diffusers import StableDiffusionPipeline
from torch import autocast
 
MODEL_ID = "CompVis/stable-diffusion-v1-4"
DEVICE = "cuda"
YOUR_TOKEN = "xxx"
 
pipe = StableDiffusionPipeline.from_pretrained(MODEL_ID, revision="fp16", torch_dtype=torch.float16, use_auth_token=YOUR_TOKEN)
pipe.to(DEVICE)

from PIL import Image
from torch import autocast

prompt = "cute girl"
init_image = Image.open("input.png").convert("RGB")
init_image = init_image.resize((512, 512))
with autocast("cuda"):
    images = pipe(
        prompt=prompt,
        init_image=init_image,
        strength=0.75,
        guidance_scale=7.5,
        num_inference_steps=50,
        generator=None,
        )["sample"]
images[0].save("output.png")
```

localでのpythoの動作環境が難しいなら[google colab](https://colab.research.google.com)を使う方法もあります。

その他、モデルをcloneしてくる方法もあるようです。

```sh
# git clone https://github.com/CompVis/stable-diffusion
$ git clone https://github.com/basujindal/stable-diffusion
$ cd stable-diffusion
$ conda env create -f environment.yaml
$ conda activate ldm

# huggingface.coで同意すればcloneできるようになる 
$ git clone https://huggingface.co/CompVis/stable-diffusion-v-1-4-original
$ mv stable-diffusion-v-1-4-original stable-diffusion/models/ldm/stable-diffusion-v1
$ mv sd-v1-4.ckpt model.ckpt 

$ python optimizedSD/optimized_txt2img.py --prompt "Cyberpunk style Tokyo landscape" --H 512 --W 512 --seed 27 --n_iter 2 --n_samples 10 --ddim_steps 50
```

ref : https://zenn.dev/koyoarai_/articles/02f3ed864c6127bb2049
