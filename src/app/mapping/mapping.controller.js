(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MappingController', MappingController);

  /** @ngInject */
  function MappingController(Mapping, Metadata) {
    var vm = this;

    vm.data = null;
    vm.metadata = null;
    vm.treeExpandedNodes = [];
    vm.selectedNode = null;
    vm.selectedField = null;


    var initMappingData = function () {
      vm.treeOptions = {
        dirSelectable: false,
        isLeaf: function (node) {
          return !node.hasOwnProperty('children');
        }
      };
    };
    initMappingData();

    var loadFieldsToMap = function () {
      Mapping.getMapping(function (mapping) {
        vm.data = mapping;
        prepareMappingFieldStructureForTreeView(configureTreeView);
      });
    };
    loadFieldsToMap();


    var prepareMappingFieldStructureForTreeView = function (callback) {
      var tmpTreeData = [];

      angular.forEach(vm.data, function layerTypes(value, key) {
        var layerType = {
          Name: key,
          children: value
        };

        angular.forEach(layerType.children, function layers(value2, key2) {

          renameProperty(layerType.children[key2], 'Agents', 'children');
        });

        tmpTreeData.push(layerType);
      });

      vm.treeData = tmpTreeData;
      callback();
    };

    var renameProperty = function (objRef, oldName, newName) {
      if (oldName == newName) {
        return objRef;
      }

      if (objRef.hasOwnProperty(oldName)) {
        objRef[newName] = objRef[oldName];
        delete objRef[oldName];
      }
      return objRef;
    };

    var configureTreeView = function () {
      angular.forEach(vm.treeData, function (value /*, key*/) {
        vm.treeExpandedNodes.push(value);
      });

      // for debugging only
      vm.selectedNode = vm.treeData[0].children[1].children[0];
      vm.treeExpandedNodes = [vm.treeData[0], vm.treeData[1], vm.treeData[2], vm.treeData[0].children[1]];
    };

    Metadata.getAll(function getAllFinishedImports(res) {
      var metadata = [];
      angular.forEach(res.data, function (element) {
        if (angular.equals(element.state, 'FINISHED')) {
          metadata.push(element);
        }
      });
      vm.metadata = metadata;
    });

    vm.createMapping = function (dataset) {
      vm.selectedField.TableName =  dataset.title;
    };

    vm.save = function () {
      // console.log(vm.data);
      // TODO: write data back to original structure
    };

  }

})();
