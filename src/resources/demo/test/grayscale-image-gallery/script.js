jQuery(function ($) {

  var dummy = document.createElement('div'),
      checkStyle = function (el) {
        return el.currentStyle || document.defaultView.getComputedStyle(el, null);
      },
      svgFlag = false,
      canvasFlag = false;
  document.body.appendChild(dummy);
  if (checkStyle(dummy).webkitTransition !== undefined) {
    canvasFlag = checkStyle(dummy).webkitFilter ? false : true;
  } else if (checkStyle(dummy).msTransition !== undefined) {
    svgFlag = true;
  } else if (checkStyle(dummy).OTransition !== undefined) {
    svgFlag = true;
  }
  document.body.removeChild(dummy);

  $('.gallery').find('a').each(function () {
    var img = $(this).find('img').eq(0),
        imgUrl = img.attr('src'),
        imgW = img.width(),
        imgH = img.height();
    if (svgFlag) {
        var svgImg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image xlink:href="' + imgUrl + '" width="' + imgW + '" height="' + imgH + '" /></svg>';
        img.replaceWith(svgImg);
    }
    if (canvasFlag) {
      img.load(function () {
        this.src = grayscale(this.src);
      });
    }
    $(this).css('background-image', 'url(' + imgUrl + ')');
  });

  /*!
   * Grayscale Image Hover
   * http://webdesignerwall.com/tutorials/html5-grayscale-image-hover
   */
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
