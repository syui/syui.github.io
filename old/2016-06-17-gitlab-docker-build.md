+++
date = "2016-06-17"
tags =  ["pc"]
title = "gitlab-docker-build"
slug = "gitlab-docker-build"
+++

GitLabがDockerとの連携機能を提供しはじめたのでDockerを使ってのビルドやテスト、プッシュが簡単になりました。

[http://docs.gitlab.com/ce/ci/docker/using_docker_build.html](http://docs.gitlab.com/ce/ci/docker/using_docker_build.html)

<pre><code class="bash">
$ sudo docker ps -a
$ sudo systemctl start docker
$ docker login registry.gitlab.com
$ mkdir -p ~/docker/reponame/Dockerfile
$ cd ~/docker/reponame
$ sudo docker build -t registry.example.com/group/project .
$ sudo docker tag my-image my-registry:5000/my-image
$ sudo docker run my-docker-image /script/to/run/tests
$ sudo docker push registry.example.com/group/project
</code></pre>

`.gitlab-ci.yml`をこんな感じで書けるようになります。

<pre><code class="yml">
build_image:
  image: docker:git
  services:
  - docker:dind
  script:
    - docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN registry.example.com
    - docker build -t registry.example.com/my-group/my-project .
    - docker run registry.example.com/my-group/my-project /script/to/run/tests
    - docker push registry.example.com/my-group/my-project:latest
  only:
    - master
</code></pre>

[https://about.gitlab.com/2016/05/23/gitlab-container-registry/](https://about.gitlab.com/2016/05/23/gitlab-container-registry/)
