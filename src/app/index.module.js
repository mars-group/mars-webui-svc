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
      'toggle-switch',

      // our modules
      'angularFileUpload',
      'nemLogging',
      'ui-leaflet',
      'ngTable',
      'treeControl',
      'ngPrettyJson',
      'ui.bootstrap.datetimepicker',
      'ngTagsInput'
    ]);

})();
