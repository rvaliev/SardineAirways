jQuery(document).ready(function ($) {

        setInterval(function () {
            moveRight();
        }, 3000);

    var slideCount = $('#prent ul li').length;
    var slideWidth = $('#prent ul li').width();
    var slideHeight = $('#prent ul li').height();
    var sliderUlWidth = slideCount * slideWidth;

    $('#slider').css({ width: slideWidth, height: slideHeight });

    $('#prent ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });

    $('#prent ul li:last-child').prependTo('#slider ul');

    function moveLeft() {
        $('#prent ul').animate({
            left: + slideWidth
        }, 200, function () {
            $('#prent ul li:last-child').prependTo('#slider ul');
            $('#prent ul').css('left', '');
        });
    }

    function moveRight() {
        $('#prent ul').animate({
            left: - slideWidth
        }, 200, function () {
            $('#prent ul li:first-child').appendTo('#prent ul');
            $('#prent ul').css('left', '');
        });
    }

    $('a.control_prev').click(function () {
        moveLeft();
    });

    $('a.control_next').click(function () {
        moveRight();
    });

});

