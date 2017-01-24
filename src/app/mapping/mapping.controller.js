(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MappingController', MappingController);


  /** @ngInject */
  function MappingController($log, $uibModal, Mapping, Metadata, Alert, Scenario, Config) {
    var vm = this;

    vm.alerts = new Alert();
    vm.metadata = null;
    vm.treeExpandedNodes = [];
    vm.selectedNode = null;
    vm.selectedField = null;
    vm.dataFilter = {};
    vm.currentScenario = Scenario.getCurrentScenario();
    vm.validationErrors = null;

    Config.isDevelopment(function (res) {
      vm.development = res;
    });

    var selectNodeInfoMessage = 'Select a Layer on the left. In the appearing area, push the "select" button and match a field ' +
      'with the desired dataset on the right. Alternatively set a manual value, by selecting the checkbox next to ' +
      'the field.';
    var selectScenarioInfoMessage = 'Please select a Scenario in the top right corner or create one';

    Scenario.isCurrentScenarioExisting(function (res) {
      if (res.hasOwnProperty('error')) {
        $log.error(res.error);
      }

      if (!res) {
        Scenario.clearScenarioSelection();
      }

      if (vm.currentScenario && !angular.equals(vm.currentScenario, {}) && !vm.selectedNode) {
        vm.alerts.add(selectNodeInfoMessage);
      }
    });

    Scenario.getScenarios(function (res) {
      if (res.hasOwnProperty('error')) {
        var err = res.error;
        if (err.status === 500 && err.data.message === 'Forwarding error') {
          vm.alerts.add('There is no instance of "Scenario service", so there is nothing to display!', 'danger');
        } else {
          $log.error(err, 'danger');
        }
      } else {
        vm.scenarios = res;
      }
    });

    Scenario.registerOnChangeListener(function () {
      vm.currentScenario = Scenario.getCurrentScenario();
      vm.selectedNode = null;
      vm.selectedField = null;
      loadMapping();
    });

    vm.setCurrentScenario = function () {
      vm.alerts.remove(selectScenarioInfoMessage);
      Scenario.setCurrentScenario(vm.currentScenario);
      vm.alerts.add(selectNodeInfoMessage);
    };

    var initMappingData = function () {
      vm.treeOptions = {
        dirSelectable: false,
        allowDeselect: false,
        nodeChildren: 'Agents',
        isLeaf: function (node) {
          return !node.hasOwnProperty('Agents');
        }
      };
    };
    initMappingData();

    var loadMapping = function () {
      if (!vm.currentScenario || angular.equals(vm.currentScenario, {})) {
        vm.alerts.add(selectScenarioInfoMessage);
        return;
      }

      Mapping.getMapping()
        .then(function (res) {
          if (res.status > 299) {
            $log.error('error:', res);
            return;
          }

          if (vm.selectedNode) {
            applyMappingDiff(res);
          } else {
            vm.treeData = res;
          }

          configureTreeView();
        }, function (err) {
          $log.error(err);
        });
    };
    loadMapping();

    // Jep, I know what you are thinking... However replacing the new data with the old causes #MARS-847
    var applyMappingDiff = function (newData) {
      angular.forEach(newData, function (layerTypeVal, layerTypeKey) {
        angular.forEach(layerTypeVal.Agents, function (layerVal, layerKey) {

          angular.forEach(layerVal.Agents, function (agentVal, agentKey) {
            if (agentVal.hasOwnProperty('ConstructorParameterMapping')) {
              // Agent mapping
              angular.forEach(agentVal.ConstructorParameterMapping, function (constructorVal, constructorKey) {
                angular.forEach(constructorVal, function (fieldVal, fieldKey) {
                  vm.treeData[layerTypeKey]
                    .Agents[layerKey]
                    .Agents[agentKey]
                    .ConstructorParameterMapping[constructorKey]
                    [fieldKey] = fieldVal;
                });
              });
            } else if (!agentVal.hasOwnProperty('Parameters')) {
              // Layer mapping
              angular.forEach(agentVal, function (layerFieldVal, layerFieldKey) {
                vm.treeData[layerTypeKey]
                  .Agents[layerKey]
                  .Agents[agentKey]
                  [layerFieldKey] = layerFieldVal;
              });
            }
          });

          if (layerVal.hasOwnProperty('Name') &&
            layerVal.Name === 'Agents' || layerVal.Name === 'Global' || layerVal.Name === 'Layers') {

            if (layerVal.hasOwnProperty('Parameters')) {
              // Global parameters
              angular.forEach(layerVal.Parameters, function (globalParameterVal, globalParameterKey) {
                angular.forEach(globalParameterVal, function (globalParameterFieldVal, globalParameterFieldKey) {
                  if (!angular.isObject(globalParameterFieldVal)) {
                    vm.treeData[layerTypeKey]
                      .Agents[layerKey]
                      .Parameters[globalParameterKey]
                      [globalParameterFieldKey] = globalParameterFieldVal;
                  }
                });
              });
            } else {
              // Agent and Layer parameters
              angular.forEach(layerVal.Agents, function (parameterLayerTypeVal, parameterLayerTypeKey) {
                angular.forEach(parameterLayerTypeVal.Parameters, function (parameterLayerVal, parameterLayerKey) {
                  angular.forEach(parameterLayerVal, function (parameterVal, parameterKey) {
                    vm.treeData[layerTypeKey]
                      .Agents[layerKey]
                      .Agents[parameterLayerTypeKey]
                      .Parameters[parameterLayerKey]
                      [parameterKey] = parameterVal;
                  });
                });
              });
            }
          }
        });
      });
    };

    var configureTreeView = function () {
      expandTopLevelNodes();
    };

    var expandTopLevelNodes = function () {
      angular.forEach(vm.treeData, function (value) {
        vm.treeExpandedNodes.push(value);
      });

      // DEBUGGING ONLY
      if (vm.development) {
        // select Agents
        // vm.treeExpandedNodes.push(vm.treeData[0].Agents[0]);
        // vm.selectedNode = vm.treeData[0].Agents[0].Agents[0];
        // selectFirstField(vm.selectedNode);
        // setDataFilter(vm.selectedNode);

        // select layer
        // vm.treeExpandedNodes.push(vm.treeData[1].Agents[1]);
        // vm.selectedNode = vm.treeData[1].Agents[1].Agents[0];
        // setDataFilter(vm.selectedNode);

        // select global parameters
        // vm.selectedNode = vm.treeData[2].Agents[1];
      }
    };

    var loadMappingDatasets = function () {
      var params = {
        states: 'FINISHED'
      };

      Metadata.getFiltered(params, function (res) {
        if (res.hasOwnProperty('error')) {
          var err = res.error;
          if (err.status === 500 && err.data.message === 'Forwarding error') {
            vm.alerts.add('There is no instance of "Metadata service", so there is nothing to display!', 'danger');
          } else {
            vm.alerts.add(err, 'danger');
          }
        } else {
          vm.metadata = res;
        }
      });
    };
    loadMappingDatasets();

    vm.onNodeSelection = function (node) {
      vm.alerts.remove(selectNodeInfoMessage);

      selectFirstField(node);
      setDataFilter(node);
    };

    var selectFirstField = function (node) {
      if (node.hasOwnProperty('ConstructorParameterMapping')) {
        vm.selectedField = node.ConstructorParameterMapping[0];
      } else {
        vm.selectedField = node;
      }
    };

    var setDataFilter = function (node) {
      switch (node.LayerType) {
        case 'BasicLayers':
          vm.dataFilter.type = 'TABLE_BASED';
          break;
        case 'TimeSeriesLayers':
          vm.dataFilter.type = 'TIME_SERIES';
          break;
        case 'GeoPotentialFieldLayers':
          vm.dataFilter.type = 'GEO_POTENTIAL_FIELD';
          break;
        case 'GridPotentialFieldLayers':
          vm.dataFilter.type = 'GRID_POTENTIAL_FIELD';
          break;
        case 'ObstacleLayers':
          vm.dataFilter.type = 'OBSTACLE_LAYER';
          break;
        case 'GISLayers':
          vm.dataFilter.type = 'GIS';
          break;
      }
    };

    var selectNextField = function () {
      var fields = vm.selectedNode.ConstructorParameterMapping;

      // return, if the selected layer is no basic layer
      if (typeof fields === 'undefined') {
        return;
      }

      for (var i = 0; i < fields.length - 1; i++) {
        if (fields[i].Name === vm.selectedField.Name) {
          vm.selectedField = fields[i + 1];
          break;
        }
      }
    };

    vm.resetField = function (field) {
      if (field.hasOwnProperty('InstanceCount')) {
        field.InstanceCount = null;
        return;
      }
      field.TableName = null;
      field.ColumnName = null;
      field.ClearName = null;
      field.ColumnClearName = null;
      field.Value = null;
      field.MetaDataId = null;
    };

    vm.createMapping = function (dataset, index) {
      if (!vm.selectedField) {
        vm.alerts.add('You need to select a field first.', 'info');
        return;
      }

      var hasMappingType = vm.selectedField.hasOwnProperty('MappingType');
      var isColumnParameterMapping = vm.selectedField.MappingType === 'ColumnParameterMapping';

      if ((hasMappingType && isColumnParameterMapping || !hasMappingType) && dataset.additionalTypeSpecificData) {
        vm.selectedField.TableName = dataset.additionalTypeSpecificData.tableName;
        vm.selectedField.ColumnName = dataset.additionalTypeSpecificData.columnNames[index].dbColumnName;
        vm.selectedField.ColumnClearName = dataset.additionalTypeSpecificData.columnNames[index].clearColumnName;
        vm.selectedField.MetaDataId = dataset.dataId;

        // TODO: fix duplicate ColumnClearName and dataId assignment.
        if (vm.selectedField.hasOwnProperty('ColumnClearName')) {
          vm.selectedField.ColumnClearName = dataset.additionalTypeSpecificData.columnNames[index].clearColumnName;
        }
      } else {
        vm.selectedField.MetaDataId = dataset.dataId;
        vm.selectedField.ClearName = dataset.title;
      }

      vm.createInstanceCountMapping(dataset);
      selectNextField();
    };

    vm.createInstanceCountMapping = function (dataset) {
      vm.selectedNode.InstanceCount = dataset.records;
    };

    vm.saveMapping = function () {
      Mapping.putMapping(angular.copy(vm.treeData), function (err) {
        if (err) {
          vm.alerts.add(err.config.url + '" caused the following error: "' + err.data.Description + '"!', 'danger');
        }
        loadMapping();
        Mapping.putParameter(vm.treeData, function (err) {
          if (err) {
            vm.alerts.add(err.config.url + '" caused the following error: "' + err.data.Description + '"!', 'danger');
          }

          loadMapping();
          getMappingComplete();
        });
      });
    };

    var getMappingComplete = function () {
      Scenario.getMappingComplete(function (res) {
        if (res.hasOwnProperty('error')) {
          if (res.error.status === 412) {
            vm.validationErrors = res.error.data;
            return;
          }
          vm.alerts.add(res.error, 'danger');
          return;
        }

        vm.validationErrors = null;
        vm.alerts.add('Mapping complete!', 'success');
      });
    };

    vm.addParameter = function () {
      var parameter = {
        "Name": '',
        "Value": ''
      };
      vm.selectedNode.Parameters.push(parameter);
    };

    vm.removeParameter = function (parameter) {
      vm.selectedNode.Parameters.splice(vm.selectedNode.Parameters.indexOf(parameter), 1);
    };

    /**
     * @return {string}
     */
    vm.SelectValue = function (field) {
      if (!field) {
        return 'select';
      }

      if (field.ColumnClearName) {
        return field.ColumnClearName;
      } else if (field.ClearName) {
        return field.ClearName;
      } else if (field.InstanceCount) {
        return field.InstanceCount;
      } else {
        return 'select';
      }
    };

    vm.openErrorModal = function () {
      var settings = {
        templateUrl: 'app/mapping/validationErrorModal/validationErrorModal.html',
        controller: 'MappingModalController',
        controllerAs: 'mappingModal',
        resolve: {mappingErrors: vm.validationErrors},
        size: 'lg'
      };

      var modalInstance = $uibModal.open(settings);

      modalInstance.result.then(function () {
      }, function () {
      });
    };

  }
})();
