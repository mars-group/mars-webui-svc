(function () {
  'use strict';

  angular
    .module('marsApp', [
      'ngAnimate',
      'ngCookies',
      'ngSanitize',
      'ngMessages',
      'ngAria',
      'ui.router',
      'ui.bootstrap',
      'toastr',

      // our modules
      'angularFileUpload',
      'nemLogging',
      'ui-leaflet',
      'ngTable',
      'treeControl'
    ]);

})();
