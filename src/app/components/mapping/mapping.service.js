(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Mapping', function Mapping($http) {
      var prepareMappingFieldStructureForTreeView = function (data, callback) {
        var tmpTreeData = [];

        angular.forEach(data.InitializationDescription, function layerTypes(value, key) {
          if (!angular.equals(key, 'LogicalChangeTime')) {

            var layerType = {
              Name: key,
              children: value
            };

            angular.forEach(layerType.children, function layers(value2, key2) {
              renameProperty(layerType.children[key2], 'Agents', 'children');
            });

            tmpTreeData.push(layerType);
          }
        });

        callback(tmpTreeData);
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
