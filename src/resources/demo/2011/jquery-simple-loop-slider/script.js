jQuery(function ($) {

var o = {
  speed   : 300,
  interval: 3000
};

var $slider     = $('#slider'),
    $container  = $slider.find('div.slider-container'),
    $contents   = $container.children(),
    $firstChild = $contents.filter(':first-child'),
    $lastChild  = $contents.filter(':last-child');

var size = {
  width : $container.width(),
  height: $container.height()
};

var count = {
  min    : 0,
  max    : $contents.length,
  current: 0
};

// fix $contaienr width
$container.css({
  width      : size.width * ($contents.length + 2),
  marginLeft : -size.width,
  paddingLeft: size.width
});

// autoslide
var play, start;

play = function () {
         start = setInterval(function () {
                     slide.next();
                 }, o.interval);
       };

// hover event (stop)
$contents.hover(
  function () {
    clearInterval(start);
  },
  function () {
    play();
  }
);

// pager event
$('#slide-prev').click(function (e) {
  fnc.pager('negative', e);
});

$('#slide-next').click(function (e) {
  fnc.pager('positive', e);
});

// create pagination
// pagination event
var $pagination = $('<div/>', {'class': 'slider-pagination'});
$contents.each(function (i) {
  $('<a/>', {'href': '#'})
    .text(i + 1)
    .appendTo($pagination)
    .click(function (e) {
      e.preventDefault();
      var indexNum = i;
      clearInterval(start);
      if(indexNum > count.current) {
        slide.next(indexNum);
      } else if(indexNum < count.current) {
        slide.prev(indexNum);
      }
      play();
    });
});
$pagination.appendTo($slider);
$pagination.find('a:first-child').addClass('current');

// slider
var distance;
var slide = {

  next: function (index) {
          fnc.range(index, 'positive');
          if(count.current < count.max - 1) {
            fnc.scroll(distance);
          } else {
            $firstChild.css('left', size.width * $contents.length);
            $container.stop(true, false)
                      .animate({left: -distance}, o.speed,
                        function () {
                          $firstChild.css('left', 0);
                          $container.css('left', 0);
                        }
                      );
            count.current = -1;
          }
          fnc.counter(index, 'increment');
          fnc.pageNav(count.current);
        },

  prev: function (index) {
          fnc.range(index, 'negative');
          if(count.current > count.min) {
            fnc.scroll(distance);
          } else {
            $lastChild.css('left', -(size.width * $contents.length));
            $container.stop(true, false)
                      .animate({left: -distance}, o.speed,
                        function () {
                          $lastChild.css('left', '');
                          $container.css('left', -(size.width * ($contents.length - 1)));
                        }
                      );
            count.current = count.max;
          }
          fnc.counter(index, 'decrement');
          fnc.pageNav(count.current);
        }

};

var fnc = {

  range  : function (n, d) {
             if(n >= 0) {
               distance = size.width * n;
             } else {
               var addNum;
               if(d === 'negative') addNum = -1;
               if(d === 'positive') addNum = +1;
               distance = size.width * (count.current + addNum);
             }
           },

  scroll : function (d) {
             $container.stop(true, false).animate({left: -d}, o.speed);
           },

  counter: function (n, c) {
             if(n >= 0) {
               count.current = n;
             } else {
               if(c === 'increment') count.current++;
               if(c === 'decrement') count.current--;
             }
           },

  pageNav: function (n) {
             $pagination.children('a').removeClass('current');
             $pagination.children('a:eq(' + n + ')').addClass('current');
           },

  pager  : function (d, e) {
               if(!$container.is(':animated')) {
                 clearInterval(start);
                 if(d === 'positive') slide.next();
                 if(d === 'negative') slide.prev();
                 play();
               }
               e.preventDefault();
           }

};

// auto start
play();

// for DEMO
$contents.find('a').click(function (e) {
  e.preventDefault();
});

});