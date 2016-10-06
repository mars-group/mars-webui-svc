(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Scenario', function Scenario($http, $log) {
      return {
        getScenarios: function (scenario, callback) {

          var config = {
            params: {
              Project: scenario
            },
            headers: {
              'Accept': 'application/json'
            }
          };

          $http.get('/scenario-management/scenarios', config)
            .then(function successCallback(res) {
              callback(res.data);
            }, function errorCallback(err) {
              if (err) {
                $log.error(err);
              }
            });
        },
        postScenario: function (scenario, callback) {
          $http.post('/scenario-management/scenarios', scenario)
            .then(function successCallback(res) {
              callback(res.data);
            }, function errorCallback(err) {
              if (err) {
                $log.error(err);
                callback(err);
              }
            });
        }

      };
    });

})();
