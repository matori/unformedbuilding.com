jQuery(function ($) {

  var ajaxData = {
    type         : 'interesting',
    pic_page_size: 50,
    pic_formats  : '100s,1024r'
  };

  $.ajax({
    url     : 'http://api.picplz.com/api/v2/feed.json',
    dataType: 'jsonp',
    data    : ajaxData,
    success : function (obj) {

      if (obj.result !== 'ok') {
        return;
      }

      var images = obj.value.pics,
          container = $('#gallery'),
          ul = $('<ul/>').hide();

      $.each(images, function (i, v) {

        $('<img/>')
            .attr('src', v.pic_files['100s'].img_url)
            .load(function () {
              var link = $('<a/>').attr('href', v.pic_files['1024r'].img_url).addClass('sslightbox');
              $(this).appendTo(link);
              $('<li/>').append(link).appendTo(ul);

              if (i + 1 === ajaxData.pic_page_size) {
                container.children('.loading-message').fadeOut(500, function () {
                  $(this).remove();
                  ul.appendTo(container).fadeIn(500);
                });
              }
            });

      });
    }
  });


  /**
   *  SuperSimpleLightbox
   */
  var ssContainer = $('<div/>').addClass('ss-container').appendTo('body').hide(),
      ssLoading = $('<div/>').addClass('ss-loading').appendTo(ssContainer).text('Loading...');
  ssContainer.on('click', function () {
    $(this).fadeOut(200, function () {
      $(this).find('img.ss-image').remove();
      ssLoading.show();
    });
  });

  $('#gallery').on('click', 'a.sslightbox', function (e) {
    e.preventDefault();
    ssContainer.fadeIn(200);

    var targetUrl = $(this).attr('href');
    $('<img/>')
        .attr('src', targetUrl)
        .addClass('ss-image')
        .load(function () {
          ssLoading.fadeOut(200);
          $(this).appendTo(ssContainer);
        });

  });
});