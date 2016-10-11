(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MappingController', MappingController);

  /** @ngInject */
  function MappingController(Mapping, Metadata, Alert, $log) {
    var vm = this;

    vm.DEV_MODE = true;

    var mapping = new Mapping();
    vm.alerts = new Alert();
    vm.metadata = null;
    vm.treeExpandedNodes = [];
    vm.selectedNode = null;
    vm.selectedField = null;


    if (!vm.DEV_MODE) {
      vm.alerts.add('Select a Layer on the left. In the appearing area, push the "select" button and match a field ' +
        'with the desired dataset on the right. Alternatively set a manual value, by selecting the checkbox next to ' +
        'the field.');
    }

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

    var loadMappingFields = function () {
      mapping.getMapping(function (mapping) {
        vm.treeData = mapping;
        configureTreeView();
      });
    };
    loadMappingFields();

    var configureTreeView = function () {
      expandTopLevelNodes();

      // for debugging only
      if (vm.DEV_MODE) {
        vm.treeExpandedNodes.push(vm.treeData[0].Agents[0]);
        vm.selectedNode = vm.treeData[0].Agents[0].Agents[0];
        // vm.selectedNode = vm.treeData[2].Agents[0];

        vm.selectFirstField(vm.selectedNode);
      }
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
            angular.equals(element.type, 'TIME_SERIES') ||  angular.equals(element.type, 'TABLE_BASED')) {
            // writes to tmp to prevent constant refreshing in the view
            metadata.push(element);
          }
        });
        vm.metadata = metadata;
      });
    };
    loadMappingDatasets();

    vm.selectFirstField = function (node) {
      if (node.hasOwnProperty('ConstructorParameterMapping')) {
        vm.selectedField = node.ConstructorParameterMapping[0];
      } else {
        vm.selectedField = node;
      }
    };

    var selectNextField = function () {
      // TODO: implement
    };

    vm.resetField = function (field) {
      field.TableName = null;
      field.ColumnName = null;
      field.Value = null;
    };

    vm.createMapping = function (dataset, index) {
      if (!vm.selectedField) {
        vm.alerts.add('You need to select a field first.', 'info');
        return;
      }

      var hasMappingType = vm.selectedField.hasOwnProperty('MappingType');
      var isCollumnParameterMapping = vm.selectedField.MappingType === 'ColumnParameterMapping';

      if (hasMappingType && isCollumnParameterMapping || !hasMappingType) {
        var tmp = angular.copy(vm.selectedField);
        vm.selectedField.TableName = dataset.additionalTypeSpecificData.tableName;
        vm.selectedField.ColumnName = dataset.additionalTypeSpecificData.columnNames[index].dbCloumnName;
        vm.selectedField.MetaDataId = dataset.dataId;

        // tmp.
        vm.selectedField.ColumnName = dataset.additionalTypeSpecificData.columnNames[index].dbCloumnName;

        if (vm.selectedField.hasOwnProperty('ColumnClearName')) {
          vm.selectedField.ColumnClearName = dataset.additionalTypeSpecificData.columnNames[index].clearColumnName;
        }
      }

      selectNextField();
    };


    vm.save = function () {
      mapping.saveMapping(vm.treeData, function (res) {
        if (res.start !== 500) {
          $log.error(res.status, res.statusText);
        }
      });
    };

  }
})();
