jQuery(function ($) {

  var target1 = $('div.drawing'),
      target2 = $('div.panel');
  $('#pointchange').toggle(function () {
    target1.addClass('point-top');
  }, function () {
    target1.removeClass('point-top').addClass('point-bottom');
  }, function () {
    target1.removeClass('point-bottom');
  });

  $('#backface').toggle(function () {
    target2.addClass('no-backface');
  },function () {
      target2.removeClass('no-backface');
    });

});