//Create by Geoffrey Cheung 2015

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crc = require('crc');
var mongo = require('mongodb').MongoClient;
var d = new Date();
var user_count = 0;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/js', express.static(__dirname + '/app/js'));
app.use('/css', express.static(__dirname + '/app/css'));

io.on('connection', function (socket) {
    var clientIp = socket.request.connection.remoteAddress;
    var n = d.toDateString();
    var id = crc.crc32(clientIp + n).toString(16);

    console.log('User from:' + clientIp + ' connected.');
    user_count+=1;
    io.emit('get online user',user_count);
    console.log('Online: '+ user_count);

    mongo.connect("mongodb://localhost:27017/gchatroom", function (err, db) {
        if (err != null) {
            console.log(err.name + ": " + err.message);
            return 1;
        }
        var collection = db.collection('chatroom');
        collection.count(function (err, count) {
          if(count > 10)
          {
            var stream = collection.find().skip(count - 10).stream();
            stream.on('data', function (data) {
                io.to(socket.id).emit('chat message', data.timestamp, data.nickname, data.message, data.client_ID, data.color);
            });
          }else{
            var stream = collection.find().stream();
            stream.on('data', function (data) {
                io.to(socket.id).emit('chat message', data.timestamp, data.nickname, data.message, data.client_ID, data.color);
            });
          }
        });
    });

    socket.on('disconnect', function () {
        console.log('User from:' + clientIp + ' disconnected');
        user_count-=1;
        if(user_count > 0)
        {
            io.emit('get online user',user_count);
            console.log('Online: '+ user_count);
        }
    });

    socket.on('chat message', function (name, msg, color) {
        var msgd = new Date();
        var n = msgd.getTime();
        mongo.connect("mongodb://localhost:27017/gchatroom", function (err, db) {
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

http.listen(8080, function () {
    console.log('listening on *:8080');
});
