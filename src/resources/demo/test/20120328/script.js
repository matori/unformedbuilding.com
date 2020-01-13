jQuery(function ($) {

  var msg = 'お帰りなさい！<br>きっと戻ってくると信じてました！';

  // http://davidwalsh.name/page-visibility
  var hidden, state, visibilityChange;
  if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
    state = "visibilityState";
  } else if (typeof document.mozHidden !== "undefined") {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
    state = "mozVisibilityState";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
    state = "msVisibilityState";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
    state = "webkitVisibilityState";
  }

  $(document).on(visibilityChange, function () {
    if (document[state] === 'hidden') {
      var msgBox = $('<div/>').addClass('wb-message').attr('id', 'welcomeBack');
      msgBox.html('<p>' + msg + '</p>');
      msgBox.appendTo('body');
      msgBox.show();
    } else {
      $('#welcomeBack').delay(2000).fadeOut(500, function () {
        $(this).remove();
      });
    }
  });

});