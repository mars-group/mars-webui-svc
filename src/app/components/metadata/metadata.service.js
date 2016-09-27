(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Metadata', function Scenario($http) {

      var getMetadata = function (dataId, callback) {
        var url = '/metadata/metadata/';
        if(dataId){
          url += dataId;
        }

        $http.get(url).then(function (res) {
          callback(res);
        });
      };


      return {
        getAll: function (callback) {
          getMetadata(null, function (res) {
            callback(res);
          });
        },

        getOne: function (dataId, callback) {
          getMetadata(dataId, function (res) {
            callback(res);
          });
        },

        hasStatusWritten: function (dataId, callback) {
          getMetadata(dataId, function () {
            if (angular.isUndefined(res.state)) {
              if (res.state == 'finished' || res.state == 'preprocessingFinished') {
                callback(true);
              }
            }
            callback(false);
          });
        },

        getDateColumn: function (dataId, callback) {
          $http.get('/metadata/metadata/' + dataId).success(function (res) {
            var pdtc = res.additionalTypeSpecificData.possibleDateTimeColumn;
            if (angular.isUndefined(pdtc)) {
              callback(pdtc);
            }
            callback(false);
          });
        }
      };
    });

})();
