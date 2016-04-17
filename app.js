var express = require('express');
var app = express();
app.set('port', process.env.PORT || 9000)

app.get('/test', function(req, res) {
    res.send('Hello');
});

var token = "CAADFDsM264QBAFDTsDgdVigMynMn3uJDXPBRfE0L3z1mTHAUyfFaVn7U9UfKx7xO38wd54PKzZBIkJOzScn8GdUnsCNmAYiT1ZALZA2ogf3Ij0UMt0QISyBDdSQbPYH00bcedJ80QI5mNkYavnHXS22ZB20kIc6o9VyaLZApQJP2fdQBIeuVSBZBNbVvJeX2s61EKdY6CIWgZDZD";

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === token) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
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

function sendTextMessage(sender, text) {
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
