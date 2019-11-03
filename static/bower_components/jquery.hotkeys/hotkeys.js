$(function(){
$(document).bind('keydown','ctrl+return',function(){$("home-layout").toggle();$('#terminal').click();var element=document.getElementById("window");var rect=element.getBoundingClientRect();var positionX=rect.left+window.pageXOffset;var positionY=rect.top+window.pageYOffset;window.scrollTo(positionX,positionY);})
$('.move').click(function(){this.focus();});});
