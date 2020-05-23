+++
date = "2019-12-01"
title = "airsave.vim"
description = "| vimの自動保存を可能にするplugin"
+++

[airsave.vim](https://github.com/syui/airsave.vim)は、vimの自動保存をサポートするvim-pluginです。

```sh
Plug 'syui/airsave.vim'
```

`.vimrc`に`let g:air_auto_write = 1`を書くと有効になります。

```vim
" 最小構成
aug vimrc_airsave_vim
  au!
  au TextChanged * w
aug END

" オートセーブを有効にする
let g:air_auto_write = 1
" 書き込みを表示する
let g:air_auto_write_nosilent = 1
" オートセーブを開始する
nm <Leader>s  <Plug>(AirAutoWriteStart)
" オートセーブを停止する
nm <Leader>ss <Plug>(AirAutoWriteStop)
```


