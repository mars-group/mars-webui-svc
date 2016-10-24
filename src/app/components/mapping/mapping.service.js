(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Mapping', function Mapping($http, $log, Scenario) {
      return function Mapping() {
        var vm = this;

        var originalData = [];

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
              originalData = angular.copy(res.data);

              $log.info('loaded data:', originalData.InitializationDescription);

              return convertToLocalStructure(res.data);
            })
            .catch(function errorCallback(res) {
              return res;
            });
        };

        vm.saveMapping = function (data) {
          var mapping = convertToRemoteStructure(data);

          removeAngularHashKeyRecursive(mapping);

          var scenarioId = Scenario.getCurrentScenario().ScenarioId;
          if (!scenarioId) {
            return 'Mapping.get(): ' + 'No Scenario selected!';
          }

          // TODO: clean this callback mess up
          saveMapping(scenarioId, mapping.InitializationDescription);
          saveParameters(scenarioId, mapping.ParameterizationDescription);
        };

        var convertToLocalStructure = function (data) {
          return [
            convertInitializationToArray(data.InitializationDescription),
            convertParameterizationToArray(data.ParameterizationDescription)
          ];
        };

        var convertInitializationToArray = function (layerMapping) {
          var tmp = {
            Name: 'Layer',
            Agents: []
          };

          // exclude LogicalChangeTime
          delete layerMapping.LogicalChangeTime;

          // makes sure the object of layerTypes is processed in order
          var layerTypeKeys = Object.keys(layerMapping);
          layerTypeKeys.sort();

          // convert InitializationDescription to array
          angular.forEach(layerTypeKeys, function (layerType) {
            // add layerType to fields
            angular.forEach(layerMapping[layerType], function (layer) {
              layer.LayerType = layerType;
              angular.forEach(layer.Agents, function (agent) {
                agent.LayerType = layerType;
              });
            });

            var tmpLayerType = {
              Name: layerType,
              Agents: layerMapping[layerType]
            };
            tmp.Agents.push(tmpLayerType);
          });

          return tmp;
        };

        var convertParameterizationToArray = function (parameterMapping) {
          var tmp = {
            Name: 'Parameter',
            Agents: []
          };

          // makes sure the object of layerTypes is processed in order
          var parameterTypeKeys = Object.keys(parameterMapping);
          parameterTypeKeys.sort();

          angular.forEach(parameterTypeKeys, function layerTypes(parameterType) {
            if (!angular.equals(parameterType, 'LogicalChangeTime')) {
              // keep global parameters how they are
              var result = parameterMapping[parameterType];
              if (!angular.equals(parameterType, 'Global')) {
                result = {
                  Name: parameterType,
                  Agents: parameterMapping[parameterType]
                };
              }
              tmp.Agents.push(result);
            }
          });

          return tmp;
        };

        var convertToRemoteStructure = function (data) {
          var tmp = angular.copy(originalData);

          var layerData = tmp.InitializationDescription;
          var parameterData = tmp.ParameterizationDescription;

          // remove layerType from fields
          angular.forEach(layerData, function (layerType) {
            angular.forEach(layerType, function (layer) {
              delete layer.LayerType;
              angular.forEach(layer.Agents, function (agent) {
                delete agent.LayerType;
              });
            });
          });

          layerData.BasicLayers = data[0].Agents[0].Agents;
          layerData.GISLayers = data[0].Agents[1].Agents;
          layerData.TimeSeriesLayers = data[0].Agents[2].Agents;

          parameterData.Agents = data[1].Agents[0].Agents;
          parameterData.Global.Parameters = data[1].Agents[1].Parameters;
          parameterData.Layers = data[1].Agents[2].Agents;

          return tmp;
        };

        var saveMapping = function (scenarioId, mapping) {
          $log.info('saving InitializationDescription:', mapping);

          return $http.put('/scenario-management/scenarios/' + scenarioId + '/mapping', mapping)
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
          $log.info('saving ParameterizationDescription:', mapping);

          return $http.put('/scenario-management/scenarios/' + scenarioId + '/parameter', mapping)
            .then(function successCallback(res) {
              $log.info('ParameterizationDescription saved');
              return res.data;
            })
            .catch(function errorCallback(res) {
              $log.error(res);
              return res;
            });
        };

        var removeAngularHashKeyRecursive = function (obj) {
          for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
              if (typeof obj[property] == "object")
                removeAngularHashKeyRecursive(obj[property]);
              else if (angular.equals(property, '$$hashKey')) {
                delete obj[property];
              }
            }
          }
        };

      };
    });

})();
