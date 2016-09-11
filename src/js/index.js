(function () {
  'use strict';

  // controllers
  angular
    .module('portfolioApp.controllers', []);

  // services
  angular
    .module('portfolioApp.services', []);

  // config
  angular
    .module('portfolioApp.config', []);

  // app definition
  angular
    .module('portfolioApp', [
      'portfolioApp.controllers',
      'portfolioApp.services',
      'portfolioApp.config',
      'ui.router',
      'toastr'
    ]);



})();
