function isHtml(outputPath) {
  return outputPath.endsWith('.html');
}

function isXml(outputPath) {
  return outputPath.endsWith('.xml');
}

module.exports = {
  isHtml,
  isXml,
};
