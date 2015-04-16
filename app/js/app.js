//Create by Geoffrey Cheung 2015

var color = 'black';

//$(".header").height($("#floating_area").height());

//Initialize
$(document).ready(function () {
  //$.material.init();
  $("#messages_area").height($(window).height() - $('#input_area').height() - 50);
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
      $("#messages_area").height($(window).height()-50);
      $("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight + $(window).height()}, 1000);

    } else if ($('#hide').text() === 'Show') {
      $('#hide').text('Hide');
      $("#messages_area").height($(window).height() - $('#input_area').height() - 50);
      $("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight + $(window).height()}, 1000);
    }
  });
});


$(window).on('resize', function(){
  $("#messages_area").height($(window).height() - $('#input_area').height() - 50);
});


$('#messages').on('click', ".show-image-btn" , function () {
  $(this).closest('div').find(".chat-image").toggle();
  if($(this).text() === 'Show image')
  {
    $(this).text('Hide image');
  }else{
    $(this).text('Show image');
  }
});
