(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MappingController', MappingController);

  /** @ngInject */
  function MappingController(Mapping, Metadata, Alert) {
    var vm = this;

    var DEV_EDITION = true;

    var mapping = new Mapping();
    vm.alerts = new Alert();
    vm.metadata = null;
    vm.treeExpandedNodes = [];
    vm.selectedNode = null;
    vm.selectedField = null;


    if (!DEV_EDITION) {
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
      if (DEV_EDITION) {
        vm.treeExpandedNodes.push(vm.treeData[0].Agents[0]);
        // vm.selectedNode = vm.treeData[0].Agents[0].Agents[0];
        vm.selectedNode = vm.treeData[2].Agents[0];
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
          if (angular.equals(element.state, 'FINISHED') && !angular.equals(element.type, 'MODEL')) {
            // writes to tmp to prevent constant refreshing in the view
            metadata.push(element);
          }
        });
        vm.metadata = metadata;
      });
    };
    loadMappingDatasets();

    vm.toggleManuallyValue = function (field) {
      if (field.override) {
        field.TableName = null;
      } else {
        field.Value = null;
      }
    };

    vm.createMapping = function (dataset) {
      if (vm.selectedField) {
        vm.selectedField.TableName = dataset.title;
      } else {
        vm.alerts.add('You need to select a field first.', 'info');
      }
    };

    vm.save = function () {
      mapping.setMapping(vm.treeData);
    };

  }
})();
