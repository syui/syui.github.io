function highlight_prompt() {
    var list = document.body.getElementsByClassName("language-sh hljs bash");
    if ( list.length >= 1 ) {
    	for(i=0; i <= list.length-1; i++){
    	    var nodes = list[i].innerHTML;
    	    if (nodes.match(/\$ /)){
    	        t = nodes.replace(/^\$ /mg,"<span class='prompt'>$ </span>");
    	        document.getElementsByClassName("language-sh hljs bash")[i].innerHTML = '';
    	        document.getElementsByClassName("language-sh hljs bash")[i].insertAdjacentHTML('afterbegin', t);		
    	    };
    	};
    };
}
