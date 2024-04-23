+++
date = "2016-12-29"
tags =  ["memo"]
title = "docker-blog"
slug = "docker-blog"
+++

こんな感じで構築してるけど、アンチパターンぽい。

```bash
FROM archlinuxjp/archlinux:start

RUN mkdir -p /root/.ssh
RUN mkdir -p /root/bin
ADD .zshrc /root
ADD bin/script /root/bin
ADD .ssh/config /root/.ssh
ADD .ssh/id_rsa /root/.ssh
RUN chmod 700 /root/.ssh/id_rsa
RUN /bin/cp -f /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

RUN pacman -Syu --noconfirm
RUN pacman -Scc --noconfirm
RUN pacman -S base-devel git zsh openssh --noconfirm
RUN pacman -S curl nodejs npm which --noconfirm

RUN npm i gulp -g

CMD /bin/zsh

RUN git config --global user.email "$USER@users.noreply.github.com"
RUN git config --global user.name "$USER"

ENV PATH $PATH:/root/bin

RUN git clone $HOST/$USER/$REPO.git
RUN which script
```

`.ssh/config`はこんな感じで。

```bash
Host gitlab.com
	RSAAuthentication yes
	IdentityFile ~/.ssh/id_rsa
	User syui
	TCPKeepAlive yes
	identitiesonly yes
	StrictHostKeyChecking no
```

特に、SSH Keyが良くなくて、本来なら`ENV GITHUB_TOKEN XXXXXXX`としてから`git clone,push ${GITHUB_TOKEN}@github.com/$USER/$REPO`などとすべきなんだけど、GitLabのACCESS_TOKENの使い方がよくわからんということで。

なぜダメなのかというと、一つはDocker Hubでプライベートにしててもアクセスがコントロールできてなくて危険だから。

SSHとACCESS TOKENでの違いはアクセス制限というか、そういったコントロールが可能で、ACCESS TOKENでのアクセスのほうがより安全。

ただ、Docker HubにAccess Tokenを置くこと自体危険だとも言えるのだけど、正直、このような全部の処理を外部サービスに任せる開発フローではどうしても危険性が増えてしまう気がする。

個人的にはDocker Hubには二段階認証及び、Access Tokenの発行ができるようになればより安心して使える気がする。
	  
