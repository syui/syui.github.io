#!/bin/zsh

d=${0:h:a}
cp -r $d/src-imgauto/dist/*.js $d/static/imgauto/
cp -r $d/src-imgauto/dist/*.map $d/static/imgauto/
