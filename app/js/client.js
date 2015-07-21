//Create by Geoffrey Cheung 2015

var socket = io();
Encoder.EncodeType = "entity";


socket.on('reconnect', function() {
  $("#messages").empty();
});

//Receiving messages
socket.on('chat message', function(timestamp, name, msg, id, color) {
  var d = new Date(timestamp);
  var n = d.toString();
  $('#messages').append($('<div class="panel panel-default shadow-z-1">')
    .append($('<div class="panel-heading" >').text(n)).append($('<div class="panel-body">')
      .append('<strong>' + name + ' (ID. ' + id + '):</strong> ' + BBCode.parser(Encoder.htmlEncode(msg))).css('color', color)));
  $('#messages').append($('<p>'));
  //$("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight + $(window).height()}, 1000);
});

socket.on('get online user', function(count) {
  $('#onlineuser').text('Online user: ' + count);
});

socket.on('error', function(error_msg) {
      $('nav').append('<div class="alert alert-dismissable alert-danger"> < button type = "button"
        class = "close"
        data - dismiss = "alert" > × < /button> < strong > '+error_msg+' < /strong></div > ');
});
