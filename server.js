"use strict";

var express = require('express');
var app = express();
var port = process.argv[2] || 8080;

app.use(express.static(__dirname + '/dist'));

app.listen(port, function () {
  console.log('Portfolio listening on port ' + port);
});
