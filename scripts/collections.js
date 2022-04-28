const {SOURCE_DIR} = require('./constants')
const dayjs = require('dayjs');

function articles(collection) {
  const articles = collection.getFilteredByGlob(`${SOURCE_DIR}/articles/*/*.html`);
  return articles.sort((a, b) => a.data.published < b.data.published ? 1 : -1);
}

function articlesWebdev(collection) {
  const allArticles = collection.getFilteredByGlob(`${SOURCE_DIR}/articles/*/*.html`);
  const articles = allArticles.filter(article => {
    const category = article.data.category;
    return category === 'webdev' || category === 'information';
  });
  return articles.sort((a, b) => a.data.published < b.data.published ? 1 : -1);
}

function yearlyArchive(collection) {
  const articles = collection.getFilteredByGlob(`${SOURCE_DIR}/articles/*/*.html`);
  return articles.sort((a, b) => a.data.published < b.data.published ? 1 : -1).reduce((result, article) => {
    const year = dayjs(article.data.published).year();
    if (!result.find(obj => obj.year === year)) {
      result.push({
        year,
        articles: [],
      });
    }
    const archive = result[result.length - 1];
    archive.articles.push(article);
    return result;
  }, []);
}

function memoArchive(collection) {
  const memos = collection.getFilteredByTags('memoCollection');
  return memos.sort((a, b) => a.data.published < b.data.published ? 1 : -1).reduce((result, memo) => {
    const year = dayjs(memo.data.published).year();
    if (!result.find(obj => obj.year === year)) {
      result.push({
        year,
        memos: [],
      });
    }
    const archive = result[result.length - 1];
    archive.memos.push(memo);
    return result;
  }, []);
}


module.exports = {
  articles,
  articlesWebdev,
  yearlyArchive,
  memoArchive
}
