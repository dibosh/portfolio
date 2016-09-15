var express = require('express');
var router = express.Router();

router.use('/projects/count', require('./project.count.js'));
router.use('/info', require('./common'));

module.exports = router;