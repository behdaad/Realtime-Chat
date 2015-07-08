var socket = io();
var username;
var message_target;
var target_user_is_online;

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

socket.on('friends', function(friends) // friend[0]: username, friend[1]: is_online
{
    // console.log("fffff");
    // console.log(friends[0]);
    for (f of friends)
    {
        console.log(f[0] + ' (' + f[1] + ')');
        if (f[1]) // is online
        {
            $('#online_users').prepend($('<a>', {
                text: f[0],
                class: "online item",
                onclick: "user_clicked(" + f[0] + ")"
            }));
        }
        else
        {
            $('#offline_users').prepend($('<a>', {
                text: f[0],
                class: "offline item",
                onclick: "user_clicked(" + f[0] + ")"
            }));
        }
    }
});

$('#add_friend_form').submit(function()
{
    socket.emit('add friend', username, $('#add_friend').val());
    $('#add_friend').val('')

    return false;
});

socket.on('is online', function(is_online, username)
{
    if (is_online) // is online
    {
        $('#online_users').prepend($('<a>', {
            text: username,
            class: "online item",
            onclick: "user_clicked(" + username + ")"
        }));
    }
    else
    {
        $('#offline_users').prepend($('<a>', {
            text: username,
            class: "offline item",
            onclick: "user_clicked(" + username + ")"
        }));
    }
});

function user_clicked(username)
{
    target_user = username;
    socket.emit('question online', username);
}

socket.on('answer online', function(username, is_online)
{
    if (username === target_user)
        target_user_is_online = is_online;

    if (is_online === false)
        $('#message_input').prop('disabled', true);
    else
        $('#message_input').prop('disabled', false);
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
