const express = require('express');
const http = require('http');
const app = express();
const httpServer = http.createServer(app);
const sockio = require('socket.io');
const io = new sockio(httpServer);

/*const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http); */ //줄이면 이렇게 됨

const body_parse = require('body-parser');

app.set('view engine', 'ejs');

var rooms = ['room_0', 'room_1'];
var target = 0;

app.get('/', (req, res) => {
    res.render('chat_room.ejs');
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('joinRoom', (name, num) => {
        socket.join(rooms[num], () =>{
            console.log('User ' + name + ' has joined ' + rooms[num]);
            io.to(rooms[num]).emit('joinRoom', name, num);
        });
    });

    socket.on('leaveRoom', (name, num) => {
        socket.leave(rooms[num], () => {
            console.log('User ' + name + ' has left ' + rooms[num]);
            io.to(rooms[num]).emit('leaveRoom', name, num);
        });
    });

    socket.on('chat message', (msg, name, num) => {
        console.log("User: " + name + " / Room: " + rooms[num]);
        console.log("Msg: " + msg);
        io.to(rooms[num]).emit('chat message', msg, name, num);
    });
});

httpServer.listen(3000, '127.0.0.1', () => {
    console.log("Listening at port 3000...");
});