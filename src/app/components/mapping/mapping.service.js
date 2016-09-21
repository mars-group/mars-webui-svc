(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Mapping', function Mapping($http) {
      return {
        getMapping: function (callback) {
          $http.get('app/components/mapping/mapping_mock.json')
            .then(function (res) {
              callback(res.data);
            });
        }
      };
    });

})();
