jQuery(function ($) {

  var dummy = document.createElement('div'),
      checkStyle = function (el) {
        var r = el.currentStyle || document.defaultView.getComputedStyle(el, null);
        return r;
      },
      result;
  document.body.appendChild(dummy);
  result = checkStyle(dummy).filter || checkStyle(dummy).webkitFilter;
  document.body.removeChild(dummy);
  $('.gallery').find('a').each(function () {
    var imgUrl = $(this).find('img').attr('src');
    if (result === undefined) {
      $(this).find('img').attr('src', grayscale(imgUrl));
    }
    $(this).css('background-image', 'url(' + imgUrl + ')');
    console.log(result);
  });

  function grayscale(src) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var imgObj = new Image();
    imgObj.src = src;
    canvas.width = imgObj.width;
    canvas.height = imgObj.height;
    ctx.drawImage(imgObj, 0, 0);
    var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (var y = 0; y < imgPixels.height; y++) {
      for (var x = 0; x < imgPixels.width; x++) {
        var i = (y * 4) * imgPixels.width + x * 4;
        var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
        imgPixels.data[i] = avg;
        imgPixels.data[i + 1] = avg;
        imgPixels.data[i + 2] = avg;
      }
    }
    ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
  }
});
