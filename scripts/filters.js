const {JSDOM} = require('jsdom');
const {url: SITE_URL} = require('../src/metadata.json');
const htmlmin = require('html-minifier');
const dayjs = require('dayjs');

function convertRelativeURLToAbsoluteURLInFeed(htmlString) {
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
}

function htmlminInFeed(data) {
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
}

function limitIteration(array, limit) {
  const endPoint = Math.min(limit, array.length);
  if (endPoint > -1) {
    return array.slice(0, endPoint);
  }
  return array.splice(array.length + endPoint, array.length);
}

function formatDate(date, format) {
  if (format === 'iso') {
    return dayjs(date).format();
  }
  if (format === 'rfc2822') {
    return dayjs(date).toString();
  }
  return dayjs(date).format(format);
}

module.exports = {
  convertRelativeURLToAbsoluteURLInFeed,
  htmlminInFeed,
  limitIteration,
  formatDate,
};
