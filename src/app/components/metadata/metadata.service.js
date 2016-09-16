'use strict';

angular
  .module('marsApp')
  .factory('Metadata', function Scenario($http) {
    return {
      hasStatusWritten: function (dataId, callback) {
        $http.get('/metadata/metadata/' + dataId).success(function (res) {
          if (res.state != undefined) {
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
          if (pdtc != undefined) {
            return callback(pdtc);
          }
          return callback(false);
        });
      }
    }
  });
