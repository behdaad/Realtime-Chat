$('#send_button').click(function()
{
    $('#messages_form').submit();
});

var socket = io();
// console.log("script executed");
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

$('#login_form').submit(function()
{
    // alert('login form submitted');
    socket.emit('login', $('#username').val())
    $('.ui.modal').modal('hide');
    return false;
});

$('.ui.modal').modal(
    {
        blurring: true,
        closable: false,
        onApprove: function()
        {
            $('#login_form').submit();
            // socket.emit('login', $('#username').val());
            // alert('what?');
        },
    })
    .modal('show');
