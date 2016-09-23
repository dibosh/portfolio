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
    vm.portFolioLink = 'https://drive.google.com/file/d/0BwF65AZWzKH-VllMTkhrUzZQOE0/view?usp=sharing';

    function activate() {
      vm.isLoading = true;
      commonSvc.getAll()
        .then(function (infoResp) {
          var aboutMe = infoResp.aboutMe;
          vm.name = aboutMe.fullName;
          vm.professionalTitle = aboutMe.designation;
          vm.shortBio = aboutMe.shortBio;
          vm.expertise = infoResp.expertise;

          projectCountSvc.getProjectCounts()
            .then(function (projectCountResp) {
              vm.projectSites = projectCountResp;
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