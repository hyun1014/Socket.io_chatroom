const express = require('express');
const http = require('http');
const app = express();
const httpServer = http.createServer(app);
const sockio = require('socket.io');
const io = new sockio(httpServer);

/*const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http); */ //줄이면 이렇게 됨

app.set('view engine', 'ejs');

var rooms = ['room_0', 'room_1', 'room_2', 'room_3', 'room_4'];

app.get('/', (req, res) => {
    res.render('chat_room.ejs');
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected'); // 누가 나갔는지 알게 할수는 없을까
    });

    socket.on('joinRoom', (name, num) => {
        socket.join(rooms[num], () =>{ // chat room에 join시킨 후, chat room에 joinRoom event emit
            console.log('User ' + name + ' has joined ' + rooms[num]);
            io.to(rooms[num]).emit('joinRoom', name, num);
        });
    });

    socket.on('leaveRoom', (name, num) => {
        socket.leave(rooms[num], () => { // chat room에서 leave시킨 후, chat room에 leaveRoom event emit
            console.log('User ' + name + ' has left ' + rooms[num]);
            io.to(rooms[num]).emit('leaveRoom', name, num);
        });
    });

    socket.on('chat message', (msg, name, num) => { // msg 받은거 console에 출력 후, chat room에 chat message event emit
        console.log("User: " + name + " / Room: " + rooms[num]);
        console.log("Msg: " + msg);
        io.to(rooms[num]).emit('chat message', msg, name, num);
    });
});

httpServer.listen(3000, '127.0.0.1', () => {
    console.log("Listening at port 3000...");
});