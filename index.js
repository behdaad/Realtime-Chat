var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app)

var io = require('socket.io')(server);

var sockets = {}; // User: socket
// var online = {};  // str(username): boolean
// var friends = {}; // str(username): array

var User = function(username_)
{
    this.username = username_;
    this.is_online = true;
    this.friends = [];
};

function find_user(username) // receives username, returns User
{
    for (key in sockets)
        if (key.username === username)
            return key; // type: User

    return undefined;
}

function reverse_lookup(dict, socket)
{
    for (key in dict)
    {
        // console.log('key and type in reverese lookup:');
        // console.log(key);
        // console.log(typeof(key));
        if (dict[key] === socket)
        {
            return key; // type: User
        }
    }

    return undefined;
}

app.get('/', function(req, res)
{
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'))

io.on('connection', function(socket)
{
    socket.on('login', function(username)
    {
        var current_user = find_user(username);
        // console.log(current_user);
        if (sockets[current_user] === undefined)
        {
            current_user = new User(username);
            sockets[current_user] = socket;
            // console.log(username + ' created');
            console.log(current_user.username);
        }

        current_user.is_online = true;
        // console.log(username + " signed in.");

        socket.emit('friends', current_user.friends);
    });

    socket.on('add friend', function(adder, addee)
    {
        var adder_user = find_user(adder);
        var addee_user = find_user(addee);
        if (addee !== undefined)
            current_user.friends.push(find_user(addee));
    });

    socket.on('chat message', function(message)
    {
        // socket.emit('chat message', message);
        // console.log(message);
    });

    socket.on('disconnect', function()
    {
        var user = reverse_lookup(sockets, socket);
        // console.log(user);
        if (user !== undefined)
        {
            user.is_online = false;
            // console.log('sign out');
            // console.log(user.username);
        }
    });
});

server.listen(3000, function()
{
    console.log('listening on *:3000');
});
