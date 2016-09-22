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

    Mapping.getMapping(function (mapping) {
      var tmp = [];
      angular.forEach(mapping, function layerTypes(value, key) {
        tmp.push({
          name: key,
          children: value
        });
      });

      vm.treeData = tmp;
      vm.treeExpandedNodes = [vm.treeData[0], vm.treeData[1], vm.treeData[2]];

      // for debugging only
      vm.selectedNode = vm.treeData[0].children[1];
      console.log('treeData:', vm.treeData);
      console.log('selectedNode', vm.selectedNode);
    });

    vm.save = function () {
      console.log(vm.data);
      // TODO: write data back to original structure
    };

    vm.selectField = function (field) {
      vm.selectedField = field;
      console.log(field);
    };

  }

})();
