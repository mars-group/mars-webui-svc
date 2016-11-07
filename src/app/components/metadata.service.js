(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Metadata', function Scenario($http, $log) {

      var getMetadataFromPathvariable = function (pathVariable, callback) {
        var url = '/metadata/metadata/';

        if (pathVariable) {
          url += pathVariable;
        }

        $http.get(url)
          .then(function (res) {
            callback(res.data);
          })
          .catch(function errorCallback(err) {
            $log.error(err);
            callback({error: err});
          });
      };

      var getMetadataFromParams = function (params, callback) {
        var url = '/metadata/metadata';

        var request = {
          params: params
        };
        $http.get(url, request).then(function (res) {
          callback(res.data);
        }).catch(function errorCallback(err) {
          $log.error(err);
          callback({error: err});
        });
      };

      return {
        getAll: function (callback) {
          getMetadataFromPathvariable(null, function (res) {
            callback(res);
          });
        },

        getFiltered: function (params, callback) {
          getMetadataFromParams(params, function (res) {
            callback(res);
          });
        },

        getOne: function (dataId, callback) {
          getMetadataFromPathvariable(dataId, function (res) {
            callback(res);
          });
        },

        hasStatusWritten: function (dataId, callback) {
          getMetadataFromPathvariable(dataId, function (res) {
            if (res.hasOwnProperty('error')) {
              callback(false);
            } else if (angular.isUndefined(res.state)) {
              if (res.state == 'finished' || res.state == 'preprocessingFinished') {
                callback(true);
              }
            }
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
