var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app)

var io = require('socket.io')(server);

app.get('/', function(req, res)
{
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'))

io.on('connection', function(socket)
{
    console.log('a user connected')
    // console.log(socket);
    socket.on('chat message', function(message)
    {
        socket.emit('chat message', message);
        console.log(message);
    });
    socket.on('disconnect', function()
    {
        console.log('user disconnected');
    });
    socket.on('login', function(message)
    {
        console.log("username: " + message);
    });
});

server.listen(3000, function()
{
    console.log('listening on *:3000');
});
