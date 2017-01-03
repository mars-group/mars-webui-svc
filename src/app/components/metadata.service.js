(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Metadata', function Scenario($http, $log) {
      var baseUrl = '/metadata/metadata/';
      var onChangeListener = [];

      var triggerOnChangeListener = function (res) {
        for (var i = 0; i < onChangeListener.length; i++) {
          onChangeListener[i](res);
        }
      };

      var getFromPathVariable = function (pathVariable, callback) {
        var url = baseUrl;
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

      var getFromParams = function (params, callback) {
        var request = {
          params: params
        };

        $http.get(baseUrl, request)
          .then(function (res) {
            callback(res.data);
          })
          .catch(function errorCallback(err) {
            $log.error(err);
            callback({error: err});
          });
      };

      var getState = function (pathVariable, params, callback) {
        var url = baseUrl;
        if (pathVariable) {
          url += pathVariable;
        }

        url += '/state';

        var request = {
          params: params
        };

        $http.get(url, request)
          .then(function (res) {
            callback(res.data);
          })
          .catch(function errorCallback(err) {
            $log.error(err);
            callback({error: err});
          });
      };

      var hasStatusWritten = function (dataId, params, callback) {
        getState(dataId, params, function (res) {
          callback(res);
        });
      };

      var startLongpolling = function (dataId, status, callback) {
        var params = {
          state: status
        };

        hasStatusWritten(dataId, params, function (res) {
          if (res) {
            triggerOnChangeListener({dataId: dataId, status: res});
          }

          if (res.hasOwnProperty('error')) {
            return callback({error: res});
          } else if (res === 'FINISHED' || res === 'FAILED') {
            return callback();
          }
          startLongpolling(dataId, res, callback);
        });
      };

      return {
        getAll: function (callback) {
          getFromPathVariable(null, function (res) {
            callback(res);
          });
        },

        getFiltered: function (params, callback) {
          getFromParams(params, function (res) {
            callback(res);
          });
        },

        getOne: function (dataId, callback) {
          getFromPathVariable(dataId, function (res) {
            callback(res);
          });
        },

        hasStatusWritten: hasStatusWritten,

        getDateColumn: function (dataId, callback) {
          $http.get('/metadata/metadata/' + dataId).success(function (res) {
            var pdtc = res.additionalTypeSpecificData.possibleDateTimeColumn;
            if (angular.isUndefined(pdtc)) {
              callback(pdtc);
            }
            callback(false);
          });
        },

        startLongpolling: startLongpolling,

        registerOnChangeListener: function (callback) {
          onChangeListener.push(callback);
        }
      };
    });

})();
