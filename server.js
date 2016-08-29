"use strict";

var express = require('express');
var app = express();
var port = 8080;

app.use(express.static(__dirname + '/dist'));

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
