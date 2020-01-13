jQuery(function($) {

	setInterval( function() {
		var hours = new Date().getHours();
		var degree = hours * -15;
		var rotate = 'rotate(' + degree + 'deg)';
		$('#wadokei > ol').css({
			'-moz-transform': rotate,
			'-webkit-transform': rotate,
			'-o-transform': rotate
		});
	}, 1000);

});