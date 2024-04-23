+++
date = "2016-06-16"
tags =  ["pc"]
title = "docs-slate"
slug = "docs-slate"
+++

ドキュメントは何で書いていますか?

[sphinx](https://github.com/sphinx-doc/sphinx)とか定番です。

でも[slate](https://github.com/lord/slate)とか先駆的なのでオススメです(と言っても若干古い)。

<pre><code class="bash">
$ git clone https://github.com/lord/slate
$ cd !$:t
$ bundle install
$ bundle exec middleman server
</code></pre>

見た目のカスタマイズには`source/layouts/layout.erb`とかを編集します。`html`でなく`erb`で書きます。`css`は`scss`で書きますので、`source/stylesheets/_foo.scss`を用意して、`source/stylesheets/{print.css.scss,screen.css.scss}`などからインポートします。

`gitlab-ci`でdeployする場合は`middleman`を使いまので、以下のような感じ。

```yml
image: ruby:2.3

pages:
  script:
  - apt-get update -yqqq
  - apt-get install -y nodejs
  - bundle install
  - bundle exec middleman build
  artifacts:
    paths:
    - public
  only:
  - master
```

これはハマりポイントなのですが、GitLab Pagesは、`paths`を`public`で指定しないとDeployに何故か失敗します。

更に、`Middleman`は`build`ディレクトリにビルドされるのがデフォルトで、これを設定ファイルである`config.rb`にて指定しなければなりません。

<pre><code class="yml">
configure :build do
  set :build_dir, 'public'
end
</code></pre>

それと、`bundle`は`nodejs`をインストールしなければ使えなかった気がします。インストールしないと`bundle`がないと言われるし、`gem i bundler`でインストールすると、`middleman build`が何故か失敗するような感じだった覚えがあります。正直、よく分からん...。

個人的には、`Middleman`はもう使いたくないのですが、他のDoc Genよりはマシということで。
