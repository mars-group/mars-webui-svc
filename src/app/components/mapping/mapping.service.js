(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Mapping', function Mapping($http, $log, Scenario) {
      return function Mapping() {
        var vm = this;

        var originalData = {};

        var convertToLocalStructure = function (data) {
          var tmpTreeData = [];
          angular.forEach(data.InitializationDescription, function layerTypes(value, key) {
            // there is no continue in JS... too bad
            if (!angular.equals(key, 'LogicalChangeTime')) {
              var layerType = {
                Name: key,
                Agents: value
              };
              tmpTreeData.push(layerType);
            }
          });
          return tmpTreeData;
        };

        var convertToRemoteStructure = function (data) {
          var tmp = angular.copy(originalData);

          tmp.InitializationDescription.BasicLayers = data[0].Agents;
          tmp.InitializationDescription.GISLayers = data[1].Agents;
          tmp.InitializationDescription.TimeSeriesLayers = data[2].Agents;

          // remove $$hashKey created by angular
          tmp = angular.copy(tmp);

          return tmp;
        };

        vm.getMapping = function () {
          var scenarioId = Scenario.getCurrentScenario().ScenarioId;
          if (!scenarioId) {
            return 'Mapping.get(): ' + 'No Scenario selected!';
          }

          // return $http.get('app/components/mapping/mapping_mock.json')
          return $http.get('scenario-management/scenarios/' + scenarioId)
            .then(function successCallback(res) {
              return convertToLocalStructure(res.data);
            })
            .catch(function errorCallback(res) {
              return res;
            });
        };

        vm.saveMapping = function (data) {
          var mapping = convertToRemoteStructure(data);

          var scenarioId = Scenario.getCurrentScenario().ScenarioId;
          if (!scenarioId) {
            return 'Mapping.get(): ' + 'No Scenario selected!';
          }

          $http.put('/scenario-management/scenarios/' + scenarioId + '/mapping', mapping)
            .then(function successCallback(res) {
              return res.data;
            })
            .catch(function errorCallback(res) {
              $log.error(res);
              return {
                error: 'Mapping.saveMapping(): ' + res.status + ': ' + res.statusText
              };
            });

        };

      };
    });

})();
