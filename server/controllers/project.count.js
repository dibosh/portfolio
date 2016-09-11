var express = require('express');
var router = express.Router();
var request = require('request-promise');
var q = require('q');
var xmlToJSONParser = require('xml2js');
var commonData = require('../datasource/common.json');

router.use(function timeLog(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

function getErrorInterpretation(errorObject) {
  if (errorObject.hasOwnProperty('statusCode') && errorObject.hasOwnProperty('error')) {
    // custom error object from request lib
    return {
      statusCode: errorObject.statusCode,
      resolvedResponse: errorObject.error.error
    };
  } else {
    return {
      statusCode: 500,
      resolvedResponse: {
        message: errorObject.message
      }
    }
  }
}

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
      var error = getErrorInterpretation(errorResponse);
      res.status(error.statusCode).send(error.resolvedResponse);
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
      var error = getErrorInterpretation(errorResponse);
      res.status(error.statusCode).send(error.resolvedResponse);
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
      var error = getErrorInterpretation(errorResponse);
      res.status(error.statusCode).send(error.resolvedResponse);
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
      var error = getErrorInterpretation(errorResponse);
      res.status(error.statusCode).send(error.resolvedResponse);
    });
});

router.get('/codepen', function (req, res) {
  var requestConfig = prepareRequestConfig(null, commonData.portfolios.codepen.url, null);
  request(requestConfig)
    .then(function (response) {
      var statusCode = response.statusCode;
      var xml = response.body;
      xmlToJSONParser.parseString(xml, function (parseError, parsedJSON) {
        if (parseError) {
          var error = getErrorInterpretation(parseError);
          res.status(error.statusCode).send(error.resolvedResponse);
        }
        res.status(statusCode).send({
          'count': parsedJSON.rss.channel[0].item.length,
          'url': commonData.portfolios.codepen.publicProfile
        });
      });
    })
    .catch(function (errorResponse) {
      var error = getErrorInterpretation(errorResponse);
      res.status(error.statusCode).send(error.resolvedResponse);
    });
});

router.get('/', function (req, res) {
  var sites = ['behance', 'dribbble', 'github', 'bitbucket', 'codepen'];

  var promises = [];

  var baseAbsoluteUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  for (var index in sites) {
    var requestConfig = prepareRequestConfig(null, baseAbsoluteUrl + '/' + sites[index], null);
    var promise = request(requestConfig)
      .then(function (response) {
        return response.body;
      });

    promises.push(promise);
  }

  q.all(promises)
    .then(function (aggregatedResponse) {
      var actualResponse = {};
      for (var index in aggregatedResponse) {
        var response = aggregatedResponse[index];
        var hostNameRegex = /(?=[^\/\/\.]*\.)([^\.]+)(?=\.[^\.]*$)/g;
        var hostName = hostNameRegex.exec(response.url)[1];
        actualResponse[hostName] = response;
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
  },
  codepen: function (data) {
    return data.data.length;
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