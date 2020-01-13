jQuery(function ($) {

  var exclude, excheck;
  exclude = ['www.bing.com', 'www.yahoo.co.jp'];
  excheck = function (url) {
    for (var i = 0; i < exclude.length; i++) {
      if (url === exclude[i]) {
        return true;
      }
    }
    return false;
  };

  $('#target').find('a').each(function () {
    var tip = $(this).attr('title');
    if (!tip) {
      var url = $(this).attr('href');
      if(url.match(/^(https?|ftp)/)) {
        url = url.replace(/^(https?|ftp):\/\/([0-9a-zA-Z\.\-_]+\.[0-9a-z]+)\/?.*$/, '$2');
        if (!excheck(url)) {
          $(this).attr('title', url);
        }
      }
    }
  });

});