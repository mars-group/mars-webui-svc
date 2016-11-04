(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Mapping', function Mapping($http, $log, Scenario) {
      return function Mapping() {
        var vm = this;

        var originalData = [];
        var tmpMapping = null;
        var tmpParameters = null;

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

              $log.info('loaded data:', originalData);

              var localData = convertToLocalStructure(res.data);

              return restoreLocalChanges(localData);
            })
            .catch(function errorCallback(res) {
              return res;
            });
        };

        vm.putMapping = function (data, callback) {
          tmpParameters = angular.copy(data[2]);
          data = convertMappingToRemote(data);
          var mapping = data.InitializationDescription;
          removeAngularHashKeyRecursive(mapping);

          var scenarioId = Scenario.getCurrentScenario().ScenarioId;

          $http.put('/scenario-management/scenarios/' + scenarioId + '/mapping', mapping)
            .then(function successCallback() {
              $log.info('Mapping saved');
              callback();
            })
            .catch(function errorCallback(res) {
              $log.error(res);
              callback(res);
            });
        };

        vm.putParameter = function (data, callback) {
          tmpMapping = [data[0], data[1]];
          data = convertParametersToRemote(data);
          var parameters = data.ParameterizationDescription;
          removeAngularHashKeyRecursive(parameters);

          var scenarioId = Scenario.getCurrentScenario().ScenarioId;

          $http.put('/scenario-management/scenarios/' + scenarioId + '/parameter', parameters)
            .then(function successCallback() {
              $log.info('Parameters saved');
              callback();
            })
            .catch(function errorCallback(res) {
              $log.error(res);
              callback(res);
            });
        };

        var restoreLocalChanges = function (localData) {
          if (tmpMapping) {
            localData[0] = angular.copy(tmpMapping[0]);
            localData[1] = angular.copy(tmpMapping[1]);
          }
          tmpMapping = null;

          if (tmpParameters) {
            localData[2] = angular.copy(tmpParameters);
          }
          tmpParameters = null;

          return localData;
        };

        var convertToLocalStructure = function (data) {
          var initializationDescription = convertMappingToArray(data.InitializationDescription);
          var basicLayers = extractBasicLayers(initializationDescription);
          var otherLayers = removeBasicLayer(initializationDescription);
          var parameters = convertParametersToArray(data.ParameterizationDescription);

          return [basicLayers, otherLayers, parameters];
        };

        var convertMappingToArray = function (layerMapping) {
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
            angular.forEach(layerMapping[layerType], function (layer, index) {
              // move agent mapping one level up
              if (angular.equals(layerType, 'BasicLayers')) {
                layerMapping.BasicLayers[index] = layer.Agents[0];
                layerMapping.BasicLayers[index].LayerName = layer.LayerName;
              }

              // add layerType to fields
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

        var convertParametersToArray = function (parameterMapping) {
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

        var convertMappingToRemote = function (data) {
          var result = angular.copy(originalData);

          var layerData = result.InitializationDescription;
          layerData.BasicLayers = [];
          angular.forEach(data[0].Agents, function (layer) {
            var tmp3 = {
              Agents: [layer],
              LayerName: layer.LayerName
            };

            delete tmp3.Agents[0].LayerName;

            layerData.BasicLayers.push(tmp3);
          });
          // layerData.BasicLayers = data[0].Agents;
          layerData.GISLayers = data[1].Agents[0].Agents;
          layerData.GeoPotentialFieldLayers = data[1].Agents[1].Agents;
          layerData.GridPotentialFieldLayers = data[1].Agents[2].Agents;
          layerData.ObstacleLayers = data[1].Agents[3].Agents;
          layerData.TimeSeriesLayers = data[1].Agents[4].Agents;

          // remove layerType from fields
          angular.forEach(layerData, function (layerType) {
            angular.forEach(layerType, function (layer) {
              delete layer.LayerType;
              angular.forEach(layer.Agents, function (agent) {
                delete agent.LayerType;
              });
            });
          });

          return result;
        };

        var convertParametersToRemote = function (data) {
          var result = angular.copy(originalData);

          var parameterData = result.ParameterizationDescription;
          parameterData.Agents = data[2].Agents[0].Agents;
          parameterData.Global.Parameters = data[2].Agents[1].Parameters;
          parameterData.Layers = data[2].Agents[2].Agents;

          return result;
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

        var extractBasicLayers = function (layers) {
          layers.Agents[0].Name = 'Agent';
          return layers.Agents[0];
        };

        var removeBasicLayer = function (layers) {
          layers.Agents.splice(0, 1);

          return layers;
        };

      };
    });
})();
