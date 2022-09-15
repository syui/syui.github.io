#!/bin/zsh
d=${0:a:h}
dd=${0:a:h:h:h:h}

dir=$d
cd $dir

export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
nvm use 17
squoosh-cli --webp '{"quality":100}' -d ./ *.png

cp -rf *.png $dd/static/img/
cp -rf *.webp $dd/static/img/min/
rm *.png
