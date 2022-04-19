const dayjs = require('dayjs');
const htmlmin = require('html-minifier');
const {JSDOM} = require('jsdom');
const {PurgeCSS} = require('purgecss');
const posthtml = require('posthtml');
const minifyClassnames = require('posthtml-minify-classnames');
const doctype = require('posthtml-doctype');

const {SOURCE_DIR, DISTRIBUTION_DIR} = require('./scripts/dir')
const {isDev, isProd, isPreview} = require('./scripts/mode');
const SITE_URL = require('./src/metadata').url;

const compileSass = require('./scripts/compileSass');
const {
  articlesCollection,
  articlesWebdevCollection,
  yearlyArchiveCollection,
  memoArchiveCollection,
} = require('./scripts/collections')

const STYLES_DIR = `src/_11ty/styles`;
const STYLES_FIlE = `src/_11ty/styles/main.scss`;
const STYLES_FIlE_OUTPUT = `_build/assets/styles/main.css`;

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

  // og:imageのURLを取得するショートコード
  eleventyConfig.addShortcode('ogImageUrl', (siteUrl, isArticle, ogImage, pubDate, slug) => {
    const baseFileName = 'og.png';
    if (!isArticle || !ogImage) {
      return `${siteUrl}/assets/images/${baseFileName}`;
    }
    const year = dayjs(pubDate).year();
    const fileName = typeof ogImage === 'string' ? ogImage : baseFileName;
    return `${siteUrl}/images/${year}/${slug}/${fileName}`;
  });

  // フィードのコンテンツHTML内の相対URLを絶対URLに書き換える
  eleventyConfig.addFilter('feedAbsoluteUrl', htmlString => {
    const dom = new JSDOM(`${htmlString}`);
    const doc = dom.window.document;

    // href属性
    const hrefs = doc.querySelectorAll(`[href^="/"]`);
    Array.from(hrefs).forEach(element => {
      const originalHref = element.getAttribute('href');
      element.setAttribute('href', SITE_URL + originalHref);
    });

    // src属性
    const srcs = doc.querySelectorAll(`[src^="/"]`);
    Array.from(srcs).forEach(element => {
      const originalSrc = element.getAttribute('src');
      element.setAttribute('src', SITE_URL + originalSrc);
    });

    // srcset属性
    const srcsets = doc.querySelectorAll(`[srcset]`);
    Array.from(srcsets).forEach(element => {
      const originalSrcset = element.getAttribute('srcset');
      const srcsetValue = originalSrcset.split(',').map(srcset => {
        const image = srcset.trim().split(/\s+/);
        if (image[0].charAt(0) === '/') {
          image[0] = SITE_URL + image[0];
        }
        return image.join(' ');
      });
      element.setAttribute('srcset', srcsetValue.join(','));
    });

    return doc.body.innerHTML;
  });

  // フィードのHTMLをminifyする
  eleventyConfig.addFilter('feedHtmlmin', data => {
    return htmlmin.minify(data, {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      decodeEntities: true,
      quoteCharacter: `"`,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortAttributes: true,
      sortClassName: true,
    });
  });

  // 全記事コレクション
  eleventyConfig.addCollection('articles', articlesCollection);
  // ウェブ制作関連の記事コレクション
  eleventyConfig.addCollection('articlesWebdev', articlesWebdevCollection);
  // 年別アーカイブ用コレクション
  eleventyConfig.addCollection('yearlyArchive', yearlyArchiveCollection);
  // 検索メモの年別アーカイブ用コレクション
  eleventyConfig.addCollection('memoArchive', memoArchiveCollection);

  // 日付処理
  eleventyConfig.addFilter('readableDate', (date, format = 'YYYY年MM月DD日 HH:mm') => {
    return dayjs(date).format(format);
  });

  eleventyConfig.addFilter('isoDate', date => {
    return dayjs(date).format();
  });

  eleventyConfig.addFilter('rfc2822', date => {
    return dayjs(date).toString();
  });

  eleventyConfig.addFilter('limit', (array, limit) => {
    const endPoint = Math.min(limit, array.length);
    if (endPoint > -1) {
      return array.slice(0, endPoint);
    }
    return array.splice(array.length + endPoint, array.length);
  });

  // jsdomを使うtransformはここでまとめて処理する
  //
  // - 記事内のtableをdivでラップする
  // - imgにloading="lazy"を付与する
  eleventyConfig.addTransform('jsdom transform', (content, outputPath) => {
    if (!outputPath.endsWith('.html')) {
      return content;
    }

    const dom = new JSDOM(content);
    const doc = dom.window.document;

    // tableの処理
    const tableElements = doc.querySelectorAll('.Article-body table');
    if (tableElements.length) {
      Array.from(tableElements).forEach(table => {
        const div = doc.createElement('div');
        div.classList.add('tableWrapper');
        table.parentNode.insertBefore(div, table);
        div.appendChild(table);
      });
    }

    // imgの処理
    const imgElements = doc.querySelectorAll('img');
    if (imgElements.length) {
      Array.from(imgElements).forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    }

    return doc.documentElement.outerHTML;
  });

  // PurgeCSS
  if(isDev) {
    // devモードならpurgeCSSをかけずにそのまま出力
    eleventyConfig.addTransform('applycss', async (content, outputPath) => {
      if (!outputPath.endsWith('.html')) {
        return content;
      }
      content = content.replace(/\/\*\s*CSS\s* \*\//i, css)
      return content
    });
  } else {
    eleventyConfig.addTransform('purgecss', async (content, outputPath) => {
      if (!outputPath.endsWith('.html')) {
        return content;
      }
      // const dom = new JSDOM(content);
      // const doc = dom.window.document;

      const purgeCSSOptions = {
        content: [
          {
            raw: content,
            extension: 'html',
          },
        ],
        css: [
          {
            raw: css,
          },
        ],
        safelist: {
          // JSで処理するやつとか入れる
          deep: [
            /:(?:link|visited|focus(?:-visible)?|hover)/,
          ],
        },
      };
      const purgeCSSResult = await new PurgeCSS().purge(purgeCSSOptions)
      const cssText = purgeCSSResult[0].css.trim()
      content = content.replace(/\/\*\s*CSS\s* \*\//i, cssText)
      return content
      // styleElement.textContent = result[0].css.trim().replace(/^@charset "UTF-8";/i, '');

      // return doc.documentElement.outerHTML;
    });
  }

  // posthtml
  if (isProd || isPreview) {
    eleventyConfig.addTransform('posthtml', (content, outputPath) => {
      if (!outputPath.endsWith('.html')) {
        return content;
      }
      const plugins = [
        doctype({doctype: 'HTML 5'}),
      ];
      if (isProd) {
        plugins.push(
          minifyClassnames({
            genNameClass: 'genNameEmoji',
            genNameId: false,
          }),
        );
      }
      return posthtml(plugins).process(content, {sync: true}).html;
    });
  }

  // html-minifier
  if (isProd || isPreview) {
    eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
      if (!outputPath.endsWith('.html')) {
        return content;
      }
      return htmlmin.minify(content, {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        minifyJS: true,
        quoteCharacter: `"`,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
      });
    });
  }

  // xml minify
  if (isProd || isPreview) {
    eleventyConfig.addTransform('xmlmin', (content, outputPath) => {
      if (!outputPath.endsWith('.xml')) {
        return content;
      }
      return content.replace(/>\s+?</g, '><');
    });
  }

  if (isProd || isPreview) {
    eleventyConfig.addLinter('description validator', (content, inputPath, outputPath) => {
      if (!outputPath.endsWith('.html')) {
        return;
      }
      const dom = new JSDOM(content);
      const doc = dom.window.document;
      const description = doc.querySelector('meta[name="description"]');
      const text = description.getAttribute('content');
      const textLength = [...text].length;
      if (!textLength) {
        console.error(`meta descriptionが設定されていません: ${inputPath}`);
      }
      if (textLength > 120) {
        console.error(`meta descriptionの文字数が多すぎます: ${textLength}文字 : ${inputPath}`);
      }
      if (textLength > 80) {
        console.warn(`meta descriptionの文字数が多いかもしれません: ${textLength}文字 : ${inputPath}`);
      }
    });
  }

  // Sassを入れているディレクトリーも監視対象にする
  eleventyConfig.addWatchTarget(STYLES_DIR);
  eleventyConfig.addWatchTarget('src/metadata.json');

  // コピーするだけ
  eleventyConfig.addPassthroughCopy({'src/root': '/'});
  eleventyConfig.addPassthroughCopy({'src/resources': '/'});

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

