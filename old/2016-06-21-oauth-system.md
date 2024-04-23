+++
date = "2016-06-21"
tags =  ["memo"]
title = "OAuthButton"
slug = "oauth-system"
+++

Demo:

[https://syui-redux.herokuapp.com](https://syui-redux.herokuapp.com)

## OAuth Button		

[https://elements.heroku.com/buttons/lynndylanhurley/redux-auth-demo](https://elements.heroku.com/buttons/lynndylanhurley/redux-auth-demo)

基本的に以下をHerokuにデプロイするとデモできます。まずはローカルでデモしてみます。

```bash
$ git clone git@github.com:lynndylanhurley/redux-auth-demo.git
$ cd redux-auth-demo
$ npm install
$ npm run watch
```

## OAuth Library

[https://github.com/octokit/octokit.rb](https://github.com/octokit/octokit.rb)

[https://github.com/lynndylanhurley/devise_token_auth](https://github.com/lynndylanhurley/devise_token_auth)

基本的には、`octokit`を使えばよいです。古いやり方です。

## OAuth WebFlow

[https://github.com/oauth-io/oauthd](https://github.com/oauth-io/oauthd)

基本的には、[OAuth.io](https://oauth.io)を使います。これには登録が必要です。しかし、簡単に少ないIDで認証を作れるために重宝します。
		
