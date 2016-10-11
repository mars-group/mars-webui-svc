(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Scenario', function Scenario($http, $log, $window) {
      // TODO: persist in cookie
      var currentScenario = {};
      var onChangeListener = [];

      return {
        getScenarios: function loadScenarios(scenario, callback) {
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

        postScenario: function createScenario(scenario, callback) {
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
          $window.sessionStorage.setItem('curScenario', JSON.stringify(scenario));
          for (var i = 0; i < onChangeListener.length; i++) {
            onChangeListener[i]();
          }
        },

        clearScenarioSelection: function () {
          currentScenario = {};
          $window.sessionStorage.removeItem('curScenario');
          for (var i = 0; i < onChangeListener.length; i++) {
            onChangeListener[i]();
          }
        },

        getCurrentScenario: function () {
          if (currentScenario.name === undefined && $window.sessionStorage.getItem('curScenario') !== undefined) {
            currentScenario = JSON.parse($window.sessionStorage.getItem('curScenario'));
          }
          return currentScenario;
        },

        registerOnChangeListener: function (callback) {
          onChangeListener.push(callback);
        }

      };
    });

})();
