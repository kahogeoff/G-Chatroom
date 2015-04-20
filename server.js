//Create by Geoffrey Cheung 2015

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');
var Hashids = require("hashids");

//Set your sever info in here//
var server_ip = process.env.IP || process.env.INADDR_ANY;
var server_port = process.env.PORT || 8080;
//////////////////////////////

//Set your database in here//
var mongodb_host = process.env.MONGODB_ADDON_HOST || '127.0.0.1';
var mongodb_port = process.env.MONGODB_ADDON_PORT || 27017;
var mongodb_user = process.env.MONGODB_ADDON_USER || '';
var mongodb_pwd = process.env.MONGODB_ADDON_PASSWORD || '';
var mongodb_db = process.env.MONGODB_ADDON_DB || 'myweb';
////////////////////////////

var user_count = 0;
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
    var clientIp = socket.conn.request.connection.remoteAddress;

    var id_str = socket.request.headers.cookie.split("; ")[1];
    var id = id_str.substr(id_str.indexOf('=')+1);

    var mongodb_uri = getMongodbURI (mongodb_host, mongodb_port, mongodb_user, mongodb_pwd, mongodb_db);

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
          if(count > 10)
          {
            var stream = collection.find().sort({"createdAt": 1}).skip(count - 10).stream();
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

http.listen(server_port, server_ip, function () {
    console.log('listening on ' + server_ip + ':' + server_port);
});

function getMongodbURI (mongodb_host, mongodb_port, mongodb_user, mongodb_pwd, mongodb_db) {
    if(mongodb_user != '' && mongodb_pwd != '') {
        return "mongodb://"+mongodb_user+':'+mongodb_pwd+'@'+mongodb_host+':'+mongodb_port+'/'+mongodb_db;
    } else {
        return "mongodb://"+mongodb_host+':'+mongodb_port+'/'+mongodb_db;
    }
}
