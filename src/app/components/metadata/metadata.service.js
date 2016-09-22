(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Metadata', function Scenario($http) {
      return {
        hasStatusWritten: function (dataId, callback) {
          $http.get('/metadata/metadata/' + dataId).success(function (res) {
            if (angular.isUndefined(res.state)) {
              if (res.state == 'finished' || res.state == 'preprocessingFinished') {
                return callback(true);
              }
            }
            return callback(false);
          });
        },

        getPossibleDateColumn: function (dataId, callback) {
          $http.get('/metadata/metadata/' + dataId).success(function (res) {
            var pdtc = res.additionalTypeSpecificData.possibleDateTimeColumn;
            if (angular.isUndefined(pdtc)) {
              return callback(pdtc);
            }
            return callback(false);
          });
        }
      };
    });

})();
