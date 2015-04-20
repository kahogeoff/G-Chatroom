

# G-Chatroom

A simple anonymous chatroom written in Javascript, using Node.js with MongoDB.

![Srceen Shot](http://i.imgur.com/z763Abx.png)

You can see the lastest demo in [here](http://gchatroom.cleverapps.io/)

or the stable demo in [here](http://gchatroom-geoff4321.rhcloud.com/)

Create by Geoffrey Cheung 2015

## Usage

This chatroom application HAS NO SECURITY OPTION TO PROTECT YET.

So don't use it if you care about security.

## Developing

2015-4-16: Version alpha-1 released.
* Support 2 BBCode tags, [url][/url] and [img][/img]
* Add 3rd party HTML entity encoder from [Here](http://www.strictly-software.com/htmlencode)
* Improved the UI
* Other bugs fix

2015-4-14: Version alpha-0 released.

###Known Bug
1. ID system is not working when you run this on hosting service (e.g. CleverCloud)

### Planning Feature
1. Change the UI to [Material design](http://www.google.com/design/spec/material-design/introduction.html)
2. Move some variable to a config file
3. <del>Move the custom CSS to a CSS file</del> Done
4. Improve the UI
5. <del>Add form validation</del> Done
6. <del>Add BBCode support</del> Support more BBCode
7. Add error messages reminder
8. Allow to read the previous messages (Now only last 10 messages when user login)
9. Administration system and tools (e.g. Domain blocking, text filter, password protect, message delete, etc.)

### Libraries

##License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

Read more on LICENSE.md
