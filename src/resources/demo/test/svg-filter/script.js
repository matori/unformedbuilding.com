jQuery(function ($) {
  function setBgSize() {
    var $content = $('#content-bg'),
        w = $(window).width();
    $content.css('background-size', w);
  }
  $(window).bind('load resize', function (){ setBgSize(); });
});