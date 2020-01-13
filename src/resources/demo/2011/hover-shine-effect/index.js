jQuery(function($) {
  var effect = $('<span/>').addClass('effect');
  $('.shine').append(effect);
  $('.shine').hover(
    function() {
      $(this).find('.effect')
      .stop()
      .animate({left: '50px'}, 600);
    },
    function() {
      $(this).find('.effect').css('left', '-70px');
    }
  );
});