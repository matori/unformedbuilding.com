jQuery(function($) {

/*
  following navigation
*/
var sidebar = $('#sidebar'),
	sPos = $(sidebar).position();

$(window).scroll(function(){
	var scroll = $(window).scrollTop();
	if(scroll < 166) {
		$(sidebar).css('top', sPos.top);
	}
	else {
		$(sidebar).css('top', scroll + 20);
	}
});
/*-- END following navigation --*/

});