//Create by Geoffrey Cheung 2015

var socket = io();
Encoder.EncodeType = "entity";

//Receiving messages
socket.on('chat message', function (timestamp, name, msg, id, color) {
  var d = new Date(timestamp);
  var n = d.toString();
  $('#messages').append($('<ul>')).
  append($('<li>').text(n)).
  append($('<li>').append('<strong>'+name + ' (ID. ' + id + '):</strong> ' + bbcode_parser(Encoder.htmlEncode(msg))).css('color', color));
  $('#messages').append($('<p>'));
  $("#messages_area").animate({ scrollTop: $("#messages_area")[0].scrollHeight + $(window).height()}, 1000);
});

socket.on('get online user',function (count){
  $('#onlineuser').text('Online user: '+count);
});


//BBCode Parser
function bbcode_parser(str) {

  // The array of regex patterns to look for
  format_search =  [
      /\[url\](.*?)\[\/url\]/ig,
      /\[img\](.*?)\[\/img\]/ig,
      /\[u\](.*?)\[\/u\]/ig
  ];

  // The matching array of strings to replace matches with
  format_replace = [
      '<a href="$1" target="_blank">$1</a>',
      '<div><button class="btn btn-default show-image-btn">Show image</button> <div class="row"><div class="chat-image col-xs-6 col-md-3"><a href="$1" target="_blank" class="thumbnail"><img src="$1"/></a></div></div></div>',
      '<span style="text-decoration: underline;">$1</span>'
  ];

  // Perform the actual conversion
  for (var i =0;i<format_search.length;i++) {
    str = str.replace(format_search[i], format_replace[i]);
  }

  return str;
}
