$(function(){

	$(document).bind('keydown','ctrl+return',
		function(){
			window.location.href = '/blog';
		}
	)

	$(document).bind('keydown', 'Shift+j',
		function(){      
			if (document.activeElement !== document.body){
				$(".article-nav-link-wrap:focus").closest("li").next().find("a.lmove").focus();
			} else {
   	$('#article-nav-older').focus();
			}
		}
	)

});
