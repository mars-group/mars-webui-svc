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

      var getScenarios = function loadScenarios(callback) {
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
      };

      var getScenario = function loadScenarios(id, callback) {
        var config = {
          params: {
            Project: project
          }
        };

        $http.get('/scenario-management/scenarios/' + id, config)
          .then(function successCallback(res) {
            callback(res.data);
          }, function errorCallback(err) {
            if (err) {
              $log.error(err);
              callback({error: err});
            }
          });
      };

      var setCurrentScenario = function (scenario) {
        currentScenario = scenario;
        $window.sessionStorage.setItem('currentScenario', angular.toJson(scenario));
        triggerOnChangeListener();
      };

      var clearScenarioSelection = function () {
        currentScenario = {};
        $window.sessionStorage.removeItem('currentScenario');
        triggerOnChangeListener();
      };

      var getCurrentScenario = function () {
        if (!currentScenario) {
          currentScenario = angular.fromJson($window.sessionStorage.getItem('currentScenario'));
        }
        return currentScenario;
      };

      var isCurrentScenarioExisting = function (callback) {
        if (!currentScenario) {
          return callback(false);
        }

        $http.get('/scenario-management/scenarios/' + currentScenario.ScenarioId)
          .then(function () {
            callback(true);
          })
          .catch(function (err) {
            if (err.status === 404) {
              callback(false);
            } else {
              callback({error: err});
            }
          });
      };

      var isMappingComplete = function (callback) {
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
      };

      var registerOnChangeListener = function (callback) {
        onChangeListener.push(callback);
      };

      return {
        getScenarios: getScenarios,
        getScenario: getScenario,
        setCurrentScenario: setCurrentScenario,
        clearScenarioSelection: clearScenarioSelection,
        getCurrentScenario: getCurrentScenario,
        isCurrentScenarioExisting: isCurrentScenarioExisting,
        isMappingComplete: isMappingComplete,
        registerOnChangeListener: registerOnChangeListener
      };
    });

})();
