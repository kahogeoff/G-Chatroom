//Create by Geoffrey Cheung 2015

var socket = io();
Encoder.EncodeType = "entity";

//Receiving messages
socket.on('chat message', function (timestamp, name, msg, id, color) {
  var d = new Date(timestamp);
  var n = d.toString();
  $('#messages').append($('<ul>')).
  append($('<li>').text(n)).
  append($('<li>').append('<strong>'+name + ' (ID. ' + id + '):</strong> ' + BBCode.parser(Encoder.htmlEncode(msg))).css('color', color));
  $('#messages').append($('<p>'));
  $("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight + $(window).height()}, 1000);
});

socket.on('get online user',function (count){
  $('#onlineuser').text('Online user: '+count);
});
