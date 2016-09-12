(function () {
  'use strict';
  angular
    .module('portfolioApp.services')
    .factory('projectCountService', projectCountService);

  projectCountService.$inject = ['$http', 'config'];

  function projectCountService($http, config) {
    function getProjectCounts() {
      var url = config.BASE_URL + '/projects/count';
      return $http.get(url)
        .then(function (response) {
          return response.data;
        })
    }

    return {
      getProjectCounts: getProjectCounts
    }
  }
})();