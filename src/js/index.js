(function () {
  'use strict';

  angular
    .module('portfolioApp', [
      'ui.router',
      'toastr'
    ]);

  // Controller register
  angular
    .module('portfolioApp')
    .controller('MainController', MainController);

  // Service register
  angular
    .module('portfolioApp')
    .factory('projectCountService', projectCountService);


  // Controller defn
  MainController.$inject = ['projectCountService'];

  function MainController(projectCountSvc) {
    var vm = this;
    vm.templates = {
      top: 'partials/top.html',
      middle: 'partials/middle.html'
    };
    vm.name = 'Munim Dibosh';
    vm.professionalTitle = 'Full Stack Software Engineer';
    vm.shortBio = "A passionate geek and design fanatic by nature. Have been engaged in active software development " +
      "for over 5 years now. Managed and developed softwares for across multiple platforms - mobile, desktop and web. " +
      "Working with a team who loves to solve problems that affect millions of lives- is the goal am pursuing right now.";

    projectCountSvc.getProjectCounts()
      .then(function (response) {
        console.log(response);
      })
      .catch(function (err) {
        console.log(err);
      });

    vm.urlBoxes = [
      {
        icon: 'fa fa-github'
      }
    ];
  }

  // Service defn
  projectCountService.$inject = ['$http', '$q'];

  function projectCountService($http, $q) {
    var accessTokens = {
      behance: 'huE0X5JNfFVJzHCwWNwJMHbT4T6RhB2F',
      dribbble: 'eca489380efaa385dbeae2e5c04da5e6ac2284d9f50d8c6433fab7a774a40781'
    };

    var urls = {
      behance: 'https://api.behance.net/v2/users/munimdibosh/projects?client_id=' + accessTokens.behance,
      dribbble: 'https://api.dribbble.com/v1/users/idibosh/shots?access_token=' + accessTokens.dribbble,
      github: 'https://api.github.com/users/dibosh/repos',
      bitbucket: 'https://api.bitbucket.org/2.0/repositories/coderguy194'
    };

    var dataRetrieveFunctions = {
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

    function _getKeyForValue(obj, value) {
      Object.keys(obj).forEach(function (key, index) {
        if (obj[key] === value) {
          return key;
        }
      });
      return null;
    }

    function _getCountPromise(url) {
      var type = _getKeyForValue(urls, url);
      return $http.get(url)
        .then(function (response) {
          var resp = {};
          console.log(dataRetrieveFunctions[type]);
          resp[type] = dataRetrieveFunctions[type](response.data);
          return resp;
        });
    }

    function getProjectCounts() {
      var deferred = $q.defer();
      var promises = [];

      Object.keys(urls).forEach(function (type, index) {
        promises.push(_getCountPromise(urls[type]));
      });

      $q.all(promises)
        .then(function (aggregatedResponse) {
          var flattenedIntoOne = Object.assign.apply(Object, aggregatedResponse);
          deferred.resolve(flattenedIntoOne);
        })
        .catch(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    return {
      getProjectCounts: getProjectCounts
    }
  }
})();
