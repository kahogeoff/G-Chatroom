//Create by Geoffrey Cheung 2015

var color = 'black';
var height = 0;

//Initialize
$(document).ready(function () {
  $.material.init();
  height = $(".navbar").height();
  $("body").css("padding-top",$(".navbar").height());
  $("#messages_area").height($(window).height() - $('#input_area').height() - height);
  $("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight + $(window).height()}, 1000);
});

//Send a message
$('form').submit(function () {
  socket.emit('chat message', $('#n').val(), $('#m').val(), color);
  $('#m').val('');
  $("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight}, 1000);
  return false;
});

//Choose the text color
$('#c li').on('click', function () {
  $('#colorMenu').text($(this).text()).css('color', $(this).attr('value'));
  color = $(this).attr('value');
});

//Clear the messages area
$('#clear').on('click', function () {
  $("#messages").empty();
});

//Show or hide the input area
$('#hide').on('click', function () {

  $("#input_area").slideToggle("slow", function(){
    if ($('#hide').text() === 'Hide') {
      $('#hide').text('Show');
      $("#messages_area").height($(window).height()-height);
      $("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight + height}, 1000);

    } else if ($('#hide').text() === 'Show') {
      $('#hide').text('Hide');
      $("#messages_area").height($(window).height() - $('#input_area').height() - height);
      $("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight + $(window).height()}, 1000);
    }
  });
});

//On window resize
$(window).on('resize', function(){
  if ($('#hide').text() === 'Show') {
    $("#messages_area").height($(window).height()-height);
  } else if ($('#hide').text() === 'Hide') {
    $("#messages_area").height($(window).height() - $('#input_area').height() - height);
  }
});

//When display image button clicked
$('#messages').on('click', ".show-image-btn" , function () {
  $(this).parents('div.chat-image-area').children('div').find(".chat-image").toggle();
  if($(this).text() === 'Show image')
  {
    $(this).text('Hide image');
  }else{
    $(this).text('Show image');
  }
});

$('.nav a').on('click',function() {
    if($(this).attr('class') == 'nav-opt')
    {
      $(".navbar-toggle").click();
    }
});
