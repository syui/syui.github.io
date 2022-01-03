---
title: "ai"
type: "ai"
---

<script>
function changeImage() {
	var element = document.getElementById('box');
	if( element.classList.contains('pause') == true ){
		element.className = "play";
		//element.firstElementChild.src = "/ai/ai_circle.png";
	} else {
		element.className = "pause";
		//element.firstElementChild.src = "/ai/ai_circle_pause.png";
	}
}
var playing = false;

function action() {
	var audio = document.getElementById("audio");
	if (playing === false) {
		audio.play();
		playing = true;
	} else {
		audio.pause();
		playing = false;
	}
}
</script>

<span id="box" class="pause"><img id="player" onclick="action();changeImage();" src="/ai/ai_circle.png" /></span>
<audio id="audio" src="/music/tuki.mp3" loop autoloop></audio>

