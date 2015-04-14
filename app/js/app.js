//Create by Geoffrey Cheung 2015

var socket = io();
var color = 'black';

//$(".header").height($("#floating_area").height());

//Initialize
$(document).ready(function () {
  $("#messages_area").height($(window).height() - $('#input_area').height() - 16 - 50 -8);
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
  $("#input_area").toggle();
  $(".footer").toggle();
  if ($('#hide').text() === 'Hide') {
    $('#hide').text('Show');
    $("#messages_area").height($(window).height()-50);
    $("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight + $(window).height()}, 1000);

  } else if ($('#hide').text() === 'Show') {
    $('#hide').text('Hide');
    $("#messages_area").height($(window).height() - $('#input_area').height() - 16 - 50 - 8);
    $("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight + $(window).height()}, 1000);
  } 
});

//Receiving messages
socket.on('chat message', function (timestamp, name, msg, id, color) {
  var d = new Date(timestamp);
  var n = d.toString();
  $('#messages').append($('<li>').text(n));
  if (msg.indexOf("http://") === 0 || msg.indexOf("https://") === 0){
    $('#messages').append($('<li>').append(name + ' (ID. ' + id + '): ').append('<a href="'+msg+'" target="_blank">'+msg+'</a>').css('color', color));
  }else{
  $('#messages').append($('<li>').append(name + ' (ID. ' + id + '): ' + msg).css('color', color));
  }
  $('#message').append($('<p>'));  
  $("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight + $(window).height()}, 1000);
});

socket.on('get online user',function (count){
  $('#onlineuser').text('Online user: '+count); 
});
