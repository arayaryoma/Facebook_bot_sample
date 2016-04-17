var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser());
app.set('port', process.env.PORT || 9000)

app.get('/test', function(req, res) {
    res.send('Hello');
});


app.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === 'allajah_is_hungry') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/', function (req, res) {
    console.log(req.body);
    messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

var token = "CAADFDsM264QBAAUw6ZBbRhFpn7nruTvzl5vauWl3xYlZCQ5E4bNQvsi2yZA8IpqKCSFV4APOUaeZCZAKCLYCRMsrcbsO7NTy0DWcT0n2WTfZAjNcCD4IdZA2uvgh0e1bahW5VZCjZCO2Q7m934S6STety18AzSRZCdxGMkKmcmjfxWimG5Bc3b2ZBZC1r3LEOxg9aoqCNWuoRLQrdQZDZD";

function sendTextMessage(sender, text) {
    console.log(sender);
    console.log(text);
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.listen(app.get('port'), function() {
    console.log('Example app listening on port' + app.get('port'));
});
