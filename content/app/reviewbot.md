+++
date = "2020-05-24"
title = "reviewbot"
description = "| gh-actionsで書かれたpull-reqをlintでreviewするbot"
+++

`reviewbot`は、reviewしたいgithub-repoに置くと、gh-actionsが有効になり、pull-reqが開いたとき、特定の言語をlintでreviewします。

対応言語 : `html`, `sql`

https://github.com/syui/reviewbot

詳しくはこちらのファイルを見てください。

https://github.com/syui/reviewbot/tree/master/.github/workflows

条件は変更できます。基本的には、lintをinstallして、ファイルの拡張子から判断し、lintを実行し、その出力をcommentにpostします。

```yml:.github/workflows/reviewbot.yml
on:
  pull_request:
    types: opened

jobs:
  reviewbot:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - name: Set up Ruby 2.6
      uses: actions/setup-ruby@v1
      with:
        ruby-version: 2.6.x
    - name: gem i
      run: gem i sqlint
    - name: run reviewbot
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        GITHUB_REPOSITORY: ${{ github.repository }}
        URL: ${{ github.event.pull_request.comments_url }}
        GITHUB_PR_NUMBER: ${{ github.event.pull_request.number }}
      run: |
        ## setup
        pull_n=$(jq --raw-output .pull_request.number "$GITHUB_EVENT_PATH")
        npm i -D htmllint-cli -s
        ./node_modules/htmllint-cli/bin/cli.js init
        export GOPATH=$HOME/go
        export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
        go get -v github.com/syui/xq
        ## github-api:pull-req
        p=pull.json
        URL=https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${pull_n}/comments
        curl -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${pull_n}/files > $p
        ## review htmllint
        out=html.txt
        n=`cat $p|jq length`
        n=`expr $n - 1`
        for ((i=0;i<=$n;i++))
        do
        	f=`cat $p|jq -r ".[${i}].filename"`
        	t=${f##*.}
        	if [ "html" = "$t" ];then
        		./node_modules/htmllint-cli/bin/cli.js $f |grep -v "found 0 errors" >> $out
        	fi
        done
        if [ -n "`cat $out`" ];then
          echo "### :exclamation: htmllint ...no" >> $out
        else
          echo "### :white_check_mark: htmllint ...ok" >> $out
        fi
        cat $out
        xq j $out
        curl -X POST \
           -H "Authorization: token ${GITHUB_TOKEN}" \
           -d "`xq j $out`" \
           ${URL}
        ## review sqlint
        out=sql.txt
        n=`cat $p|jq length`
        n=`expr $n - 1`
        for ((i=0;i<=$n;i++))
        do
        	f=`cat $p|jq -r ".[${i}].filename"`
        	t=${f##*.}
        	if [ "sql" = "$t" ];then
            if ! lint_body=`sqlint $f`;then
              echo "$lint_body" >> $out
            fi
        	fi
        done
        if [ -n "`cat $out`" ];then
          echo "### :exclamation: sqlint ...no" >> $out
        else
          echo "### :white_check_mark: sqlint ...ok" >> $out
        fi
        cat $out
        xq j $out
        curl -X POST \
           -H "Authorization: token ${GITHUB_TOKEN}" \
           -d "`xq j $out`" \
           ${URL}
```
