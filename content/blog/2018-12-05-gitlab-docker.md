+++
date = "2018-12-05"
tags = ["docker","gitlab"]
title = "DockerのPrivate ImageをCloud上にUploadするにはGitLabが便利"
slug = "gitlab-docker"
+++


Docker Hubには、1つのPrivate Imageしか置けません(Free)。したがって、GitLab.comを使うのが最も良い選択肢です。

必要なのは、GitLab.comのGit RepositoryとAccess Tokenのみです。

https://gitlab.com/profile/personal_access_tokens

```sh
# まず、gitlab.comのdocker registryにloginします。と言っても、login情報をconfigに書き込むだけですが。
$ sudo docker login registry.gitlab.com
or
$ sudo vim ~/.docker/config.json

$ 次にdocker imageを作成して、pushすると、gitlab.comからprivate imageをpullできます。ただし、imgの公開/非公開は、git repositoryのpublic/private設定に左右されると思います。
$ sudo docker build -t registry.gitlab.com/$USER/repo .
$ sudo docker push registry.gitlab.com/$USER/repo
```

https://gitlab.com/help/user/project/container_registry

DockerのPrivate Imageは沢山の使い道があります。

一つは、Git ServerにPushするImageを作れるという点です。これによって、CIを可動させ、それを回す仕組みを作ることができます。

ただし、セキュリティ上の危険は増大します。なぜなら、Docker Image内にGit Serverへのアクセスに必要なものを置く必要があるからです。

何度かこのテーマで記事を書いたことがあった気がしますが、GitLab.comのDocker Repositoryは使えたり、使えなかったりで不安定でした。今は使えるようになっているみたいなので、再度書きました。

今の時代、GitLab.comを使わない手はありませんね。

