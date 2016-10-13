(function () {
  'use strict';


  /**
   * TODO: Clean this whole mess up!
   */
  angular
    .module('marsApp')
    .factory('Mapping', function Mapping($http, $log, Scenario) {
      return function Mapping() {
        var vm = this;

        var originalData = [];

        var convertToLocalStructure = function (data) {
          var tmpTreeData = [{
            Name: 'Layer',
            Agents: []
          }, {
            Name: 'Parameter',
            Agents: []
          }];

          // convert InitializationDescription to array
          angular.forEach(data.InitializationDescription, function layerTypes(value, key) {
            // there is no continue in JS... too bad
            if (!angular.equals(key, 'LogicalChangeTime')) {
              var layerType = {
                Name: key,
                Agents: value
              };
              tmpTreeData[0].Agents.push(layerType);
            }
          });

          // convert ParameterizationDescription to array
          angular.forEach(data.ParameterizationDescription, function layerTypes(value, key) {
            // there is no continue in JS... too bad
            if (!angular.equals(key, 'LogicalChangeTime') && !angular.equals(key, 'Global')) {
              var layerType = {
                Name: key,
                Agents: value
              };
              tmpTreeData[1].Agents.push(layerType);
            }

            //keep global parameters how they are
            if (angular.equals(key, 'Global')) {
              tmpTreeData[1].Agents.push(value);
            }
          });

          return tmpTreeData;
        };

        var convertToRemoteStructure = function (data) {
          var tmp = angular.copy(originalData);

          tmp.InitializationDescription.TimeSeriesLayers = data[0].Agents[0].Agents;
          tmp.InitializationDescription.GISLayers = data[0].Agents[1].Agents;
          tmp.InitializationDescription.BasicLayers = data[0].Agents[2].Agents;

          tmp.ParameterizationDescription.Layers = data[1].Agents[0].Agents;
          tmp.ParameterizationDescription.Global.Parameters = data[1].Agents[1].Parameters;
          tmp.ParameterizationDescription.Agents = data[1].Agents[2].Agents;

          return tmp;
        };

        vm.getMapping = function () {
          var scenarioId;
          if (Scenario.getCurrentScenario()) {
            scenarioId = Scenario.getCurrentScenario().ScenarioId;
          }
          if (!scenarioId) {
            return;
          }

          return $http.get('/scenario-management/scenarios/' + scenarioId)
            .then(function successCallback(res) {
              originalData = res.data;

              $log.info('loaded data:', res.data.ParameterizationDescription);
              return convertToLocalStructure(res.data);
            })
            .catch(function errorCallback(res) {
              return res;
            });
        };

        vm.saveMapping = function (data) {
          var mapping = convertToRemoteStructure(data);

          $log.info('saving:', mapping);

          var scenarioId = Scenario.getCurrentScenario().ScenarioId;
          if (!scenarioId) {
            return 'Mapping.get(): ' + 'No Scenario selected!';
          }

          // TODO: clean this callback mess up
          saveMapping(scenarioId, mapping);
          saveParameters(scenarioId, mapping);
          return 'saving ...';
        };

        var saveMapping = function (scenarioId, mapping) {
          return $http.put('/scenario-management/scenarios/' + scenarioId + '/mapping', mapping.InitializationDescription)
            .then(function successCallback(res) {
              $log.info('InitializationDescription saved');
              return res.data;
            })
            .catch(function errorCallback(res) {
              $log.error(res);
              return res;
            });
        };

        var saveParameters = function (scenarioId, mapping) {
          return $http.put('/scenario-management/scenarios/' + scenarioId + '/parameter', mapping.ParameterizationDescription)
            .then(function successCallback(res) {
              $log.info('ParameterizationDescription saved');
              return res.data;
            })
            .catch(function errorCallback(res) {
              $log.error(res);
              return res;
            });
        };

      };
    });

})();
