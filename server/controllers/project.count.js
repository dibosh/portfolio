var express = require('express');
var router = express.Router();
var request = require('request-promise');
var q = require('q');
var commonData = require('../datasource/common.json');

router.use(function timeLog(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

router.get('/github', function (req, res) {
  var requestConfig = prepareRequestConfig(null, commonData.portfolios.github.url, null);
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
        'count': response.body.size,
        'url': commonData.portfolios.bitbucket.publicProfile
      });
    })
    .catch(function (errorResponse) {
      res.status(errorResponse.statusCode).send(errorResponse.error.error);
    });
});

router.get('/behance', function (req, res) {
  var requestConfig = prepareRequestConfig(null, commonData.portfolios.behance.url, null);
  request(requestConfig)
    .then(function (response) {
      res.status(response.statusCode).send({
        'count': response.body.projects.length,
        'url': commonData.portfolios.behance.publicProfile
      });
    })
    .catch(function (errorResponse) {
      res.status(errorResponse.statusCode).send(errorResponse.error.error);
    });
});

router.get('/dribbble', function (req, res) {
  var requestConfig = prepareRequestConfig(null, commonData.portfolios.dribbble.url, null);
  request(requestConfig)
    .then(function (response) {
      res.status(response.statusCode).send({
        'count': response.body.length,
        'url': commonData.portfolios.dribbble.publicProfile
      });
    })
    .catch(function (errorResponse) {
      res.status(errorResponse.statusCode).send(errorResponse.error.error);
    });
});

router.get('/all', function (req, res) {
  var sites = ['behance', 'dribbble', 'github', 'bitbucket'];
  var promises = [];

  for (var index in sites) {
    var requestConfig = prepareRequestConfig(null, commonData.portfolios[sites[index]].url, null);
    var promise = request(requestConfig)
      .then(function (response) {
        return response;
      });

    promises.push(promise);
  }

  q.all(promises)
    .then(function (aggregatedResponse) {
      var actualResponse = {};
      for (var index in aggregatedResponse) {
        var response = aggregatedResponse[index];
        var hostNameRegex = /\.([^\.]+)\./g;
        var hostName = hostNameRegex.exec(response.request.uri.hostname)[1];
        actualResponse[hostName] = {
          count: dataRetrievalFunctions[hostName](response.body),
          url: commonData.portfolios[hostName].publicProfile
        };
      }

      res.status(200).send(actualResponse);
    })
    .catch(function (error) {
      res.send(error);
    });
});

var dataRetrievalFunctions = {
  behance: function (data) {
    return data.projects.length;
  },
  dribbble: function (data) {
    return data.length;
  },
  github: function (data) {
    return data.length;
  },
  bitbucket: function (data) {
    return data.size;
  }
};

function prepareRequestConfig(method, url, headers) {
  return {
    method: method || 'GET',
    url: url,
    json: true,
    resolveWithFullResponse: true,
    headers: headers || {
      'User-Agent': 'dibosh'
    }
  };
}

module.exports = router;