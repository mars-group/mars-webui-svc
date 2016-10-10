(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Scenario', function Scenario($http, $log) {
      // TODO: persist in cookie
      var currentScenario = {};

      return {
        getScenarios: function loadScenarios (scenario, callback) {
          var config = {
            params: {
              Project: scenario
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
        postScenario: function createScenario (scenario, callback) {
          $http.post('/scenario-management/scenarios', scenario)
            .then(function successCallback(res) {
              callback(res.data);
            }, function errorCallback(err) {
              if (err) {
                $log.error(err);
                callback(err);
              }
            });
        },
        setCurrentScenario: function (scenario) {
          currentScenario = scenario;
        },
        getCurrentScenario: function () {
          return currentScenario;
        }

      };
    });

})();
