$(function(){

	$(document).bind('keydown','ctrl+return',
		function(){
			window.location.href = '/blog';
		})

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
