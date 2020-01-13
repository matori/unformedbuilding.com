jQuery(function($) {

	setInterval( function() {
		var hours = new Date().getHours();
		var degree = hours * -15 + 'deg';
		$('#wadokei > ol').animate({rotate: degree}, 1000, 'easeOutElastic');
	}, 1000);

});