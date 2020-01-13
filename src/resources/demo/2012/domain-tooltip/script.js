jQuery(function ($) {

  var exclude, excheck, domaincheck;

  // 除外設定
  exclude = ['www.bing.com', 'www.yahoo.co.jp'];
  // 除外判定
  excheck = function (domain) {
    // 除外ドメインに *マッチしない* 場合 -1 を返す
    return $.inArray(domain, exclude);
  };
  // ドメインを抜き出すのに使う正規表現
  domaincheck = /^https?:\/\/([0-9a-zA-Z\.\-_]+\.[0-9a-z]+)\/?.*$/;

  // 指定セレクタ内の href 属性を持つ a 要素
  $('#target').find('a[href]').each(function () {

    var defaulttip, url, tip, urlmatch;

    // title 属性に入っている文字列
    defaulttip = $(this).attr('title');
    // href 属性に入っている文字列 (リンク先 URL)
    url = $(this).attr('href');
    // title 属性に何か書かれていたら、その直後に改行を追加する
    tip = defaulttip ? defaulttip + '\u000A' : '';
    // リンク先 URL からドメイン部分を前に指定した正規表現でチェック
    // マッチしたら配列に、しなければ null になる
    urlmatch = url.match(domaincheck);

    // URL がドメインチェックでマッチしている場合
    if (urlmatch) {
      // ドメイン名
      var domain = urlmatch[1];
      // ドメイン名を除外判定する
      // 除外判定されなかったら -1 が返ってくる
      if (excheck(domain) < 0) {
        // ドメイン名を [] で囲って、前に作った tip に追加
        tip = tip + '[' + domain + ']';
        // title 属性に入れる
        $(this).attr('title', tip);
      }
    }

  });

});