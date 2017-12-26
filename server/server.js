var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8080;
process.argv.forEach(function (arg, index) {
  if (arg === '--port') {
    port = parseInt(process.argv[index + 1]);
  }
});

var router = require('./controllers/index');

// The client app
app.use(express.static('./dist'));

// CORS Support
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', router);

// Error handling
app.use(function (err, req, res) {
  console.error(err.stack);
  res.status(500).send({
    'message': err.message
  });
});

app.listen(port, function () {
  console.log('Server started on port ' + port);
});
