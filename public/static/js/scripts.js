var socket = io();
var username;

$('#login_form').submit(function()
{
    username = $('#username').val();
    if (username !== "")
    {
        socket.emit('login', username);
        $('.ui.modal').modal('hide');
        $('#welcome_username').text(username);
    }
    return false;
});

$('.ui.modal').modal({
    blurring: true,
    closable: false,
    onApprove: function()
    {
        $('#login_form').submit();
    },
}).modal('show');

socket.on('friends', function(friends)
{
    console.log("fffff");
    // console.log(friends[0]);
    for (f of friends)
    {
        console.log(f[0] + ' (' + f[1] + ')');
    }
});

$('#add_friend_form').submit(function()
{
    socket.emit('add friend', username, $('#add_friend').val());
    $('#add_friend').val('')
    return false;
});

$('#send_button').click(function()
{
    $('#messages_form').submit();
});

$('#messages_form').submit(function()
{
    // console.log("form submitted");
    socket.emit('chat message', $('#message_input').val());
    $('#message_input').val('');
    return false;
});

socket.on('chat message', function(message)
{
    // $('#messages').append($('<li>').text(message));
    alert('chat message received' + message);
});
