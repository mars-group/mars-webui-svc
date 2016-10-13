(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Metadata', function Scenario($http) {

      var getMetadataFromPathvariable = function (pathVariable, callback) {
        var url = '/metadata/metadata/';

        if (pathVariable) {
          url += pathVariable;
        }

        $http.get(url).then(function (res) {
          callback(res);
        });
      };

      var getMetadataFromParams = function (params, callback) {
        var url = '/metadata/metadata';

        var request = {
          params: params
        };
        $http.get(url, request).then(function (res) {
          callback(res);
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
