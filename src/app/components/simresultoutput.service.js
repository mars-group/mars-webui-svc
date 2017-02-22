(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('SimResultOutput', function Scenario() {

      return {
        getWebanalyticsLink: function (simId) {
          return "/webanalytics/#/?simId=" + simId;
        }
      };
    });
})();
