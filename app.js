const express = require('express');
const sockio = require('socket.io');
const body_parse = require('body-parser');
const ejs = require('ejs');

const app = express();
const http = require('http');
const httpServer = http.Server(app);
const Server = require('socket.io');
const io = new Server(httpServer);


app.use(body_parse.urlencoded({extended: false}));
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
    console.log('user connected'); //namespace에 connection 생길 때에도 작동함
    socket.on('chat message', (msg) => {
        console.log("Got message: " + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

//message sending이 계속 스택으로 쌓인다 왜일까
const namespace0 = io.of('/namespace0');
namespace0.on('connection', (socket) => {
    console.log("ns0 connected from client");
    namespace0.emit('news', {hello: 'Connected ns0.'});
});

const namespace1 = io.of('/namespace1');
namespace1.on('connection', (socket) => {
    console.log("ns1 connected from client");
    namespace1.emit('news', {hello: 'Connected ns1.'});
});


app.get('/', (req, res) => {
    //console.log(req);
    res.render('index.ejs');
});

httpServer.listen(3000, '127.0.0.1', () => { // app.listen 이렇게 열면 socket.io.js 못찾는다. 왜지...
    console.log("Listening at port 3000...");
});
