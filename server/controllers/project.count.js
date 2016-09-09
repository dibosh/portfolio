var express = require('express');
var router = express.Router();
var request = require('request-promise');
var commonData = require('../datasource/common.json');

router.use(function timeLog(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

router.get('/github', function (req, res) {
  var requestConfig = prepareRequestConfig(null, commonData.portfolios.github.url, {'User-Agent': 'dibosh'});
  request(requestConfig)
    .then(function (response) {
      res.status(response.statusCode).send({
        'count': response.body.length,
        'url': commonData.portfolios.github.publicProfile
      });
    })
    .catch(function (errorResponse) {
      res.status(errorResponse.statusCode).send(errorResponse.error.error);
    });
});

router.get('/bitbucket', function (req, res) {
  var requestConfig = prepareRequestConfig(null, commonData.portfolios.bitbucket.url, null);
  request(requestConfig)
    .then(function (response) {
      res.status(response.statusCode).send({
        'count': response.body.length,
        'url': commonData.portfolios.bitbucket.publicProfile
      });
    })
    .catch(function (errorResponse) {
      res.status(errorResponse.statusCode).send(errorResponse.error.error);
    });
});

function prepareRequestConfig(method, url, headers) {
  var requestConfig = {
    method: method || 'GET',
    url: url,
    json: true,
    resolveWithFullResponse: true
  };
  if (headers) {
    requestConfig['headers'] = headers;
  }
  return requestConfig;
}

module.exports = router;