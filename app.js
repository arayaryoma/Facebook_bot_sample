var express = require('express');
var app = express();
app.set('port', process.env.PORT || 9000)

app.get('/test', function(req, res) {
    res.send('Hello');
});

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === '<validation_token>') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.listen(app.get('port'), function() {
    console.log('Example app listening on port' + app.get('port'));
});
