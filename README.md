

# G-Chatroom

A simple anonymous chatroom written in Javascript, using Node.js with MongoDB.

![Srceen Shot](http://i.imgur.com/z763Abx.png)

You can see the lastest demo in [here](http://gchatroom.cleverapps.io/)

or the stable demo in [here](http://gchatroom-geoff4321.rhcloud.com/)

Create by Geoffrey Cheung 2015

## Usage

This chatroom application HAS NO SECURITY OPTION TO PROTECT YET.

So don't use it if you care about security.

#### How to setup 

Since I haven't write any automatic DB creation script, you must set up your DB by yourself.

    1. Create a MongoDB collection call 'chatroom' in your target database
    2. Put all files of this application in your target file
    3. Config the server by editing the 'server_config.js' under the 'config' folder
    4. Start this application by entering 'node server.js' at the root of this
    5. Done

Note that you don't need to process Step 4, if you are using hosting server (e.g. OpenShift, CleverCloud, etc.)

##### Message TTL option

You can set Message TTL by creating a [TTL index](http://docs.mongodb.org/manual/tutorial/expire-data/) call 'createAt'

## Developing

2015-4-22: Version alpha-2 released.
* Changed the UI to [Material design](http://www.google.com/design/spec/material-design/introduction.html) style
* Message can be stored in AES encrypted text (Storage only, not the encryption on transfer)
* Fixed the ID system (Using cookie)
* Add DB initializing script (UNTESTED)
* Add the config files
* Add the compressed client side scripts
* Improved the UI
* Other bugs fix

2015-4-16: Version alpha-1 released.
* Support 2 BBCode tags, [url][/url] and [img][/img]
* Add 3rd party HTML entity encoder from [Here](http://www.strictly-software.com/htmlencode)
* Improved the UI
* Other bugs fix

2015-4-14: Version alpha-0 released.

###Known Bug
1. <del> ID system is not working when you run this on hosting service (e.g. CleverCloud) </del> Fixed

### Planning Feature
1. <del>Change the UI to [Material design](http://www.google.com/design/spec/material-design/introduction.html)</del> Done
2. <del>Move some variable to a config file</del> Done
3. <del>Move the custom CSS to a CSS file</del> Done
4. Improve the UI
5. <del>Add form validation</del> Done
6. <del>Add BBCode support</del> Support more BBCode
7. Add error messages reminder
8. Allow to read the previous messages (Now only last 10 messages when user login)
9. Administration system and tools (e.g. Domain blocking, text filter, password protect, message delete, etc.)
10. Automatic DB setup script

### Libraries

Please read the `package.json` and `bower.json`

##License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

Learn more on `LICENSE.md`
