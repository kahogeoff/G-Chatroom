//Create by Geoffrey Cheung 2015

//Server libraries
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');

//Utility libraries
var Hashids = require("hashids");

//Config file
var server_config = require('./config/server_config.js')

var user_count = 0;
var max_message_num = 10;
var id_ttl_day = 1;
var d = new Date();

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/js', express.static(__dirname + '/app/js'));
app.use('/css', express.static(__dirname + '/app/css'));

app.use(cookieParser());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app/index.html');

    var cookie = req.cookies.userID;
    if (cookie === undefined)
    {
      var conn_d = new Date();
      hashids = new Hashids(conn_d.getTime(),8);
      var id = hashids.encode(Math.floor(Math.random() * (10)) + 1);

      res.cookie('userID',id,{maxAge:3600000 * 24 * id_ttl_day});
    }
});

//When client connected
io.on('connection', function (socket) {
    var clientIp = socket.request.connection.remoteAddress;

    var id_str = socket.request.headers.cookie;
    var id = id_str.substr(id_str.indexOf('userID=')+7,id_str.indexOf('userID=')+15);

    var mongodb_uri = server_config.getMongodbURI ();

    console.log('User from:' + clientIp + ' connected.');
    user_count+=1;
    io.emit('get online user',user_count);
    console.log('Online: '+ user_count);

    //When DB connected
    mongo.connect(mongodb_uri, function (err, db) {
        if (err != null) {
            console.log(err.name + ": " + err.message);
            return 1;
        }
        var collection = db.collection('chatroom');
        collection.count(function (err, count) {
          if(count > max_message_num)
          {
            var stream = collection.find().sort({"createdAt": 1}).skip(count - max_message_num).stream();
            stream.on('data', function (data) {
                io.to(socket.id).emit('chat message', data.timestamp, data.nickname, data.message, data.client_ID, data.color);
            });
          }else{
            var stream = collection.find().sort({"createdAt": 1}).stream();
            stream.on('data', function (data) {
                io.to(socket.id).emit('chat message', data.timestamp, data.nickname, data.message, data.client_ID, data.color);
            });
          }
        });
    });

    //When client disconnected
    socket.on('disconnect', function () {
        console.log('User from:' + clientIp + ' disconnected');
        user_count-=1;
        if(user_count > 0)
        {
            io.emit('get online user',user_count);
            console.log('Online: '+ user_count);
        }
    });

    //When messages recivied
    socket.on('chat message', function (name, msg, color) {
        var msgd = new Date();
        var n = msgd.getTime();
        mongo.connect(mongodb_uri, function (err, db) {
            var collection = db.collection('chatroom');
            collection.insert({
                "createdAt": new Date(),
                "timestamp": n,
                "nickname": name,
                "message": msg,
                "client_ID": id,
                "color": color
            }, function (err, o) {
                if (err) {
                    console.warn(err.message);
                } else {
                    console.log(d.toString() + '\nChat message form [' + clientIp + '] name [' + name + '] say [' + msg + ']');
                }
            });

        });

        io.emit('chat message', n, name, msg, id, color);
    });
});

http.listen(server_config.port, server_config.ip, function () {
    console.log('listening on ' + server_config.ip + ':' + server_config.port);
});
