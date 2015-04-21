//Create by Geoffrey Cheung 2015

//Server libraries
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var fs = require('fs');

//Utility libraries
var Hashids = require("hashids");
var aes = require("./util/aes.js");

//Config file
var server_config = require('./config/server_config.js');
var basic_config = JSON.parse(fs.readFileSync('./config/basic_config.json', 'utf8'));
var security_config = JSON.parse(fs.readFileSync('./config/security_config.json', 'utf8'));

var user_count = 0;
var max_message_num = basic_config.max_message_num;
var id_ttl_day = basic_config.id_ttl_day;
var msg_ttl_day = basic_config.msg_ttl_day;
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
      hashids = new Hashids(conn_d.toString());
      var id = hashids.encode(Math.floor(Math.random() * (10)) + 1,Math.floor(Math.random() * (10)) + 1,Math.floor(Math.random() * (10)) + 1,Math.floor(Math.random() * (10)) + 1);

      res.cookie('userID',id,{maxAge:3600000 * 24 * id_ttl_day});
    }
});

//When client connected
io.on('connection', function (socket) {
    var clientIp = socket.request.connection.remoteAddress;

    var id = cookie.parse(socket.request.headers.cookie).userID;

    var mongodb_uri = server_config.getMongodbURI ();

    console.log('User from:' + clientIp + ' connected.');
    user_count+=1;
    io.emit('get online user',user_count);
    console.log('Online: '+ user_count);

    //When DB connected
    mongo.connect(mongodb_uri, function (err, db) {
        if (err != null) {
            console.log(err.name + ": " + err.message);
        }else{

            if (db.collection('chatroom').find() === undefined)
            {
                console.log('Cannot find the collection, now we will create one.');
                db.createCollection('chatroom');
                db.collection.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 * 24 * msg_ttl_day} );
            }

            var collection = db.collection('chatroom');
            collection.count(function (err, count) {
                if(count > max_message_num)
                {
                    var stream = collection.find().sort({"createdAt": 1}).skip(count - max_message_num).stream();
                    stream.on('data', function (data) {
                        io.to(socket.id).emit('chat message', 
                            data.timestamp, 
                            data.nickname, 
                            data.encrypted ? aes.decrypt(data.message):data.message, 
                            data.client_ID, 
                            data.color);
                    });
                }else{
                    var stream = collection.find().sort({"createdAt": 1}).stream();
                    stream.on('data', function (data) {
                        io.to(socket.id).emit('chat message', 
                            data.timestamp, 
                            data.nickname, 
                            data.encrypted ? aes.decrypt(data.message):data.message, 
                            data.client_ID, 
                            data.color);
                    });
                }
            });

        }
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
            if (err) {
                console.warn(err.name + ": " + err.message);
            }else{

                var collection = db.collection('chatroom');
                collection.insert({
                    "createdAt": new Date(),
                    "timestamp": n,
                    "nickname": name,
                    "message": security_config.using_aes_to_store? aes.encrypt(msg) :msg,
                    "client_ID": id,
                    "color": color,
                    "encrypted": security_config.using_aes_to_store? 1:0,
                }, function (err, o) {
                    if (err) {
                        console.warn(err.name + ": " + err.message);
                    } else {
                        console.log(d.toString() + '\nChat message form [' + clientIp + '] name [' + name + '] say [' + msg + ']');
                    }
                });

            }
        });

        io.emit('chat message', n, name, msg, id, color);
    });
});

http.listen(server_config.port, server_config.ip, function () {
    console.log('listening on ' + server_config.ip + ':' + server_config.port);
});
