(function () {
  'use strict';
  angular
    .module('portfolioApp.services')
    .factory('commonService', commonService);

  commonService.$inject = ['$http', 'config'];

  function commonService($http, config) {
    function getAboutMe() {
      var url = config.BASE_URL + '/info/about'
      return $http.get(url)
        .then(function (response) {
          return response.data;
        })
    }

    return {
      getAboutMe: getAboutMe
    }
  }
})();