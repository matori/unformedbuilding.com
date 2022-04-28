const {JSDOM} = require('jsdom');
const {isHtml} = require('./utils');

function validateDescription(content, inputPath, outputPath) {
  if (!isHtml(outputPath)) {
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
}

module.exports = {
  validateDescription,
};
