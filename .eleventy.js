const path = require('path')
const sass = require('sass')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const postcssGapProperties = require('postcss-gap-properties')
const CleanCSS = require('clean-css')
const { Base64 } = require('js-base64')
const utf8 = require('utf8')
const dayjs = require('dayjs')
const htmlmin = require('html-minifier')
const { JSDOM } = require('jsdom')
const Purgecss = require('purgecss')
const purgeHtml = require('purgecss-from-html')
const posthtml = require('posthtml')
const minifyClassnames = require('posthtml-minify-classnames')
const doctype = require('posthtml-doctype')

const isDev = process.env.ELEVENTY_ENV === 'development'
const isProd = process.env.ELEVENTY_ENV === 'production'
const isPreview = process.env.ELEVENTY_ENV === 'preview'

const SITE_URL = require('./src/metadata').url

const SOURCE_DIR = 'src/contents'
const DISTRIBUTION_DIR = '_build'
const STYLES_DIR = `src/_11ty/styles`

module.exports = eleventyConfig => {
  // YAML Frontmatterの区切りを変更
  // データはNumjucksまたはHTMLなので、<script type="application/x-yaml">として処理する
  // エディターのハイライトの関係でもあるが、HTMLとして不自然じゃないようにしておきたい
  eleventyConfig.setFrontMatterParsingOptions({
    delimiters: ['<script type="application/x-yaml">', '</script>'],
  })

  // sassフィルター
  eleventyConfig.addFilter('sass', sassFilePath => {
    const filePath = path.resolve(__dirname, STYLES_DIR, sassFilePath)
    const result = sass.renderSync({
      file: filePath,
      outputStyle: 'expanded',
      sourceMap: (isDev || isPreview) ? `${sassFilePath}.map` : false,
      sourceMapEmbed: true,
    })
    return `${result.css.toString()}`
  })

  // optimizecssフィルター
  // PostCSS + Clean CSS
  eleventyConfig.addFilter('optimizecss', data => {
    // PostCSS
    const plugins = [postcssGapProperties, autoprefixer]
    const postcssData = postcss(plugins).process(data, {
      map: {
        inline: false,
      },
    })

    // Clean CSS
    const cleanCss = new CleanCSS({
      level: 2,
      sourceMap: true,
      sourceMapInlineSources: true,
    })
    const minified = cleanCss.minify(postcssData.css, postcssData.map.toString())

    // 出力CSS
    const result = [minified.styles]

    // CSSとsourcemapをくっつけて返す
    if (isDev || isPreview) {
      const sourceMap = minified.sourceMap.toString()
      const encodedMap = utf8.encode(sourceMap)
      const base64EncodedMapData = Base64.encode(encodedMap)
      const sourcemapComment = '/*# sourceMappingURL=data:application/json;base64,' + base64EncodedMapData + ' */'
      result.push(sourcemapComment)
    }

    return result.join('\n')
  })

  // フィードのコンテンツHTML内の相対URLを絶対URLに書き換える
  eleventyConfig.addFilter('feedAbsoluteUrl', htmlString => {
    const dom = new JSDOM(`${htmlString}`)
    const doc = dom.window.document

    // href属性
    const hrefs = doc.querySelectorAll(`[href^="/"]`)
    Array.from(hrefs).forEach(element => {
      const originalHref = element.getAttribute('href')
      element.setAttribute('href', SITE_URL + originalHref)
    })

    // src属性
    const srcs = doc.querySelectorAll(`[src^="/"]`)
    Array.from(srcs).forEach(element => {
      const originalSrc = element.getAttribute('src')
      element.setAttribute('src', SITE_URL + originalSrc)
    })

    // srcset属性
    const srcsets = doc.querySelectorAll(`[srcset]`)
    Array.from(srcsets).forEach(element => {
      const originalSrcset = element.getAttribute('srcset')
      const srcsetValue = originalSrcset.split(',').map(srcset => {
        const image = srcset.trim().split(/\s+/)
        if (image[0].charAt(0) === '/') {
          image[0] = SITE_URL + image[0]
        }
        return image.join(' ')
      })
      element.setAttribute('srcset', srcsetValue.join(','))
    })

    return doc.body.innerHTML
  })

  // フィードのHTMLをminifyする
  eleventyConfig.addFilter('feed_htmlmin', data => {
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
    })
  })

  // 全記事コレクション
  eleventyConfig.addCollection('articles', collection => {
    const articles = collection.getFilteredByGlob(`${SOURCE_DIR}/articles/*/*.html`)
    return articles.sort((a, b) => a.data.published < b.data.published ? 1 : -1)
  })

  // ウェブ制作関連の記事コレクション
  eleventyConfig.addCollection('articlesWebdev', collection => {
    const allArticles = collection.getFilteredByGlob(`${SOURCE_DIR}/articles/*/*.html`)
    const articles = allArticles.filter(article => {
      const category = article.data.category
      return category === 'webdev' || category === 'information'
    })
    return articles.sort((a, b) => a.data.published < b.data.published ? 1 : -1)
  })

  // 年別アーカイブ用コレクション
  eleventyConfig.addCollection('yearlyArchive', collection => {
    const articles = collection.getFilteredByGlob(`${SOURCE_DIR}/articles/*/*.html`)
    return articles.sort((a, b) => a.data.published < b.data.published ? 1 : -1).reduce((result, article) => {
      const year = dayjs(article.data.published).year()
      if (!result.find(obj => obj.year === year)) {
        result.push({
          year,
          articles: [],
        })
      }
      const archive = result[result.length - 1]
      archive.articles.push(article)
      return result
    }, [])
  })

  // 日付処理
  eleventyConfig.addFilter('readableDate', (date, format = 'YYYY年MM月DD日 HH:mm') => {
    return dayjs(date).format(format)
  })

  eleventyConfig.addFilter('isoDate', date => {
    return dayjs(date).format()
  })

  eleventyConfig.addFilter('rfc2822', date => {
    return dayjs(date).toString()
  })

  eleventyConfig.addFilter('limit', (array, limit) => {
    const endPoint = Math.min(limit, array.length)
    if (endPoint > -1) {
      return array.slice(0, endPoint)
    }
    return array.splice(array.length + endPoint, array.length)
  })

  // Purgecss
  if (isProd || isPreview) {
    eleventyConfig.addTransform('purgecss', (content, outputPath) => {
      if (!outputPath.endsWith('.html')) {
        return content
      }
      const dom = new JSDOM(content)
      const doc = dom.window.document
      const styleElement = doc.querySelector('style')
      const styleText = styleElement.textContent

      const purgecss = new Purgecss({
        content: [{
          raw: doc.documentElement.outerHTML,
          extension: 'html'
        }],
        css: [{
          raw: styleText
        }],
        extractors: [
          {
            extractor: purgeHtml,
            extensions: ['html']
          }
        ]
      })
      const purgecssResult = purgecss.purge()
      styleElement.textContent = purgecssResult[0].css.trim().replace(/^@charset "UTF-8";/i, '')

      return doc.documentElement.outerHTML
    })
  }

  // jsdomを使うtransformはここでまとめて処理する
  //
  // - 記事内のtableをdivでラップする
  // - imgにloading="lazy"を付与する
  eleventyConfig.addTransform('jsdom transform', (content, outputPath) => {
    if (!outputPath.endsWith('.html')) {
      return content
    }

    const dom = new JSDOM(content)
    const doc = dom.window.document

    // tableの処理
    const tableElements = doc.querySelectorAll('.Article-body table')
    if (tableElements.length) {
      Array.from(tableElements).forEach(table => {
        const div = doc.createElement('div')
        div.classList.add('tableWrapper')
        table.parentNode.insertBefore(div, table)
        div.appendChild(table)
      })
    }

    // imgの処理
    const imgElements = doc.querySelectorAll('img')
    if (imgElements.length) {
      Array.from(imgElements).forEach(img => {
        img.setAttribute('loading', 'lazy')
      })
    }

    return doc.documentElement.outerHTML
  })

  // posthtml
  if (isProd || isPreview) {
    eleventyConfig.addTransform('posthtml', (content, outputPath) => {
      if (!outputPath.endsWith('.html')) {
        return content
      }
      const plugins = [
        doctype({ doctype: 'HTML 5' }),
      ]
      if (isProd) {
        plugins.push(
          minifyClassnames({
            genNameClass: 'genNameEmoji',
            genNameId: false,
          }),
        )
      }
      return posthtml(plugins)
        .process(content, { sync: true })
        .html
    })
  }

  // html-minifier
  if (isProd || isPreview) {
    eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
      if (!outputPath.endsWith('.html')) {
        return content
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
      })
    })
  }

  // xml minify
  if (isProd || isPreview) {
    eleventyConfig.addTransform('xmlmin', (content, outputPath) => {
      if (!outputPath.endsWith('.xml')) {
        return content
      }
      return content.replace(/>\s+?</g, '><')
    })
  }

  if (isProd || isPreview) {
    eleventyConfig.addLinter('description validator', (content, inputPath, outputPath) => {
      if (!outputPath.endsWith('.html')) {
        return
      }
      const dom = new JSDOM(content)
      const doc = dom.window.document
      const description = doc.querySelector('meta[name="description"]')
      const text = description.getAttribute('content')
      const textLength = [...text].length
      if (!textLength) {
        console.error(`meta descriptionが設定されていません: ${inputPath}`)
      }
      if (textLength > 120) {
        console.error(`meta descriptionの文字数が多すぎます: ${textLength}文字 : ${inputPath}`)
      }
      if (textLength > 80) {
        console.warn(`meta descriptionの文字数が多いかもしれません: ${textLength}文字 : ${inputPath}`)
      }
    })
  }

  // Sassを入れているディレクトリーも監視対象にする
  eleventyConfig.addWatchTarget(STYLES_DIR)
  eleventyConfig.addWatchTarget('src/metadata.json')

  // コピーするだけ
  eleventyConfig.addPassthroughCopy({ 'src/root': '/' })
  eleventyConfig.addPassthroughCopy({ 'src/resources': '/' })

  eleventyConfig.setBrowserSyncConfig({
    port: 8000,
    ui: false,
  })

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
  }
}
