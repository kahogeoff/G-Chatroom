//Create by Geoffrey Cheung 2015

BBCode = {
    parser: function (str) {

    // The array of regex patterns to look for
    format_search =  [
        /\[url\](.*?)\[\/url\]/ig,
        /\[img\](.*?)\[\/img\]/ig,
        /\[u\](.*?)\[\/u\]/ig
    ];

    // The matching array of strings to replace matches with
    format_replace = [
        '<a href="$1" target="_blank">$1</a>',
        '<div class="chat-image-area"><button class="btn btn-default show-image-btn shadow-z-1">Show image</button> <div class="row"><div class="chat-image col-xs-6 col-md-3"><a href="$1" target="_blank" class="thumbnail"><img src="$1"/></a></div></div></div>',
        '<span style="text-decoration: underline;">$1</span>'
    ];

    // Perform the actual conversion
    for (var i =0;i<format_search.length;i++) {
      str = str.replace(format_search[i], format_replace[i]);
    }

    return str;
  }
}
