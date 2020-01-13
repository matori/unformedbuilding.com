jQuery(function ($) {

  var msg = document.getElementById('message'),
      spinner = document.getElementById('loading');
  $(spinner).delay(900).fadeOut(100);
  $(msg).delay(1000).fadeIn(200)

});