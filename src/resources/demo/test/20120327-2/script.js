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
    var tip = $(this).attr('title'),
        url = $(this).attr('href');
    tip = tip ? tip + '\u000A' : '';
    if (url.match(/^(https?|ftp):\/\/([0-9a-zA-Z\.\-_]+\.[0-9a-z]+)\/?.*$/)) {
      url = url.replace(/^(https?|ftp):\/\/([0-9a-zA-Z\.\-_]+\.[0-9a-z]+)\/?.*$/, '$2');
      if (!excheck(url)) {
        tip = tip + url;
        $(this).attr('title', tip);
      }
    }
  });

});