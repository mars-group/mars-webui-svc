(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Mapping', function Mapping($http) {
      return function Mapping() {
        var vm = this;

        var originalData = {};

        var convertToLocalStructure = function (data, callback) {
          var tmpTreeData = [];
          angular.forEach(data.InitializationDescription, function layerTypes(value, key) {
            // there is no continue in JS... too bad
            if (!angular.equals(key, 'LogicalChangeTime')) {
              var layerType = {
                Name: key,
                Agents: value
              };
              tmpTreeData.push(layerType);
            }
          });
          callback(tmpTreeData);
        };

        var convertToRemoteStructure = function (data) {
          var tmp = angular.copy(originalData);

          tmp.InitializationDescription.BasicLayers = data[0].Agents;
          tmp.InitializationDescription.GISLayers = data[1].Agents;
          tmp.InitializationDescription.TimeSeriesLayers = data[2].Agents;

          // remove $$hashKey created by angular
          tmp = angular.copy(tmp);

          return tmp;
        };

        vm.getMapping = function (callback) {
          // TODO: Replace with real backend
          $http.get('app/components/mapping/mapping_mock.json')
            .then(function (res) {
              originalData = res.data;
              convertToLocalStructure(originalData, function (treeData) {
                return callback(treeData);
              });
            });
        };

        vm.setMapping = function (data) {
          var result = convertToRemoteStructure(data);

          if (!angular.equals(result, originalData)) {
            // TODO: Send to backend
          }

        };

      };
    });

})();
