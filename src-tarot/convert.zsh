#!/bin/zsh
d=${0:a:h}
dd=${0:a:h:h}
unset good
if [ -n $1 ];then
	good="true"
fi
n=`cat $d/static/json/tarot.json|jq "length"`
n=`expr $n - 1`
bg=$dd/static/img/tarot_bg.png
br=$dd/static/img/tarot_br.png
bbr=$br
if [ -f "$dd/migmix-2p-bold.ttf" ];then
	font="$dd/migmix-2p-bold.ttf"
elif [ -f "/System/Library/AssetsV2/com_apple_MobileAsset_Font6/5ef536f846908ec81f4b37caef397b3cb050b64e.asset/AssetData/ToppanBunkyuGothicPr6N.ttc" ];then
	font="/System/Library/AssetsV2/com_apple_MobileAsset_Font6/5ef536f846908ec81f4b37caef397b3cb050b64e.asset/AssetData/ToppanBunkyuGothicPr6N.ttc"
fi
echo $font
random=$(($RANDOM % $n))
echo kira $random

if [ 1 -eq $(($RANDOM % 3)) ];then
	if [ 1 -eq $(($RANDOM % 7)) ];then
		echo "gold !"
		good="true"
		kr=$dd/static/img/tarot_kr.png
	else
		echo "silver !"
		kr=$dd/static/img/tarot_bgs.png
	fi
else
	kr=$dd/static/img/tarot_bgr.png
fi
echo $kr

for ((i=0;i<=$n;i++))
do
	p=`cat $d/static/json/tarot.json|jq -r ".[$i].p"`
	h=`cat $d/static/json/tarot.json|jq -r ".[$i].h"`
	s=`cat $d/static/json/tarot.json|jq -r ".[$i].src"`
	sss=`cat $d/static/json/tarot.json|jq -r ".[$i].file"`
	s=$dd/static/img/yui_$s.png
	o=$dd/content`cat $d/static/json/tarot.json|jq -r ".[$i].file"`.png
	echo "$s -> $o"
	if [ $i -eq $random ];then
		goodh=$h
		goodp=$p
		goodo=$o
		goods=$s
		goodss=$sss
		br=$kr
	else
		br=$bbr
	fi
	if [ -z $1 ];then
		composite -gravity north  -geometry +0+160 -compose over $s $bg $o.back
		composite -gravity north  -geometry +0+0 -compose over $br $o.back $o
		rm $o.back
		if [ `echo $h|wc -m` -eq 2 ];then
			mogrify -font "$font" -fill white -pointsize 200 -annotate +930+2570 "$h" $o
		else
			mogrify -font "$font" -fill white -pointsize 200 -annotate +830+2570 "$h" $o
		fi
		squoosh-cli --webp '{"quality":100}' -d $dd/content/ai/tarot/ --resize '{width:400,height:550}' $o
	fi
done

if [ "$good" = "true" ];then
	ss=$goodss
	s=$goods
	h=$goodh
	o=$goodo
	echo $ss
	for ((ii=0;ii<=9;ii++))
	do
		title=$dd/content/ai/tarot/null
		o=${title}_${ii}.png
		br=$dd/static/img/tarot_bgg_${ii}.png
		composite -gravity north  -geometry +0+160 -compose over $s $bg $o.back
		composite -gravity north  -geometry +0+0 -compose over $br $o.back $o
		rm $o.back
		if [ `echo $h|wc -m` -eq 2 ];then
			mogrify -font "$font" -fill white -pointsize 200 -annotate +930+2570 "$h" $o
		else
			mogrify -font "$font" -fill white -pointsize 200 -annotate +830+2570 "$h" $o
		fi
		#squoosh-cli --webp '{"quality":100}' -d $dd/content/ai/tarot/ --resize '{width:400,height:550}' $o
	done
	cd $dd/content/ai/tarot/
	convert -layers optimize -loop 0 -delay 100 null_*.png test.gif
	cp $dd/content${ss}.webp $dd/content${ss}.back.webp
	mv test.gif $dd/content${ss}.webp
	rm null_*
	cd $dd
fi

s=$dd/static/img/tarot.png
o=$dd/content/ai/tarot/tarot_00.webp
composite -gravity north  -geometry +0+160 -compose over $s $bg $o
