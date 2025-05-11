+++
date = "2024-06-22"
tags = ["ue5","ue"]
title = "ue5.4でcity sampleとgame animation sampleを統合する"
slug = "ue-city-sample"
+++

今回は、[city sample](https://www.unrealengine.com/marketplace/ja/product/city-sample)と[game animation sample](https://www.unrealengine.com/marketplace/en-US/product/game-animation-sample)を統合する方法を紹介します。どちらも`epic games`が提供しているので無料で使えます。最初のスターターキットとして使用されることが多くなるはずです。

city sampleのほうが複雑なので、city sampleをベースにgame animation sampleをコピーする形で統合します。

まずコピーするファイルです。

```sh
# game-animation-sample
Content
Binaries
└─Win64
    └─GameAnimationSampleEditor.target
```

編集するファイルです。これはcity sampleの方を編集します。

```sh
# city-sample
city-sample.uproject
Binaries
└─Win64
    └─UnrealEditor.modules
Config
   └─DefaultGameplayTags.ini
```

まずrootにある`${project_name}.uproject`にgame animation sampleのpluginを追加します。これはコピー側のuprojectを参照してください。長くなるのでここでは全て列挙していません。

```json:city-sample.uproject
"Plugins" : [
    { "Name":"ModelingToolsEditorMode","Enabled":true,"TargetAllowList":["Editor"] },
    .
    .
    .
]
```

次に`Binaries/Win64/UnrealEditor.modules`もコピー側のものを見て追記します。

```json:city-sample/Binaries/Win64/UnrealEditor.modules
{
  "BuildId": "0000000",
  "Modules": {
    "CitySample": "UnrealEditor-CitySample.dll",
    "CitySampleAnimGraphRuntime": "UnrealEditor-CitySampleAnimGraphRuntime.dll",
    "CitySampleEditor": "UnrealEditor-CitySampleEditor.dll",
    "GameAnimationSample": "UnrealEditor-GameAnimationSample.dll"
  }
}
```

次に`Config/DefaultGameplayTags.ini`もコピー側を見て追記します。

```sh:city-sample/Config/DefaultGameplayTags.ini
+GameplayTagList=(Tag="GameplayCue.ContextualAnim",DevComment="")
+GameplayTagList=(Tag="MotionMatching",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Default",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Idle",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Loops",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Pivots",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Starts",DevComment="")
+GameplayTagList=(Tag="MotionMatching.Stops",DevComment="")
```

大体こんな感じでやればgame animation sample(ABP_SandboxCharacter)が動くでしょう。

## なぜcity sampleとgame animation sampleが重要なのか

私は最初にこれらのassetを入れることをおすすめしています。一つは誰もが無料で使えること。もう一つはこれらの最新技術が今後のゲーム作りにおいて基本になっていくためです。

何かを触るとき、何から触り始めるのかは非常に重要で、city sampleとgame animation sampleの作りを見ていくのがいいと思います。
