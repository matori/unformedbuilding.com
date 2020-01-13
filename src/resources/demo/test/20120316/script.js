function bgSVG() {

  // 設定
  var settings = {
    count     : 30, // 表示する泡の数
    minRadius : 20, // 泡の半径の最小値
    maxRadius : 150, // 泡の半径の最大値
    blurRadius: 10, // ぼかしの半径
    minRgb    : 150, // rgb 値の最小値
    maxRgb    : 255 // rgb 値の最大値
  };

  var createSvgElm = function (tagName) {
    return document.createElementNS('http://www.w3.org/2000/svg', tagName);
  },
      svg = createSvgElm('svg'),
      def = createSvgElm('defs'),
      filter = createSvgElm('filter'),
      blur = createSvgElm('feGaussianBlur'),
      wW = window.innerWidth,
      wH = window.innerHeight,
      rand = function (min, max, integer) {
        var num = Math.random() * (max - min);
        if (integer) {
          num = Math.floor(num);
        }
        return num + min;
      },
      rgb = function (min, max) {
        var channels = [];
        for (var i = 0; i < 3; i++) {
          channels.push(rand(min, max, true));
        }
        return 'rgb(' + channels.join(',') + ')';
      };

  svg.setAttribute('version', '1.1');
  svg.setAttribute('class', 'bg');

  filter.id = 'blur';
  blur.setAttribute('stdDeviation', settings.blurRadius);
  filter.appendChild(blur);
  def.appendChild(filter);
  svg.appendChild(def);

  for (var i = 0; i < settings.count; i++) {

    var babble = createSvgElm('g'),
        blurred = createSvgElm('circle'),
        filled = createSvgElm('circle'),
        posX = rand(0, wW),
        posY = rand(0, wH),
        radius = rand(settings.minRadius, settings.maxRadius),
        color = rgb(settings.minRgb, settings.maxRgb);

    babble.setAttribute('transform', 'translate(' + posX + ',' + posY + ')');

    blurred.setAttribute('r', radius);
    blurred.setAttribute('fill', color);
    blurred.setAttribute('stroke', color);
    blurred.setAttribute('filter', 'url(#blur)');
    blurred.setAttribute('class', 'blurred');

    filled.setAttribute('r', radius);
    filled.setAttribute('fill', color);
    filled.setAttribute('stroke', color);
    filled.setAttribute('class', 'filled');

    babble.appendChild(blurred);
    babble.appendChild(filled);

    svg.appendChild(babble)

  }

  document.getElementsByTagName('body')[0].appendChild(svg);
}

window.addEventListener('load', bgSVG, false);