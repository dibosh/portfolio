var express = require('express');
var router = express.Router();
var commonData = require('../datasource/common.json');


router.get('/about', function (req, res) {
  res.status(200).send(commonData.aboutMe);
});

module.exports = router;