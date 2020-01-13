jQuery(function ($) {

  var inputText = document.getElementById('input-text'),
      outputText = document.getElementById('output-text'),
      preset = document.getElementById('preset');

  function convert(str) {
    var chars = str.split(''),
        escapedText = '';
    for (var i = 0; i < chars.length; i++) {
      var char = '\\' + str[i].charCodeAt().toString(16);
      escapedText += char;
    }
    escapedText = escapedText.replace(/\\d\\a/gmi, '\\a');
    outputText.value = escapedText;
  }

  $(inputText).bind('keyup change', function () {
    var text = convert(this.value);
  });

  $(window).load(function () {
    inputText.value = '';
    outputText.value = '';
  });

  $(outputText).focus(function () {
    this.select();
  });

  $('li', preset).click(function (e) {
    inputText.value += this.textContent;
    convert(inputText.value);

  });

});