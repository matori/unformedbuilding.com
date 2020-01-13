jQuery(function ($) {

  var bubbleContainer = $('#container'),
      bubbles = bubbleContainer.find('li'),

      rand = function (min, max, integer) {
        var num = Math.random() * (max - min);
        if (integer) {
          num = Math.floor(num);
        }
        num = num + min;
        return num;
      },

      rgb = function (min, max) {
        var channels = [];
        for (var i = 0; i < 3; i++) {
          channels.push(rand(min, max, true));
        }
        return channels.join(',');
      },

      rising = function (el) {
        var fSize = rand(20, 40, true),
            color = rgb(100, 200),
            delay = rand(0, 20, true);
        $(el).css({
                    top        : rand(0, bubbleContainer.height(), true),
                    left       : rand(-($(window).width() - bubbleContainer.width()) / 2, bubbleContainer.width(), true),
                    borderColor: 'rgb(' + color + ')',
                    color      : 'rgb(' + color + ')',
                    fontSize   : fSize + 'px'
                  });
        var range = $(el).outerWidth() - (el.style.borderWidth * 2);
        $(el).css({
                    width               : range,
                    height              : range,
                    lineHeight          : range + 'px',
                    boxShadow           : '0 0 10px 0 rgba(' + color + ', 0.8),' +
                                          '0 0 ' + range + 'px' + ' 0 rgba(' + color + ', 0.9) inset,' +
                                          '0 0 ' + range * 0.3 + 'px' + ' 0 rgba(' + color + ', 0.5) inset',
                    webkitAnimation     : 'bubble 10s linear',
                    MozAnimation        : 'bubble 10s linear',
                    msAnimation         : 'bubble 10s linear',
                    OAnimation          : 'bubble 10s linear',
                    animation           : 'bubble 10s linear',
                    webkitAnimationDelay: delay + 's',
                    MozAnimationDelay   : delay + 's',
                    msAnimationDelay    : delay + 's',
                    OAnimationDelay     : delay + 's',
                    animationDelay      : delay + 's'
                  });
      };

  bubbles.each(function () {
    rising(this);
    $(this).on('webkitAnimationEnd MSAnimationEnd OAnimationEnd animationend', function () {
      $(this).css({
                    width          : '',
                    height         : '',
                    webkitAnimation: '',
                    MozAnimation   : '',
                    msAnimation    : '',
                    OAnimation     : '',
                    animation      : ''
                  });
      rising(this);
    });
  });

});