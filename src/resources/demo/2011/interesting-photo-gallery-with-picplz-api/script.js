jQuery(function ($) {

  // 設定
  var o = {
    perPage   : 24,     // 1回のロード毎の画像取得数
    thumbSize : '100s', // 56, 64, 75, 100, 200
    picSize   : '400r'  // 150, 320, 400, 640, 1024
  }

  // セレクタを変数に入れておく
  var $gallery       = $('#gallery'),
      $loader        = $('#loader').children('img'),
      $more          = $('#more').children('a');
      $viewLayer     = $('#view-layer'),
      $viewContainer = $('#view-container'),
      $viewContent   = $('#view-content'),
      $closeButton   = $viewContainer.children('a.close');

  var lastPicId,      // last_pic_id 用
      clickCount = 0; // ロードした回数の管理
      maxCount   = Math.ceil(240 / o.perPage) - 1; // ロードできる回数の最大値

  // サムネイルリスト用
  var $imageList = $('<ul/>').prependTo($gallery);

  // 画像を取得する
  function loadImages(last) {

    // パラメータ
    var ajaxData = {
      type          : 'interesting',
      pic_page_size : o.perPage,
      pic_formats   : o.thumbSize + ',' + o.picSize
    };

    // last_pic_id を持っていたら(2回目以降)パラメータに追加する
    if (last) {
      ajaxData.last_pic_id = last;
    }

    // API からデータを取得する
    $.ajax({
      url      : 'http://api.picplz.com/api/v2/feed.json',
      dataType : 'jsonp',
      data     : ajaxData,
      success  : function (data) {
                   getPics(data);
                 }
    });
  }

  // データ取得後
  function getPics(d) {

    // ローディング画像を表示
    $loader.show();

    // last_pic_id を変数に格納(上書きしていく)
    lastPicId = d.value.last_pic_id;

    var images = d.value.pics,  // 画像データの配列
        count  = 0,             // 画像の枚数管理
        limit  = images.length; // 画像の配列の要素数

    $.each(images, function (i, p) {

      // 各種データ
      var img = {
        pageUrl  : 'http://picplz.com' + p.url,
        thumbUrl : p.pic_files['100s'].img_url,
        largeUrl : p.pic_files['400r'].img_url,
        caption  : p.caption ? p.caption : '(Untitled)',
        date     : convertTime(p.date),
        count    : {
          pv       : p.view_count,
          like     : p.like_count,
          comment  : p.comment_count
        },
        creator  : {
          userName    : p.creator.username,
          displayName : p.creator.display_name,
          iconUrl     : p.creator.icon.url,
          following   : p.creator.following_count,
          follower    : p.creator.follower_count
        }
      }

      // 画像をロードする
      $('<img/>').load(function () {

        // カウントを1つ増やす
        ++count;

        // 画像のロードが終わったら li 要素を作る
        makeList($(this), img);

        // 最後の画像だったら、ロード完了後にリストを全て表示
        if(count === limit) {
          showThumbs();
        }
      }).attr({
        src   : img.thumbUrl,
        alt   : img.caption,
        title : img.caption
      });
    });
  }

  // 画像のロードが終わったら li 要素を作って $imageList に追加する
  function makeList(e, t) {

    // リンクを作る & イベント
    var $anchor = $('<a/>').attr('href', t.largeUrl)
                           .click(function (e) {
                             viewImage(e, t)
                           });

    // 上で作った img 要素をリンクに追加
    e.appendTo($anchor);

    // ul 要素に追加する li 要素(フェードイン用に一旦非表示に)
    $('<li/>').hide().append($anchor).appendTo($imageList);

  }

  // サムネイルを全て表示する
  function showThumbs() {

    // ローディング画像を非表示に
    $loader.fadeOut(100);

    // ロード回数が最大値になったら more を消す
    if(clickCount === maxCount) {
      $more.parent().fadeOut(function () {
        $(this).remove();
      });
    }

    // リストをフェードイン表示
    $imageList.children().fadeIn();
  }

  // サムネイルをクリックしたときの動作
  function viewImage(e, pic) {

    // リンク動作を無効にする
    e.preventDefault();

    // 前に表示したものを消す
    $viewContent.empty();

    // 書き出す HTML のテンプレート
    var markup = '<div class="image-box"><img src="${largeUrl}" /></div>'
               + '<div class="image-data">'
                 + '<h2 class="caption">${caption}</h2>'
                 + '<div class="date">${date}</div>'
                 + '<ul class="counter">'
                   + '<li class="pv">${count.pv}</li>'
                   + '<li class="like">${count.like}</li>'
                   + '<li class="comment">${count.comment}</li>'
                 + '</ul>'
                 + '<div class="creator">'
                   + '<a href="http://picplz.com/user/${creator.userName}" target="_blank" class="icon" style="background-image: url(${creator.iconUrl})"><img src="${creator.iconUrl}" /></a>'
                   + '<h3><a href="http://picplz.com/user/${creator.userName}" target="_blank">${creator.displayName}</a></h3>'
                   + '<ul class="follow">'
                     + '<li><a href="http://picplz.com/user/${creator.userName}/following/" target="_blank">${creator.following} following</a></li>'
                     + '<li><a href="http://picplz.com/user/${creator.userName}/followers/" target="_blank">${creator.follower} followers</a></li>'
                   + '</ul>'
                 + '</div>'
                 + '<div class="link"><a href="${pageUrl}" target="_blank">view on picplz</a></div>'
               + '</div>';

    // テンプレートに設定
    $.template("viewDetail", markup);

    // テンプレートとデータを結びつけて、$viewContent に追加する
    $.tmpl("viewDetail", pic).appendTo($viewContent);

    // レイヤーと画像詳細の div をフェードイン
    $viewLayer.fadeIn(600);
    $viewContainer.fadeIn(600);
  }

  // 閉じるボタンやレイヤーのブランク部分をクリックしたときの処理
  function closeView(e) {
    e.preventDefault();

    // レイヤーと画像詳細の div をフェードアウト
    $viewLayer.fadeOut(300);
    $viewContainer.fadeOut(300);
  }

  // Unix time を読めるように変換
  function convertTime(u) {

    // 数字が1桁の場合にゼロパディングする
    function paddingZero(n) {
      return n > 9 ? n : '0' + n;
    }

    var t = new Date(u * 1000);
    t.setTime(t.getTime() + (60 * 60 * 1000));

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // 整形
    var year  = t.getFullYear(),
        month = months[t.getMonth()],
        date  = paddingZero(t.getDate()),
        hour  = paddingZero(t.getHours()),
        min   = paddingZero(t.getMinutes()),
        sec   = paddingZero(t.getSeconds());

    var pubdate = month + ' ' + date + ', ' + year + ' ' + hour + ':' + min + ':' + sec;

    return pubdate;
  }

  // more をクリックしたときの動作
  $more.click(function (e) {
    e.preventDefault();

    // ロード回数を1つ増やす
    clickCount++;

    // last_pic_id を指定して再度取得
    loadImages(lastPicId);
  });

  // レイヤーと閉じるボタンのクリック動作
  $viewLayer.click(function (e) {
    closeView(e);
  });
  $closeButton.click(function (e){
    e.preventDefault();
    closeView(e);
  });

  // ページを開いた直後に行う取得処理
  loadImages();
});