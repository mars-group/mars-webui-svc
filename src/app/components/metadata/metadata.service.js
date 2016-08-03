'use strict';

angular
  .module('marsApp')
  .factory('Metadata', function Scenario($http) {
    return {
      hasStatusWritten: function (importId, callback) {
        $http.get('/metadata/metadata/' + importId).success(function (res) {
          if (res.state != undefined) {
            if (res.state == 'finished' || res.state == 'preprocessingFinished') {
              return callback(true);
            }
          }
          return callback(false);
        });
      },

      getPossibleDateColumn: function (importId, callback) {
        $http.get('/metadata/metadata/' + importId).success(function (res) {
          var pdtc = res.additionalTypeSpecificData.possibleDateTimeColumn;
          if (pdtc != undefined) {
            return callback(pdtc);
          }
          return callback(false);
        });
      }
    }
  });
