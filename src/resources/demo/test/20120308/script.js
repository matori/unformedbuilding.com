jQuery(function ($) {

  var header = $('h1').eq(0),
      container = $('#tag-babbles'),
      tags = container.find('li'),
      count = tags.length,
      w = container.width(),
      h = $(window).height() - header.outerHeight() - 180,
      rgb = function () {
        return Math.floor(Math.random() * 180) + 80;
      };

  container.css('height', h);

  tags.each(function () {
    var t = Math.floor(Math.random() * h),
        l = Math.floor(Math.random() * w),
        delay = Math.random() * 5,
        red = rgb(),
        green = rgb(),
        blue = rgb(),
        bgcolor = 'rgba(' + red + ',' + green + ',' + blue + ', 0.7)',
        radius = $(this).find('a').width() + 'px';
    t = t - $(this).height() / 2;
    l = l - $(this).width() / 2;
    $(this).css({
                  top                 : t,
                  left                : l,
                  webkitAnimationDelay: delay + 's',
                  MozAnimationDelay   : delay + 's'
                }).addClass('animate');
    $(this).find('a').css({height: radius, lineHeight: radius, backgroundColor: bgcolor});
  });

  tags.draggable();
});