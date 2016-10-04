(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MappingController', MappingController);

  /** @ngInject */
  function MappingController(Mapping, Metadata, Alert) {
    var vm = this;

    var DEV_EDITION = true;

    vm.alert = Alert;
    vm.metadata = null;
    vm.treeExpandedNodes = [];
    vm.selectedNode = null;
    vm.selectedField = null;

    if(!DEV_EDITION) {
      vm.alert.add('Select a Layer on the left. In the appearing area, push the "select" button and match a field ' +
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
      Mapping.getMapping(function (mapping) {
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
        vm.selectedNode = vm.treeData[0].Agents[0].Agents[0];
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
          if (angular.equals(element.state, 'FINISHED')) {
            // writes to tmp to prevent constant refreshing in the view
            metadata.push(element);
          }
        });
        vm.metadata = metadata;
      });
    };
    loadMappingDatasets();

    vm.toggleHandsetValue = function (field) {
      if (field.override) {
        field.TableName = null;
      } else {
        field.Value = null;
      }
    };

    vm.createMapping = function (dataset) {
      vm.selectedField.TableName = dataset.title;
    };

    vm.save = function () {
      // TODO: write data back to original structure
      // console.log(vm.selectedNode);
    };

  }
})();
