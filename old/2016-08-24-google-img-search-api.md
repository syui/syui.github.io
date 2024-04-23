+++
date = "2016-08-24"
tags =  ["pc"]
title = "GoogleImgAPIを久しぶりに使ってみたら動かなくなっていた件"
slug = "google-img-search-api"
+++

## Google Img APIを久しぶりに使ってみたら動かなくなっていた件

```bash
$ curl -e http://www.my-ajax-site.com 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=riot'
{"responseData": null, "responseDetails": "The Google Web Search API is no longer available. Please migrate to the Google Custom Search API (https://developers.google.com/custom-search/)", "responseStatus": 403}
```

なるほど。Google Custom Searchを使えと。

あと、Google Img Searchを有効にするには、Google APIで有効にする必要があります。

```bash
title="カバネリ"
SEARCH_WORDS=`echo ${title} | ruby -r cgi -ne 'puts CGI.escape $_.chomp'`

# https://cse.google.com/cse/all
# https://console.developers.google.com/apis/
API_KEY=fdiosoi4IFDJyijgfioehdgosaI
SEARCH_ENGINE_ID="0850540110499400394093:dfy8a84jvdjr"
imgapiurl="https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&searchType=image&q=${SEARCH_WORDS}"
curl -sL $imgapiurl | jq -r '.items|.[]|.link'
```

前にもどこかでやった気がするこの既視感はなんだろう。まあ、いいか。

アニメサイトで使う予定の画像を取得するので、以下を読んで適切なサイズのものを取得。

https://developers.google.com/custom-search/json-api/v1/reference/cse/list

`&imgSize=xxlarge`, `&highRange=lowRange`
