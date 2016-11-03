(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MappingController', MappingController);


  /** @ngInject */
  function MappingController($log, Mapping, Metadata, Alert, Scenario, Config) {
    var vm = this;

    Config.isDevelopment(function (res) {
      vm.development = res;
    });

    var mapping = new Mapping();
    vm.alerts = new Alert();
    vm.metadata = null;
    vm.treeExpandedNodes = [];
    vm.selectedNode = null;
    vm.selectedField = null;
    vm.dataFilter = {};

    var selectNodeInfoMessage = 'Select a Layer on the left. In the appearing area, push the "select" button and match a field ' +
      'with the desired dataset on the right. Alternatively set a manual value, by selecting the checkbox next to ' +
      'the field.';
    var selectScenarioInfoMessage = 'Please select a Scenario in the top right corner or create one';


    Scenario.getScenarios(function (scenarios) {
      vm.scenarios = scenarios;
    });

    Scenario.registerOnChangeListener(function () {
      vm.currentScenario = Scenario.getCurrentScenario();
      vm.selectedNode = null;
      vm.selectedField = null;
      loadMapping();
    });

    vm.setCurrentScenario = function () {
      vm.alerts.removeByName(selectScenarioInfoMessage);
      Scenario.setCurrentScenario(vm.currentScenario);
      vm.alerts.add(selectNodeInfoMessage);
    };

    var initMappingData = function () {
      vm.treeOptions = {
        dirSelectable: false,
        nodeChildren: 'Agents',
        isLeaf: function (node) {
          return !node.hasOwnProperty('Agents');
        }
      };
    };
    initMappingData();

    var loadMapping = function () {
      vm.currentScenario = Scenario.getCurrentScenario();
      if (!vm.currentScenario) {
        vm.alerts.add(selectScenarioInfoMessage);
        return;
      }

      mapping.getMapping().then(function (res) {
        if (res.status > 299) {
          $log.error('error:', res);
          return;
        }

        vm.treeData = res;
        configureTreeView();
      });
    };
    loadMapping();

    var configureTreeView = function () {
      expandTopLevelNodes();
    };

    var expandTopLevelNodes = function () {
      angular.forEach(vm.treeData, function (value /*, key*/) {
        vm.treeExpandedNodes.push(value);
      });

      // DEBUGGING ONLY
      if (vm.development) {
        // select Agents
        // vm.selectedNode = vm.treeData[0].Agents[0];
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
        vm.metadata = res;
      });
    };
    loadMappingDatasets();

    vm.onNodeSelection = function (node) {
      vm.alerts.removeByName(selectNodeInfoMessage);

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
      // TODO: implement
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
        vm.selectedField.ColumnName = dataset.additionalTypeSpecificData.columnNames[index].dbCloumnName;
        vm.selectedField.ColumnClearName = dataset.additionalTypeSpecificData.columnNames[index].clearColumnName;
        vm.selectedField.MetaDataId = dataset.dataId;

        if (vm.selectedField.hasOwnProperty('ColumnClearName')) {
          vm.selectedField.ColumnClearName = dataset.additionalTypeSpecificData.columnNames[index].clearColumnName;
        }
      } else {
        vm.selectedField.MetaDataId = dataset.dataId;
        vm.selectedField.ClearName = dataset.title;
      }

      selectNextField();
    };

    vm.createInstanceCountMapping = function (dataset) {
      vm.selectedNode.InstanceCount = dataset.records;
    };

    vm.saveMapping = function () {
      mapping.putMapping(vm.treeData, function (err) {
        if (err) {
          vm.alerts.add('A call to: "' + err.config.url + '" caused the following error: "' + err.data.Description + '"', 'danger');
        } else {
          vm.alerts.add('Mapping saved', 'info');
          loadMapping();
        }
      });
    };

    vm.saveParameter = function () {
      mapping.putParameter(vm.treeData, function (err) {
        if (err) {
          vm.alerts.add('A call to: "' + err.config.url + '" caused the following error: "' + err.data.Description + '"', 'danger');
        } else {
          vm.alerts.add('Parameter saved', 'info');
          loadMapping();
        }
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

  }
})();
