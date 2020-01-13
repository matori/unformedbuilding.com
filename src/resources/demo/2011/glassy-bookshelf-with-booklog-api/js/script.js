jQuery(function($) {

var o = {
  account : 'pnr',
  count   : 16,
  category: '625920',
  status  : '',
  rank    : '',
  noImage : './img/no-image.jpg',
  imgWidth: 80,
  display : 4,
  duration: 1000,
  easing  : 'easeOutExpo'
};

var $shelf     = $('#bookshelf'),
    $container = $shelf.find('div.sls-container');

$.jsonp({
  url              : 'http://api.booklog.jp/json/' + o.account,
  data             : {
                       category: o.category,
                       count   : o.count,
                       status  : o.status,
                       rank    : o.rank
                     },
  callbackParameter: 'callback',
  pageCache        : true,
  success          : function (j) {
                       $shelf.booklog(j);
                       $shelf.simpleLoopSlider(o.duration, o.easing);
                     },
  error            : function () { $shelf.hide(); } 
});

$.fn.booklog = function (json) {

  var books = json.books;

  for(var i = 0; i < Math.ceil(o.count / o.display); i++) {

    var $ul = $('<ul/>');

    for(var k = 0; k < o.display; k++) {

      var book = books.shift();
      if($.isEmptyObject(book)) break;

      var imgPath = book.image
                    ? book.image.replace(/_SL75_/, '_SX' + o.imgWidth + '_')
                    : o.noImage;

      var $li   = $('<li/>'),
          $link = $('<a/>').attr('href', book.url),
          $img  = $('<img/>', {
                                src  : imgPath,
                                width: o.imgWidth,
                                alt  : book.title,
                                title: book.title + ' | ' + book.author
                              });
      $link.html($img).appendTo($li);
      $li.appendTo($ul);

    }

    $('<div/>').addClass('sls-content')
               .html($ul)
               .appendTo($container);

  };

};

$.fn.simpleLoopSlider = function (duration, easing) {

 this.each(function () {

    var $contents   = $container.children('div.sls-content'),
        $firstChild = $contents.filter(':first-child'),
        $lastChild  = $contents.filter(':last-child');

    var size = {
      width : $contents.width(),
      height: $contents.height()
    };

    var count = {
      min    : 0,
      max    : $contents.length,
      current: 0
    };

    $container.css({
      width      : size.width * ($contents.length + 2),
      marginLeft : -size.width,
      paddingLeft: size.width
    });

    $('<a/>').attr('href', '#')
             .addClass('sls-prev')
             .text('\u00AB')
             .appendTo($shelf)
             .click(function (e) {
               fnc.pager('negative', e);
             });

    $('<a/>').attr('href', '#')
             .addClass('sls-next')
             .text('\u00BB')
             .appendTo($shelf)
             .click(function (e) {
               fnc.pager('positive', e);
             });

    var $pagination = $('<div/>').addClass('sls-pagination');

    $contents.each(function (i) {
      $('<a/>').attr('href', '#')
               .appendTo($pagination)
               .click(function (e) {
                 e.preventDefault();
                 var indexNum = i;
                 if(indexNum > count.current) {
                   slide.next(indexNum);
                 } else if(indexNum < count.current) {
                   slide.prev(indexNum);
                 }
               });
    });

    $pagination.prependTo($shelf);
    $pagination.find('a:first-child').addClass('current');

    var distance;

    var slide = {

      next: function (index) {
              fnc.range(index, 'positive');
              if(count.current < count.max - 1) {
                fnc.scroll(distance);
              } else {
                $firstChild.css('left', size.width * $contents.length);
                $container.stop(true, false)
                          .animate({left: -distance}, o.duration, o.easing,
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
                          .animate({left: -distance}, o.duration, o.easing,
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

    }; // slide

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
                 $container.stop(true, false).animate({left: -d}, o.duration, o.easing);
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
                     if(d === 'positive') slide.next();
                     if(d === 'negative') slide.prev();
                   }
                   e.preventDefault();
               }

    }; // fnc

  });

  return this;

};

});