const dayjs = require('dayjs');

function ogImageUrl(siteUrl, isArticle, ogImage, pubDate, slug) {
  const baseFileName = 'og.png';
  if (!isArticle || !ogImage) {
    return `${siteUrl}/assets/images/${baseFileName}`;
  }
  const year = dayjs(pubDate).year();
  const fileName = typeof ogImage === 'string' ? ogImage : baseFileName;
  return `${siteUrl}/images/${year}/${slug}/${fileName}`;
}

module.exports = {
  ogImageUrl,
};
