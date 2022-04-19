exports.isDev = process.env.ELEVENTY_ENV === 'development'
exports.isProd = process.env.ELEVENTY_ENV === 'production'
exports.isPreview = process.env.ELEVENTY_ENV === 'preview'
