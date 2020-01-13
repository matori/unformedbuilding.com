jQuery(function($) {

var $elm = $('#shuriken');

$elm.toggle(
        function() {
            $(this).addClass('set');
        },
        function() {
            $(this).removeClass('set').addClass('throw');
        },
        function() {
            if($(this).hasClass('return')) {
                $(this).hide().removeClass('throw return');
                $('#catched').show().delay(2000).fadeOut(function() {
                    $elm.fadeIn('fast');
                });
            }
            else {
                $(this).removeClass('throw');
            }
        })
    .bind('webkitAnimationStart', function() {
        setTimeout(function() {
            if($elm.hasClass('throw')) {
                $elm.addClass('return');
            }
        }, 1500);
    })
    .bind('webkitAnimationEnd', function() {
        $(this).hide().removeClass('throw return');
        $('#killed').show().delay(2000).fadeOut(function() {
            $elm.fadeIn('fast');
        });
    });

});
