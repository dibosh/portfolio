(function () {
  'use strict';

  angular
    .module('portfolioApp', [
      'ui.router',
      'toastr'
    ]);

  angular
    .module('portfolioApp')
    .controller('MainController', MainController);

  function MainController() {
    var vm = this;
    vm.templates = {
      top: 'partials/top.html'
    };
    vm.name = 'Munim Dibosh';
    vm.professionalTitle = 'Full Stack Software Engineer';
    vm.shortBio = "A passionate geek and design fanatic by nature. Have been engaged in active software development " +
      "for over 5 years now. Managed and developed softwares for across multiple platforms - mobile, desktop and web. " +
      "Working with a team who loves to solve problems that affect millions of lives- is the goal am pursuing right now."
  }


})();
