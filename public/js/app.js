'use strict';

$(document).on('click', '.button', function () {
  let clickedBtnIndex = $(this).data('index');
  $('.hide-show').eq(clickedBtnIndex).toggle();
});



