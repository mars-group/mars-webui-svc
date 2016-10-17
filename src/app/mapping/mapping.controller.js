(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MappingController', MappingController);

  /** @ngInject */
  function MappingController($log, $scope, Mapping, Metadata, Alert, Scenario) {
    var vm = this;

    var mapping = new Mapping();
    vm.alerts = new Alert();
    vm.metadata = null;
    vm.treeExpandedNodes = [];
    vm.selectedNode = null;
    vm.selectedField = null;
    vm.dataFilter = {};

    var initialInfo = 'Select a Layer on the left. In the appearing area, push the "select" button and match a field ' +
      'with the desired dataset on the right. Alternatively set a manual value, by selecting the checkbox next to ' +
      'the field.';

    vm.alerts.add(initialInfo);

    var removeInitialWarningOnNodeSelection = function () {

      var keyBinding = $scope.$watch(function () {
        return mapping.selectedNode;
      }, function (newValue, oldValue) {
        if (oldValue === null && newValue !== null) {
          vm.alerts.removeByName(initialInfo);
          // clear binding: https://stackoverflow.com/questions/14957614/angularjs-clear-watch
          keyBinding();
        }
      });
    };
    removeInitialWarningOnNodeSelection();

    Scenario.registerOnChangeListener(function () {
      vm.currentScenario = Scenario.getCurrentScenario();
      loadMapping();
    });

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
      if (!Scenario.getCurrentScenario()) {
        vm.alerts.add('Please select a Scenario in the top right corner or create one');
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
    };

    var loadMappingDatasets = function () {
      Metadata.getAll(function getAllFinishedImports(res) {
        var metadata = [];
        angular.forEach(res.data, function (element) {
          if (angular.equals(element.state, 'FINISHED') &&
            angular.equals(element.type, 'TIME_SERIES') || angular.equals(element.type, 'TABLE_BASED')) {
            // writes to tmp to prevent constant refreshing in the view
            metadata.push(element);
          }
        });
        vm.metadata = metadata;
      });
    };
    loadMappingDatasets();

    vm.onNodeSelection = function (node) {
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
      console.log(node.LayerType);
      switch (node.LayerType) {
        case 'BasicLayers':
          vm.dataFilter.type = 'TABLE_BASED';
          break;
        case 'TimeSeriesLayers':
          vm.dataFilter.type = 'TIME_SERIES';
          break;
      }
    };

    var selectNextField = function () {
      // TODO: implement
    };

    vm.resetField = function (field) {
      field.TableName = null;
      field.ColumnName = null;
      field.ColumnClearName = null;
      field.Value = null;
    };

    vm.createMapping = function (dataset, index) {
      if (!vm.selectedField) {
        vm.alerts.add('You need to select a field first.', 'info');
        return;
      }

      var hasMappingType = vm.selectedField.hasOwnProperty('MappingType');
      var isColumnParameterMapping = vm.selectedField.MappingType === 'ColumnParameterMapping';

      if (hasMappingType && isColumnParameterMapping || !hasMappingType) {
        vm.selectedField.TableName = dataset.additionalTypeSpecificData.tableName;
        vm.selectedField.ColumnName = dataset.additionalTypeSpecificData.columnNames[index].dbCloumnName;
        vm.selectedField.ColumnClearName = dataset.additionalTypeSpecificData.columnNames[index].clearColumnName;
        vm.selectedField.MetaDataId = dataset.dataId;

        if (vm.selectedField.hasOwnProperty('ColumnClearName')) {
          vm.selectedField.ColumnClearName = dataset.additionalTypeSpecificData.columnNames[index].clearColumnName;
        }
      }

      selectNextField();
    };

    vm.save = function () {
      mapping.saveMapping(vm.treeData);
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

  }
})();
