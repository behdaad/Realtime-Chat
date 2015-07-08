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
    var message = $('#message_input').val();
    socket.emit('chat message', $('#message_input').val());
    $('#message_input').val('');
    addComment(username, message);
    return false;
});

socket.on('chat message', function(message)
{
    // $('#messages').append($('<li>').text(message));
    alert('chat message received' + message);
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

  var messageTime = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][date.getDay()] +
  " at " + curr_hour + ":" + min + a_p;
  var newMessage = new Message(username, messageTime, message);

  $('#message_add').append(
    '<div class="comment">' +
        '<a class="avatar">' +
          '<img src="static/avatars/5.jpg">' +
        '</a>' +
      '<div class="content">' +
          '<a class="author">' +
            newMessage.getUsername() +
            '</a>' +
          '<div class="metadata">' +
              '<span class="date">' +
              newMessage.getDateAndTime() +
              '</span>' +
          '</div>' +
          '<div class="text">' +
            newMessage.getMessageString()+
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
    $('#message_add').append(
      '<div class="comment">' +
          '<a class="avatar">' +
            '<img src="static/avatars/5.jpg">' +
          '</a>' +
        '<div class="content">' +
            '<a class="author">' +
              messagesList[index].getUsername() +
              '</a>' +
            '<div class="metadata">' +
                '<span class="date">' +
                  messagesList[index].getDateAndTime() +
                '</span>' +
            '</div>' +
            '<div class="text">' +
            messagesList[index].getMessageString() +
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

    this.getUsername = function () {
        return this.username;
    }

    this.getDateAndTime = function () {
        return this.messageTime;
    }

    this.getMessageString = function () {
        return this.messageString;
    }
}
