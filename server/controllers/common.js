var express = require('express');
var router = express.Router();
var commonData = require('../datasource/common.json');


router.get('/about', function (req, res) {
  res.status(200).send(commonData.aboutMe);
});

router.get('/expertise', function (req, res) {
  res.status(200).send(commonData.expertise);
});

router.get('/all', function (req, res) {
  res.status(200).send({
    'aboutMe': commonData.aboutMe,
    'expertise': commonData.expertise
  });
});

module.exports = router;