(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Mapping', function Mapping($http) {
      var prepareMappingFieldStructureForTreeView = function (data, callback) {
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

      return {
        getMapping: function (callback) {
          $http.get('app/components/mapping/mapping_mock.json')
            .then(function (res) {
              prepareMappingFieldStructureForTreeView(res.data, function (treeData) {
                return callback(treeData);
              });
            });
        }
      };
    });

})();
