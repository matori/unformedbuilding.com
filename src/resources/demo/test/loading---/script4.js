jQuery(function ($) {

  var msg = document.getElementById('message'),
      spinner = document.getElementById('loading');
  $(spinner).delay(1900).fadeOut(100);
  $(msg).delay(2000).fadeIn(200)

});