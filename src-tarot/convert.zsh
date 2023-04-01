#!/bin/zsh
d=${0:a:h}
dd=${0:a:h:h}

# convert.zsh -d : no-run
# convert.zsh -a : gold
# convert.zsh -n : normal
# convert.zsh -a 13 : tarot 13 gold
echo " $ convert.zsh -a 13 : tarot 13 gold"

cache=$dd/static/img/cache
dir=$dd/content/ai/card
static=$dd/static/img
json=$dd/static/json/card.json
jsons=$d/static/json/card.json
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
nvm use 17
unset good
unset goodh

if [ "$1" = "-a" ];then
	good="true"
fi
n=`cat $d/static/json/card.json|jq "length"`
n=`expr $n - 1`
bg=$static/tarot_bg.png
br=$static/tarot_br.png
bbr=$br
if [ -f "$dd/migmix-2p-bold.ttf" ];then
	font="$dd/migmix-2p-bold.ttf"
fi
echo $font
random=$(($RANDOM % $n))

if [ -n "$2" ];then
	random=$2
	random=`expr $2`
fi

echo kira $random


kr=$static/tarot_br.png
echo $kr

if [ -f $cache/card_0.webp ];then
	echo 'cp -rf $cache/*.webp $dir/'
	rsync -av $cache/*.webp $dir/
fi

for ((i=0;i<=$n;i++))
do
	p=`cat $d/static/json/card.json|jq -r ".[$i].p"`
	h=`cat $d/static/json/card.json|jq -r ".[$i].h"`
	s=`cat $d/static/json/card.json|jq -r ".[$i].src"`
	sss=`cat $d/static/json/card.json|jq -r ".[$i].file"`
	file_s=${sss##*/}
	file_c=${cache}/${file_s}.png
	file_g=$dir/${file_s}.gif
	s=$dd/static/img/yui_$s.png
	o=$dd/content`cat $d/static/json/card.json|jq -r ".[$i].file"`.png
	if [ $i -eq $random ];then
		jq_s=$i
		jq_i=$file_s
		good_cache_gif=$file_g
		good_png=$dir/${file_s}.png
		good_webp=$dir/${file_s}.webp
		goodh=$h
		goodp=$p
		goodo=$o
		goods=$s
		goodss=$sss
		br=$kr
	else
		br=$bbr
	fi
	if [ "$1" != "-a" ] && [ "$1" != "-d" ] || [ $i -eq $random ];then
		echo $o
		composite -gravity center  -compose over $s $bg $o.back
		composite -gravity center  -compose over $br $o.back $o

		rm $o.back
		if [ `echo $h|wc -m` -eq 2 ];then
			#mogrify -font "$font" -fill white -pointsize 200 -annotate +930+2570 "$h" $o
		else
			#mogrify -font "$font" -fill white -pointsize 200 -annotate +830+2570 "$h" $o
		fi
		squoosh-cli --webp '{"quality":100}' -d $dir/ --resize '{width:400,height:550}' $o
	fi
done

if [ -f $goodo ];then
	rm $goodo
fi

if [ "$good" = "true" ];then
	ss=$goodss
	s=$goods
	h=$goodh
	o=$goodo
	echo $ss
	if [ -f $good_cache_gif ];then
		cp -rf $good_cache_gif $good_webp
	else
		for ((ii=0;ii<=7;ii++))
		do
			title=$dir/null
			o=${title}_${ii}.png
			br=$static/tarot_bgg_${ii}.png
			composite -gravity center -compose over $s $bg $o.back
			composite -gravity center -compose over $br $o.back $o
			rm $o.back
			if [ `echo $h|wc -m` -eq 2 ];then
				#mogrify -font "$font" -fill white -pointsize 200 -annotate +930+2570 "$h" $o
			else
				#mogrify -font "$font" -fill white -pointsize 200 -annotate +830+2570 "$h" $o
			fi
			squoosh-cli --webp '{"quality":100}' -d $dir --resize '{width:400,height:550}' $o
		done
		convert -layers optimize -loop 0 -delay 40 $dir/null_*.webp $good_cache_gif
		#mogrify -resize 400x550 $good_cache_gif
		cp $good_cache_gif $dd/content${ss}.webp
		rm -f $dir/null_*
		ja=`cat $json|jq ".[$jq_s]|.+{\"gif\":\"true\"}" |jq -s ".|= .+[]"`
		jb=`cat $json|jq "del(.[$jq_s])"`
		echo $ja $jb | jq -s add | jq "sort_by(.id)" > $d/t.json
		mv $d/t.json $json
	fi
fi

if [ ! -f $dir/card_0.webp ] || [ ! -f $dir/card_0.gif ];then
	s=$static/card_0.png
	o=$dir/card_0.webp
	h=`cat $d/static/json/card.json|jq -r ".[0].h"`
	good_cache_gif=$dir/card_0.gif
		composite -gravity center -compose over $s $bg $o.back
	composite -gravity center   -compose over $s $bg $o
	for ((ii=0;ii<=7;ii++))
	do
		title=$dir/null
		o=${title}_${ii}.png
		br=$static/tarot_bgg_${ii}.png
		composite -gravity center  -compose over $s $bg $o.back
		composite -gravity center  -compose over $br $o.back $o
		rm $o.back
		if [ `echo $h|wc -m` -eq 2 ];then
			#mogrify -font "$font" -fill white -pointsize 200 -annotate +930+2570 "$h" $o
		else
			#mogrify -font "$font" -fill white -pointsize 200 -annotate +830+2570 "$h" $o
		fi
		squoosh-cli --webp '{"quality":100}' -d $dir --resize '{width:400,height:550}' $o
	done
	convert -layers optimize -loop 0 -delay 40 $dir/null_*.webp $good_cache_gif
		rm -f $dir/null_*
fi

if [ -f $dir/${file_s}.png ];then
	mv $dir/*.png $cache/
	rsync -av $dir/*.webp $cache/
fi

