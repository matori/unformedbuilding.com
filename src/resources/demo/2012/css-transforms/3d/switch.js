jQuery(function ($) {
  $('.box, .axis').css({
                         '-webkit-transition': 'all 0.5s linear',
                         '-moz-transition'   : 'all 0.5s linear',
                         '-ms-transition'    : 'all 0.5s linear',
                         '-o-transition'     : 'all 0.5s linear',
                         'transition'        : 'all 0.5s linear'
                       });
  $('#angle').toggle(function () {
    $('.box').css({
                    '-webkit-transform': 'none',
                    '-moz-transform'   : 'none',
                    '-ms-transform'    : 'none',
                    '-o-transform'     : 'none',
                    'transform'        : 'none'
                  });
    $(this).text('元に戻す');
  }, function () {
    $('.box').css({
                    '-webkit-transform': 'rotateX(-10deg) rotateY(-20deg)',
                    '-moz-transform'   : 'rotateX(-10deg) rotateY(-20deg)',
                    '-ms-transform'    : 'rotateX(-10deg) rotateY(-20deg)',
                    '-o-transform'     : 'rotateX(-10deg) rotateY(-20deg)',
                    'transform'        : 'rotateX(-10deg) rotateY(-20deg)'
                  });
    $(this).text('正面から見る');
  });
  $('#axis').toggle(function () {
    $('.axis').css('opacity', 0);
    $(this).text('軸を表示する');
  }, function () {
    $('.axis').css('opacity', 1);
    $(this).text('軸を非表示にする');
  });
});