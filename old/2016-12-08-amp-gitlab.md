+++
date = "2016-12-08"
tags =  ["memo"]
title = "amp対応は面倒くさい"
slug = "amp-gitlab"
+++

## amp対応は面倒くさい		

一応、`psuh`すればampも更新されるやり方を考えてみました。

`.gitlab-ci.yml`

```
  script:
  - git config --global user.email "${GITLAB_MAIL}"
  - git config --global user.name "${USER}"
  - git push https://${GITLAB_API_TOKEN}@gitlab.com/syui/amp.git
  - cp -rf content amp/
  - cd amp
  - git add .
  - git commit -m "amp"
  - git push -u origin master
```
		
