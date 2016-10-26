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

        vm.putMapping = function (mapping, callback) {
          mapping = convertToRemoteStructure(mapping);
          mapping = mapping.InitializationDescription;
          removeAngularHashKeyRecursive(mapping);
          $log.info('saving InitializationDescription:', mapping);

          var scenarioId = Scenario.getCurrentScenario().ScenarioId;

          $http.put('/scenario-management/scenarios/' + scenarioId + '/mapping', mapping)
            .then(function successCallback() {
              $log.info('InitializationDescription saved');
              callback();
            })
            .catch(function errorCallback(res) {
              $log.error(res);
              callback(res);
            });
        };

        vm.putParameter = function (mapping, callback) {
          mapping = convertToRemoteStructure(mapping);
          mapping = mapping.ParameterizationDescription;
          removeAngularHashKeyRecursive(mapping);
          $log.info('saving ParameterizationDescription:', mapping);

          var scenarioId = Scenario.getCurrentScenario().ScenarioId;

          $http.put('/scenario-management/scenarios/' + scenarioId + '/parameter', mapping)
            .then(function successCallback() {
              $log.info('ParameterizationDescription saved');
              callback();
            })
            .catch(function errorCallback(res) {
              $log.error(res);
              callback(res);
            });
        };

        var convertToLocalStructure = function (data) {
          var initializationDescription = convertInitializationToArray(data.InitializationDescription);
          var basicLayers = extractBasicLayers(initializationDescription);
          var otherLayers = removeBasicLayer(initializationDescription);
          var parameters = convertParameterizationToArray(data.ParameterizationDescription);

          return [basicLayers, otherLayers, parameters];
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

        var extractBasicLayers = function (layers) {
          layers.Agents[0].Name = 'Agent';
          return layers.Agents[0];
        };

        var removeBasicLayer = function (layers) {
          layers.Agents.splice(0, 1);

          return layers;
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

          layerData.BasicLayers = data[0].Agents;

          layerData.GISLayers = data[1].Agents[0].Agents;
          layerData.GeoPotentialFieldLayers = data[1].Agents[1].Agents;
          layerData.GridPotentialFieldLayers = data[1].Agents[2].Agents;
          layerData.ObstacleLayers = data[1].Agents[3].Agents;
          layerData.TimeSeriesLayers = data[1].Agents[4].Agents;

          parameterData.Agents = data[2].Agents[0].Agents;
          parameterData.Global.Parameters = data[2].Agents[1].Parameters;
          parameterData.Layers = data[2].Agents[2].Agents;

          return tmp;
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
