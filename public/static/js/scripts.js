var socket = io();
var username;
var target_user; // username of the user whose chat window is open
var target_user_is_online; // shows whether "target_user" is online or not. true/false
var dict = {};

$('#login_form').submit(function()
{
    username = $('#username').val();
    fullname = $('#fullname').val();
    if (username !== "")
    {
        socket.emit('login', username);
        $('.ui.modal').modal('hide');
        $('#welcome_username').text(fullname);
        $('#important').text('@' + username);
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
            dict[f[0]] = new Array();
            $('#online_users').prepend($('<a>', {
                text: f[0],
                id: f[0],
                class: "online item",
                onclick: "user_clicked('" + f[0] + "')"
            }));
        }
        else
        {
            dict[f[0]] = new Array();
            $('#offline_users').prepend($('<a>', {
                text: f[0],
                id: f[0],
                class: "offline item",
                onclick: "user_clicked('" + f[0] + "')"
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
        dict[username] = new Array();
        $('#online_users').prepend($('<a>', {
            text: username,
            id: username,
            class: "online item",
            onclick: "user_clicked('" + username + "')"
        }));
    }
    else
    {
        dict[username] = new Array();
        $('#offline_users').prepend($('<a>', {
            text: username,
            id: username,
            class: "offline item",
            onclick: "user_clicked('" + username + "')"
        }));
    }
});

function user_clicked(username)
{
    // alert('user clicked')
    $('.active').removeClass('active');
    $('#' + username).addClass('active');
    target_user = username;
    addMessagesList(dict[username]);
    socket.emit('question online', username);
    $('#' + username).html(username);
    $('#chat_with').text(username);
}

socket.on('answer online', function(username, is_online)
{
    if (username === target_user)
    {
        target_user_is_online = is_online;
    }

    if (is_online === false)
    {
        // alert('khob off e')
        $('#message_input').prop('disabled', true);
        $('#send_button').addClass('disabled');
        $('#chat_online').text('Offline');
        $('#' + username).removeClass('online');
        $('#' + username).addClass('offline');
    }
    else
    {
        // alert('online e baba')
        $('#message_input').prop('disabled', false);
        $('#send_button').removeClass('disabled');
        $('#chat_online').text('Online');
        $('#' + username).removeClass('offline');
        $('#' + username).addClass('online');
    }
});

$('#send_button').click(function()
{
    $('#messages_form').submit();
});

$('#messages_form').submit(function()
{
    // console.log("form submitted");
    var message = $('#message_input').val();
    socket.emit('chat message', username, target_user, $('#message_input').val());
    $('#message_input').val('');
    addComment(username, message);
    return false;
});

socket.on('chat message', function(sender, message)
{
    //dict[message.username].push(message);
    if(sender === target_user ) {
        addComment(sender, message);
    }
    else {
        //make it a function
        var date = new Date(); //$.now()
        var curr_hour = date.getHours();

        if (curr_hour < 12) {
            a_p = "AM";
        }
        else {
            a_p = "PM";
        }
        if (curr_hour == 0) {
            curr_hour = 12;
        }
        if (curr_hour > 12){
            curr_hour = curr_hour - 12;
        }

        var min = date.getMinutes();
        min = '' + min;
        if (min.length < 2) {
            min = "0" + min;
        }

        var messageTime = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()] +
        " at " + curr_hour + ":" + min + a_p;
        var newMessage = new Message(sender, messageTime, message);
        dict[sender].push(newMessage);
        notify(sender);
    }
    // $('#messages').append($('<li>').text(message));
});

socket.on('Error', function(error_message)
{
    alert(error_message);
});

//Written By Shaghayegh
function addComment(username, message) {
    var date = new Date(); //$.now()
    var curr_hour = date.getHours();

    if (curr_hour < 12) {
        a_p = "AM";
    }
    else {
        a_p = "PM";
    }
    if (curr_hour == 0) {
        curr_hour = 12;
    }
    if (curr_hour > 12){
        curr_hour = curr_hour - 12;
    }

    var min = date.getMinutes();
    min = '' + min;
    if (min.length < 2) {
        min = "0" + min;
    }

    var messageTime = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()] +
    " at " + curr_hour + ":" + min + a_p;
    var newMessage = new Message(username, messageTime, message);
    dict[target_user].push(newMessage);
    if (username === target_user)
    {
        var avatar = '<img src="static/avatars/5.jpg">';
    }
    else
    {
        var avatar = '<img src="static/avatars/1.jpg">';
    }
    $('#message_add').append(
        '<div class="comment">' +
        '<a class="avatar">' +
        avatar +
        '</a>' +
        '<div class="content">' +
        '<a class="author">' +
        newMessage.username +
        '</a>' +
        '<div class="metadata">' +
        '<span class="date">' +
        newMessage.messageTime +
        '</span>' +
        '</div>' +
        '<div class="text">' +
        newMessage.messageString +
        '</div>' +
        '</div>' +
        '</div>'
    );
}

//Written By Shaghayegh
function clearMessagesList() {
    $('#message_add').empty();
}

//Written By Shaghayegh
function addMessagesList(messagesList) {
    clearMessagesList();
    var index;
    for	(index = 0; index < messagesList.length; index++) {
        if (messagesList[index].username === target_user)
        {
            var avatar = '<img src="static/avatars/5.jpg">';
        }
        else
        {
            var avatar = '<img src="static/avatars/1.jpg">';
        }
        $('#message_add').append(
            '<div class="comment">' +
            '<a class="avatar">' +
            avatar +
            '</a>' +
            '<div class="content">' +
            '<a class="author">' +
            messagesList[index].username +
            '</a>' +
            '<div class="metadata">' +
            '<span class="date">' +
            messagesList[index].messageTime +
            '</span>' +
            '</div>' +
            '<div class="text">' +
            messagesList[index].messageString +
            '</div>' +
            '</div>' +
            '</div>'
        );
    }
}

//Written By Shaghayegh
var Message = function(username, messageTime, messageString) {
    this.username = username;
    this.messageTime = messageTime;
    this.messageString = messageString;
}

// Written by BEHDAD >:p
function notify(username)
{
    var target = $('#' + username);
    if (target.html() === username)
    {
        target.append('<div id="' + username + '_notify" class="ui blue label">1</div>');
    }
    else
    {
        var notifs_count_str = $('#' + username + '_notify').text();
        var notifs_count = parseInt(notifs_count_str) + 1;
        // notifs_count_str = '' + notifs_count;
        $('#' + username + '_notify').text('' + notifs_count);
    }
}
