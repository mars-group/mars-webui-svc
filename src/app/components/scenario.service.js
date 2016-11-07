(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Scenario', function Scenario($http, $log, $window, Project) {
      var currentScenario = null;
      var onChangeListener = [];

      var project = Project.getCurrentProject().id;

      var triggerOnChangeListener = function () {
        for (var i = 0; i < onChangeListener.length; i++) {
          onChangeListener[i]();
        }
      };

      return {
        getScenarios: function loadScenarios(callback) {
          var config = {
            params: {
              Project: project
            }
          };

          $http.get('/scenario-management/scenarios', config)
            .then(function successCallback(res) {
              callback(res.data);
            }, function errorCallback(err) {
              if (err) {
                $log.error(err);
                callback({error: err});
              }
            });
        },

        postScenario: function createScenario(scenario, callback) {
          $http.post('/scenario-management/scenarios', scenario)
            .then(function successCallback(res) {
              triggerOnChangeListener();
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
          $window.sessionStorage.setItem('currentScenario', angular.toJson(scenario));
          triggerOnChangeListener();
        },

        clearScenarioSelection: function () {
          currentScenario = {};
          $window.sessionStorage.removeItem('currentScenario');
          triggerOnChangeListener();
        },

        getCurrentScenario: function () {
          if (currentScenario && angular.isUndefined(currentScenario.name) &&
            angular.isDefined($window.sessionStorage.getItem('currentScenario'))) {
            currentScenario = angular.fromJson($window.sessionStorage.getItem('currentScenario'));
          }
          return currentScenario;
        },

        isMappingComplete: function (callback) {
          if (!currentScenario) {
            $log.error('no Scenario selected');
          }
          $http.get('/scenario-management/scenarios/' + currentScenario.ScenarioId + '/complete')
            .then(function successCallback(res) {
              if (res.status >= 200 && res.status < 300) {
                callback(true);
              }
            })
            .catch(function errorCallback(err) {
              $log.info(err);
              callback(false);
            });
        },

        registerOnChangeListener: function (callback) {
          onChangeListener.push(callback);
        }

      };
    });

})();
