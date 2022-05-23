$(function () {
  $('#question-preview-1').click(function (){
    window.location = "/app/thread.html";
  });

  $('#quote-question button').click(function () {
    $('#quote-question').slideUp('slow');
    $('#quote-answer').delay('slow').slideDown();
    $('#quote-points').delay(2300).fadeOut('slow');
  });
});
