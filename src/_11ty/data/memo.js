const fetch = require('node-fetch')
const dayjs = require('dayjs')
const md = require('markdown-it')({
  html: true,
  breaks: true,
})
require('dotenv').config()
require('dayjs/locale/ja')
dayjs.locale('ja')

async function getData (offset = 0) {
  const params = {
    offset,
    limit: 1,
    orders: '-publishedAt',
  }
  const urlParams = new URLSearchParams(params)
  const fetchOptions = {
    headers: {
      'X-API-KEY': process.env.API_KEY,
    },
  }
  const response = await fetch(`${process.env.API_URL}/memo?${urlParams}`, fetchOptions)
  return await response.json()
}

async function getAllData () {
  const initialData = await getData()
  const { contents, totalCount, limit } = initialData
  if (contents.length === totalCount) {
    return contents
  }
  const count = Math.ceil(totalCount / limit) - 1
  const arr = [...Array(count)].map((value, index) => index + 1)
  const data = await Promise.all(arr.map(async (value) => await getData(limit * value)))
  const sortedData = data.sort((a, b) => a.offset - b.offset)
  return sortedData.reduce((acc, current) => acc.concat(current.contents), contents)
}

async function memoData () {
  const data = await getAllData()
  const dataByDate = data.reduce((acc, current) => {
    const date = dayjs(current.publishedAt).format('YYYY-MM-DD')
    if (!acc[date]) {
      acc[date] = {
        contents: [],
        keywords: [],
      }
    }
    const metadata = {
      hash: encodeURI(current.title),
      title: current.title,
    }
    acc[date].keywords.push({ ...metadata })
    acc[date].contents.push({
      ...metadata,
      html: md.render(current.body)
    })
    const published = dayjs(current.publishedAt).valueOf()
    const updated = dayjs(current.updatedAt).valueOf()
    if(!acc[date].published) {
      acc[date].published = published
    } else {
      acc[date].published = Math.min(acc[date].published, published)
    }
    if(!acc[date].updated) {
      acc[date].updated = updated
    } else {
      acc[date].updated = Math.max(acc[date].updated, updated)
    }
    return acc
  }, {})
  return Object.keys(dataByDate).map(key => {
    const dateString = dayjs(key).format('YYYY年MM月DD日')
    return {
      ...dataByDate[key],
      date: key,
      title: `検索メモ：${dateString}`,
      description: `${dateString}に検索したことのメモです。`,
    }
  })
}

module.exports = memoData
