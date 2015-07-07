var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app)

var io = require('socket.io')(server);

var users = [];

var User = function(username, socket)
{
    this.username = username;
    this.is_online = true;
    this.friends = [];
    this.socket = socket;
};

function find_user(username, array) // receives username, returns User
{
    for (user of array)
        if (user.username === username)
            return user; // type: User

    return null;
}

function emit_friends(friends)
{
    returnee = [];
    for (friend of friends)
        returnee.push([friend.username, friend.is_online]);

    return returnee;
}

function already_added(adder, addee)
{
    // console.log(adder.username);
    for (friend of adder.friends)
        if (friend === addee)
            return true;
    return false;
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
        var user = find_user(username, users);
        if (user === null)
        {
            user = new User(username, socket);
            users.push(user);
        }
        else
            user.socket = socket;

        // console.log(user.friends);
        var temp = emit_friends(user.friends);
        // console.log(temp);
        socket.emit('friends', emit_friends(user.friends));
    });

    socket.on('add friend', function(adder, addee)
    {
        var adder_user = find_user(adder, users);
        var addee_user = find_user(addee, users);

        if (addee_user !== null && !already_added(adder_user, addee_user))
            adder_user.friends.push(addee_user);

        socket.emit('is online', addee_user.is_online, addee_user.username)
    });

    socket.on('chat message', function(message)
    {
        // socket.emit('chat message', message);
        // console.log(message);
    });

    socket.on('disconnect', function()
    {
        for (user of users)
        {
            if (user.socket === socket)
            {
                user.is_online = false;
                user.socket = undefined;
                return;
            }
        }
    });
});

server.listen(3000, function()
{
    console.log('listening on *:3000');
});
