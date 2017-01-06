(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('File', function Scenario($http, $log) {
      var baseUrl = '/file/files/';

      var deleteDataset = function (dataId, callback) {
        var url = baseUrl;
        if (dataId) {
          url += dataId;
        }

        $http.delete(url, {
          transformResponse: []
        })
          .then(function (res) {
            callback(res.data);
          }, function errorCallback(err) {
            $log.error(err);
            callback({error: err});
          });
      };

      return {
        deleteDataset: deleteDataset

      };
    });

})();
