jQuery(function ($) {

  var $years      = $('.year-select').children(),
      $yearLists  = $years.children('li'),
      $selectYear = $yearLists.children('a'),
      $months     = $('.monthly-archives').children();

  var singleHeight = $yearLists.height(),
      totalHeight  = singleHeight * $yearLists.length;

  $yearLists.eq(0).addClass('active');

  $yearLists.filter(':gt(0)').hide();
  $months.filter(':gt(0)').hide();

  $years.css('height', singleHeight);
  $years.hover(
    function () {
      $yearLists.show();
      $(this).stop().animate({'height': totalHeight});
    },
    function () {
      $yearLists.filter(':not(.active)').hide();
      $(this).stop().animate({'height': singleHeight});
    }
  );

  $selectYear.click(function (e) {
    e.preventDefault();

    if($(this).parent().hasClass('active')) return;

    var target = $(this).parent().index();

    $yearLists.removeClass('active');
    $(this).parent().addClass('active');

    $months.filter(':not(:hidden)').fadeOut();
    $months.eq(target).fadeIn();
  });

});