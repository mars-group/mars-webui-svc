(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MappingController', MappingController);

  /** @ngInject */
  function MappingController(Mapping) {
    var vm = this;

    vm.data = null;
    vm.selectedNode = null;
    vm.selectedAgent = null;
    vm.treeExpandedNodes = [];


    Object.prototype.renameProperty = function (oldName, newName) {
      if (oldName == newName) {
        return this;
      }

      if (this.hasOwnProperty(oldName)) {
        this[newName] = this[oldName];
        delete this[oldName];
      }
      return this;
    };

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

          layerType.children[key2].renameProperty('Agents', 'children');
        });

        tmpTreeData.push(layerType);
      });

      vm.treeData = tmpTreeData;
      callback();
    };

    var configureTreeView = function () {
      angular.forEach(vm.treeData, function (value, key) {
        vm.treeExpandedNodes.push(value);
      });

      // for debugging only
      vm.selectedNode = vm.treeData[0].children[1].children[0];
      vm.treeExpandedNodes = [vm.treeData[0], vm.treeData[1], vm.treeData[2], vm.treeData[0].children[1]];
    };

    vm.save = function () {
      console.log(vm.data);
      // TODO: write data back to original structure
    };

    vm.startMapping = function (agent) {
      vm.selectedAgent = agent;
      console.log('selectedAgent:', agent);
    };

  }

})();
