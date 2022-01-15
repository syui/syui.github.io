#!/bin/zsh
d=${0:a:h}
dd=${0:a:h:h}


n=`cat $d/static/json/tarot.json|jq "length"`
n=`expr $n - 1`
bg=$dd/static/img/tarot_bg.png

for ((i=0;i<=$n;i++))
do
	p=`cat $d/static/json/tarot.json|jq -r ".[$i].p"`
	h=`cat $d/static/json/tarot.json|jq -r ".[$i].h"`
	s=`cat $d/static/json/tarot.json|jq -r ".[$i].src"`
	s=$dd/static/img/yui_$s.png
	o=$dd/content`cat $d/static/json/tarot.json|jq -r ".[$i].file"`.png
	echo "$s -> $o"
	composite -gravity north  -geometry +0+160 -compose over $s $bg $o
	if [ `echo $h|wc -m` -eq 2 ];then
	mogrify -font "/System/Library/AssetsV2/com_apple_MobileAsset_Font6/5ef536f846908ec81f4b37caef397b3cb050b64e.asset/AssetData/ToppanBunkyuGothicPr6N.ttc" -fill white -pointsize 200 -annotate +930+2570 "$h" $o
else
	mogrify -font "/System/Library/AssetsV2/com_apple_MobileAsset_Font6/5ef536f846908ec81f4b37caef397b3cb050b64e.asset/AssetData/ToppanBunkyuGothicPr6N.ttc" -fill white -pointsize 200 -annotate +830+2570 "$h" $o
	fi
	squoosh-cli --webp '{"quality":100}' -d $dd/content/ai/tarot/ --resize '{width:400,height:550}' $o
done

s=$dd/static/img/tarot.png
o=$dd/content/ai/tarot/tarot_00.webp
composite -gravity north  -geometry +0+160 -compose over $s $bg $o
