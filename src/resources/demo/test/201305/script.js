jQuery(function ($) {

  var $body = $('body');
  var $side = $('#side');
  var $main = $('#main');
  var sideHeight = $side.outerHeight();

  $side.css('height', window.innerHeight + 'px');

  $('#switch').on('click', function (e) {
    e.preventDefault();
    if ($body.hasClass('open')) {
      $main.css('height', '')
    } else {
      $main.css('height', sideHeight + 'px');
    }
    $body.toggleClass('open');
  })

});