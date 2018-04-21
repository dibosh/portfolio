var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var httpProxy = require('http-proxy');

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

var proxy = httpProxy.createProxyServer({});
app.use('/blog', function (req, res) {
  proxy.web(req, res, { target: 'http://127.0.0.1:4000/blog' });
});

// CORS Support
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', router);

// Error handling
app.use(function (err, req, res, next) {
  if (!err) {
    next();
  }

  console.log('Error: %s %O', err.message, err.stack);
  res.status(500).send({
    'message': 'Internal Server Error'
  });
});

app.listen(port, function () {
  console.log('Server started on port ' + port);
});
