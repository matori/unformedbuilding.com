const {JSDOM} = require('jsdom');
const {PurgeCSS} = require('purgecss');
const posthtml = require('posthtml');
const doctype = require('posthtml-doctype');
const minifyClassnames = require('posthtml-minify-classnames');
const htmlMinifier = require('html-minifier');
const {isProd} = require('./mode');
const {isHtml, isXml} = require('./utils');

// jsdomを使うtransformはここでまとめて処理する
//
// - 記事内のtableをdivでラップする
// - imgにloading="lazy"を付与する
function articleMarkup(content, outputPath) {
  if (!isHtml(outputPath)) {
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
}

async function purgeCss(css, content, outputPath) {
  if (!isHtml(outputPath)) {
    return content;
  }

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
      deep: [
        /:(?:link|visited|focus(?:-visible)?|hover)/,
      ],
    },
  };
  const purgeCSSResult = await new PurgeCSS().purge(purgeCSSOptions);
  const cssText = purgeCSSResult[0].css.trim();
  content = content.replace(/\/\*\s*--CSS--\s*\*\//i, cssText);

  return content;
}

async function postHtml(content, outputPath) {
  if (!isHtml(outputPath)) {
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
  const result = await posthtml(plugins).process(content).then(result => result);
  return result.html;
}

function htmlmin(content, outputPath) {
  if (!isHtml(outputPath)) {
    return content;
  }
  const options = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    decodeEntities: true,
    minifyJS: true,
    quoteCharacter: `"`,
    removeAttributeQuotes: false,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
  };
  return htmlMinifier.minify(content, options);
}

function xmlmin(content, outputPath) {
  if (!isXml(outputPath)) {
    return content;
  }
  return content.replace(/>\s+?</g, '><');
}

module.exports = {
  articleMarkup,
  purgeCss,
  postHtml,
  htmlmin,
  xmlmin,
};
