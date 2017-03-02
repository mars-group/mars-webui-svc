(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MappingController', MappingController);


  /** @ngInject */
  function MappingController($log, $uibModal, Mapping, Metadata, Alert, Scenario, Config, NgTableParams) {
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
    var mappingCompleteMessage = 'Mapping complete!';

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

      if (vm.currentScenario && !angular.equals(vm.currentScenario, {}) && !vm.selectedNode) {
        vm.alerts.add(selectNodeInfoMessage);
      }

      Mapping.getMapping(vm.currentScenario.ScenarioId)
        .then(function (res) {
          if (res.status > 299) {
            $log.error(res);
            vm.alerts.add(res.data.description, 'danger');
            return;
          }

          vm.treeData = res;

          if (vm.selectedNode) {
            recRestoreSelectedNode(vm.treeData);
          }

          expandTopLevelNodes();
        }, function (err) {
          $log.error(err);
          vm.alerts.add(err, 'danger');
        });
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
        // selectFirstField(vm.selectedNode);
        // setDataFilter(vm.selectedNode);

        // select global parameters
        // vm.selectedNode = vm.treeData[2].Agents[1];
        // vm.alerts.remove(selectNodeInfoMessage);
      }
    };

    var recRestoreSelectedNode = function (treeData) {
      var hasFullname = treeData.hasOwnProperty('FullName') && vm.selectedNode.hasOwnProperty('FullName');
      var hasParameters = treeData.hasOwnProperty('Parameters') && vm.selectedNode.hasOwnProperty('Parameters');
      var hasEqualNames = treeData.Name === vm.selectedNode.Name;
      var hasEqualFullNames = treeData.FullName === vm.selectedNode.FullName;

      var isMapping = hasFullname && !hasParameters && hasEqualFullNames;
      var isParameter = !hasFullname && hasParameters && hasEqualNames;

      if (isParameter) {
        vm.selectedField = treeData;
      }

      if (isMapping || isParameter) {
        vm.selectedNode = treeData;
        return;
      }

      angular.forEach(treeData, function (value) {
        if (angular.isObject(value) || angular.isArray(value)) {
          recRestoreSelectedNode(value);
        }
      });
    };

    loadMapping();

    var loadMappingDatasets = function () {
      var params = {
        states: ['FINISHED']
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
          vm.tableParams = new NgTableParams({}, {dataset: res});
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

      var dataFilter;
      switch (node.LayerType) {
        case 'BasicLayers':
          dataFilter = 'TABLE_BASED';
          break;
        case 'TimeSeriesLayers':
          dataFilter = 'TIME_SERIES';
          break;
        case 'GeoPotentialFieldLayers':
          dataFilter = 'GEO_POTENTIAL_FIELD';
          break;
        case 'GridPotentialFieldLayers':
          dataFilter = 'GRID_POTENTIAL_FIELD';
          break;
        case 'ObstacleLayers':
          dataFilter = 'OBSTACLE_LAYER';
          break;
        case 'GISLayers':
          dataFilter = 'GIS';
          break;
      }
      var columnName = 'type';

      vm.tableParams.filter()[columnName] = dataFilter;
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

        // This is used for temporary display only.
        vm.selectedField.layerName = dataset.title;

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
      Mapping.putMapping(angular.copy(vm.treeData), vm.currentScenario.ScenarioId, function (err) {
        if (err) {
          vm.alerts.add(err.config.url + '" caused the following error: "' + err.data.description + '"!', 'danger');
        }
        loadMapping();
        Mapping.putParameter(vm.treeData, vm.currentScenario.ScenarioId, function (err) {
          if (err) {
            vm.alerts.add(err.config.url + '" caused the following error: "' + err.data.description + '"!', 'danger');
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
            vm.alerts.remove(mappingCompleteMessage);
            return;
          }
          vm.alerts.add(res.error, 'danger');
          return;
        }

        vm.validationErrors = null;
        vm.alerts.add(mappingCompleteMessage, 'success');
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

      if (field.Value) {
        return 'manual';
      }

      if (field.ColumnClearName) {
        if (field.layerName) {
          return field.layerName + ' / ' + field.ColumnClearName;
        } else {
          return field.ColumnClearName;
        }
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

    // convert date format for the date picker to utcString
    vm.onTimeSet = function (field, newDate) {
      var date = new Date(newDate);
      field.Value = date.toISOString();
    };

  }
})();
