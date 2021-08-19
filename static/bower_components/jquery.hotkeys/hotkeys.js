$(function(){
	$(document).bind('keydown','ctrl+return',
		function(){
			$("home-layout").toggle();
			$('#terminal').click();
			var element=document.getElementById("window");
			var rect=element.getBoundingClientRect();
			var positionX=rect.left+window.pageXOffset;
			var positionY=rect.top+window.pageYOffset;
			window.scrollTo(positionX,positionY);
		})
	$('.move').click(
		function(){
			this.focus();
		});

	$(document).bind('keydown', 'Shift+j',
		function(){      
			if (document.activeElement !== document.body){
				$(".lmove:focus").closest("li").next().find("a.lmove").focus();
			} else {
   	$('#fmove').focus();
			}
		}
	)
	$(document).bind('keydown', 'Shift+k',
		function(){      
			if (document.activeElement !== document.body){
				$(".lmove:focus").closest("li").prev().find("a.lmove").focus();
			} else {
   	$('#fmove').focus();
			}
		}
	)
});
