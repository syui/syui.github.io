+++
date = "2016-12-21"
tags =  ["memo"]
title = "kubernetesを使ってみた"
slug = "kubernetes"
+++

## kubernetesを使ってみた	  

```bash
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.6.0/minikube-darwin-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/
$ curl -k -o kubectl https://kuar.io/darwin/kubectl && chmod +x kubectl && sudo mv kubectl /usr/local/bin/
$ minikube start
```

> redis-django.yaml

```
apiVersion: v1
kind: Pod
metadata:
  name: redis-django
  labels:
    app: web
spec:
  containers:
    - name: key-value-store
      image: redis
      ports:
        - containerPort: 6379
    - name: frontend
      image: django
      ports:
        - containerPort: 8000
```

```bash
$ kubectl create -f ./redis-django.yaml
$ kubectl get pods
$ kubectl get nodes
$ eval $(minikube docker-env)
$ docker ps
```

参考 : https://jedipunkz.github.io/blog/2016/07/25/minikube/
	  
