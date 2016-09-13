(function () {
  'use strict';
  angular
    .module('portfolioApp.controllers')
    .controller('MainCtrl', MainController);

  MainController.$inject = ['commonService', 'projectCountService'];

  function MainController(commonSvc, projectCountSvc) {
    var vm = this;
    vm.templates = {
      top: 'partials/top.html',
      middle: 'partials/middle.html'
    };
    vm.resumeLink = 'https://docs.google.com/document/u/1/d/1596g6Zf_PiidhvZ-f7WCHKj708XptnB5y14fgVXjvp8/export?format=pdf';

    function activate() {
      vm.isLoading = true;
      commonSvc.getAboutMe()
        .then(function (response) {
          vm.name = response.fullName;
          vm.professionalTitle = response.designation;
          vm.shortBio = response.shortBio;

          projectCountSvc.getProjectCounts()
            .then(function (response) {
              vm.projectSites = response;
              for (var key in vm.projectSites) {
                var projectSite = vm.projectSites[key];
                projectSite.icon = 'fa fa-' + key;
              }

              vm.isLoading = false;
            })
            .catch(function (err) {
              console.log(err);
            })
            .finally(function () {
              vm.isLoading = false;
            });
        });
    }

    activate();
  }
})();