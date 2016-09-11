(function () {
  'use strict';

  angular
    .module('portfolioApp.config')
    .factory('config', config);

  function config() {
    var BASE_URL = '/api';

    return {
      BASE_URL: BASE_URL
    };
  }
})();
