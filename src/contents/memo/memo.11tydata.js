module.exports = {
  tags: ['memoCollection'],
  permalink: '/memos/{{ dailyMemo.date }}/',
  pagination: {
    data: 'memo',
    size: 1,
    alias: 'dailyMemo',
    addAllPagesToCollections: true,
  },
  layout: 'memo.njk'
}
