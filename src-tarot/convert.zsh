#!/bin/zsh
d=${0:a:h}
dd=${0:a:h:h}

# convert.zsh -d : no-run
# convert.zsh -a : gold
# convert.zsh -n : normal
# convert.zsh -a 13 : tarot 13 gold
echo " $ convert.zsh -a 13 : tarot 13 gold"

cache=$dd/static/img/cache
dir=$dd/content/ai/tarot
static=$dd/static/img
json=$dd/static/json/tarot.json
jsons=$d/static/json/tarot.json

unset good
unset goodh

if [ "$1" = "-a" ];then
	good="true"
fi
n=`cat $d/static/json/tarot.json|jq "length"`
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
	random=`expr $2 - 1`
fi

echo kira $random

if [ 1 -eq $(($RANDOM % 3)) ];then
	if [ 1 -eq $(($RANDOM % 7)) ];then
		echo "gold !"
		good="true"
		kr=$static/tarot_kr.png
	else
		echo "silver !"
		kr=$static/tarot_bgs.png
	fi
else
	kr=$static/tarot_bgr.png
fi

if [ "$1" = "-n" ];then
	kr=$static/tarot_br.png
fi

echo $kr

if [ -f $cache/tarot_00.webp ];then
	echo 'cp -rf $cache/*.webp $dir/'
	rsync -av $cache/*.webp $dir/
fi

for ((i=0;i<=$n;i++))
do
	p=`cat $d/static/json/tarot.json|jq -r ".[$i].p"`
	h=`cat $d/static/json/tarot.json|jq -r ".[$i].h"`
	s=`cat $d/static/json/tarot.json|jq -r ".[$i].src"`
	sss=`cat $d/static/json/tarot.json|jq -r ".[$i].file"`
	file_s=${sss##*/}
	file_c=${cache}/${file_s}.png
	file_g=$dir/${file_s}.gif
	s=$dd/static/img/yui_$s.png
	o=$dd/content`cat $d/static/json/tarot.json|jq -r ".[$i].file"`.png
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
		composite -gravity north  -geometry +0+160 -compose over $s $bg $o.back
		composite -gravity north  -geometry +0+0 -compose over $br $o.back $o
		rm $o.back
		if [ `echo $h|wc -m` -eq 2 ];then
			mogrify -font "$font" -fill white -pointsize 200 -annotate +930+2570 "$h" $o
		else
			mogrify -font "$font" -fill white -pointsize 200 -annotate +830+2570 "$h" $o
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
		for ((ii=0;ii<=9;ii++))
		do
			title=$dir/null
			o=${title}_${ii}.png
			br=$static/tarot_bgg_${ii}.png
			composite -gravity north  -geometry +0+160 -compose over $s $bg $o.back
			composite -gravity north  -geometry +0+0 -compose over $br $o.back $o
			rm $o.back
			if [ `echo $h|wc -m` -eq 2 ];then
				mogrify -font "$font" -fill white -pointsize 200 -annotate +930+2570 "$h" $o
			else
				mogrify -font "$font" -fill white -pointsize 200 -annotate +830+2570 "$h" $o
			fi
			squoosh-cli --webp '{"quality":90}' -d $dir --resize '{width:400,height:550}' $o
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

if [ ! -f $dir/tarot_00.webp ];then
	s=$static/tarot.png
	o=$dir/tarot_00.webp
	composite -gravity north  -geometry +0+160 -compose over $s $bg $o
fi

if [ -f $dir/${file_s}.png ];then
	mv $dir/*.png $cache/
	rsync -av $dir/*.webp $cache/
fi

