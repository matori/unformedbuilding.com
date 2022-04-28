const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postcssGapProperties = require('postcss-gap-properties');
const CleanCSS = require('clean-css');
const utf8 = require('utf8');
const {Base64} = require('js-base64');

const {isDev, isPreview} = require('./mode.js');

const processor = postcss([
  postcssGapProperties,
  autoprefixer({
    grid: 'autoplace',
  }),
]);

module.exports = function compileSass(input, output) {
  // sassの処理
  const sassResult = sass.compile(input, {
    style: 'compressed',
    sourceMap: true,
    sourceMapIncludeSources: true,
  });
  const css = sassResult.css.toString();
  const map = JSON.stringify(sassResult.sourceMap);

  // postcssの処理
  const postcssData = processor.process(css, {
    to: output,
    map: {
      prev: map,
      inline: false,
    },
  });

  // Clean CSS
  const cleanCss = new CleanCSS({
    level: 2,
    sourceMap: true,
    sourceMapInlineSources: true,
  });
  const minified = cleanCss.minify(postcssData.css, postcssData.map.toString());

  // 出力CSS
  const result = [minified.styles];

  // CSSとsourcemapをくっつけて返す
  if (isDev || isPreview) {
    const sourceMap = minified.sourceMap.toString();
    const encodedMap = utf8.encode(sourceMap);
    const base64EncodedMapData = Base64.encode(encodedMap);
    const sourcemapComment = '/*# sourceMappingURL=data:application/json;base64,' + base64EncodedMapData + ' */';
    result.push(sourcemapComment);
  }

  return result.join('\n');
};

