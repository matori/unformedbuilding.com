const {isProd, isPreview} = require('./scripts/mode');
const compileSass = require('./scripts/compileSass');
const constants = require('./scripts/constants');
const shortcodes = require('./scripts/shortcodes');
const collections = require('./scripts/collections');
const filters = require('./scripts/filters');
const transforms = require('./scripts/transforms');
const linters = require('./scripts/linters');

const {
  SOURCE_DIR,
  DISTRIBUTION_DIR,
  STYLES_DIR,
  STYLES_FIlE,
  STYLES_FIlE_OUTPUT,
  DATE_FORMAT_FULL,
} = constants;

module.exports = eleventyConfig => {
  // YAML Frontmatterの区切りを変更
  // データはNumjucksまたはHTMLなので、<script type="application/x-yaml">として処理する
  // エディターのハイライトの関係でもあるが、HTMLとして不自然じゃないようにしておきたい
  eleventyConfig.setFrontMatterParsingOptions({
    delimiters: ['<script type="application/x-yaml">', '</script>'],
  });

  // Sassを処理しておく
  let css = compileSass(STYLES_FIlE, STYLES_FIlE_OUTPUT);

  // watchのタイミングでSassを処理して更新する
  eleventyConfig.on('beforeWatch', () => {
    css = compileSass(STYLES_FIlE, STYLES_FIlE_OUTPUT);
  });

  // Sassを入れているディレクトリーも監視対象にする
  eleventyConfig.addWatchTarget(STYLES_DIR);
  eleventyConfig.addWatchTarget('src/metadata.json');

  // コピーするだけ
  eleventyConfig.addPassthroughCopy({'src/root': '/'});
  eleventyConfig.addPassthroughCopy({'src/resources': '/'});

  //------------//
  // Shortcodes //
  //------------//

  const {ogImageUrl} = shortcodes;

  // og:imageのURLを取得するショートコード
  eleventyConfig.addShortcode('ogImageUrl', ogImageUrl);

  //-------------//
  // Collections //
  //-------------//

  const {articles, articlesWebdev, yearlyArchive, memoArchive} = collections;

  // 全記事コレクション
  eleventyConfig.addCollection('articles', articles);
  // ウェブ制作関連の記事コレクション
  eleventyConfig.addCollection('articlesWebdev', articlesWebdev);
  // 年別アーカイブ用コレクション
  eleventyConfig.addCollection('yearlyArchive', yearlyArchive);
  // 検索メモの年別アーカイブ用コレクション
  eleventyConfig.addCollection('memoArchive', memoArchive);

  //---------//
  // Filters //
  //---------//

  const {convertRelativeURLToAbsoluteURLInFeed, htmlminInFeed, limitIteration, formatDate} = filters;

  // フィードのコンテンツHTML内の相対URLを絶対URLに書き換える
  eleventyConfig.addFilter('feedAbsoluteUrl', convertRelativeURLToAbsoluteURLInFeed);
  // フィードのHTMLをminifyする
  eleventyConfig.addFilter('feedHtmlmin', htmlminInFeed);
  // ループ処理の回数を制限する
  eleventyConfig.addFilter('limit', limitIteration);

  // 日付処理
  eleventyConfig.addFilter('readableDate', (date, format = DATE_FORMAT_FULL) => formatDate(date, format));
  eleventyConfig.addFilter('isoDate', date => formatDate(date, 'iso'));
  eleventyConfig.addFilter('rfc2822', date => formatDate(date, 'rfc2822'));

  //------------//
  // Transforms //
  //------------//

  const {articleMarkup, purgeCss, postHtml, htmlmin, xmlmin} = transforms;

  // jsdomを使うtransform
  eleventyConfig.addTransform('jsdom transform', articleMarkup);
  // PurgeCSS
  eleventyConfig.addTransform('purgeCss', purgeCss.bind(null, css));

  if (isProd || isPreview) {
    // posthtml
    eleventyConfig.addTransform('posthtml', postHtml);
    // html-minifier
    eleventyConfig.addTransform('htmlmin', htmlmin);
    // xml minify
    eleventyConfig.addTransform('xmlmin', xmlmin);
  }

  //---------//
  // Linters //
  //---------//

  const {validateDescription} = linters;

  if (isProd || isPreview) {
    eleventyConfig.addLinter('validate description', validateDescription);
  }

  eleventyConfig.setBrowserSyncConfig({
    port: 8000,
    ui: false,
  });

  return {
    dir: {
      input: SOURCE_DIR,
      output: DISTRIBUTION_DIR,
      includes: '../_11ty/includes',
      layouts: '../_11ty/layouts',
      data: '../_11ty/data',
    },
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};

