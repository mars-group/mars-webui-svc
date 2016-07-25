'use strict';

angular
  .module('marsApp')
  .factory('Timeseries', function Scenario($http) {


    return {

      processData: function (importId, possibleDateTimeColumn, callback) {
        $http.put('/timeseries-service/timeseries/' + importId, possibleDateTimeColumn).success(function() {
          callback(false);
        });
      },

      processDataOverNode: function (importId, possibleDateTimeColumn, callback, errCallback) {
        $http.post('/websuite/api/upload/timeseries/',
          {possibleDateTimeColumn: possibleDateTimeColumn, importId: importId}
        )
        .success(function() {
          callback();
        })
        .error(function(err){
          errCallback(err);
        });
      }
    }
  });
