(function () {

  'use strict';

  angular
    .module('marsApp')
    .factory('Scenario', function Scenario($http) {
      return {
        getScenarios: function (project, callback) {

          var config = {
            params: {
              Project: project
            },
            headers: {
              'Accept': 'application/json'
            }
          };

          $http.get('/scenario-management/scenarios', config).success(function (res) {
            return callback(res);
          });
        }
      };
    });

})();
