(function () {
  'use strict';

  angular.module('marsApp')
    .factory('ServiceState', function ServiceError($http, $log) {

      var services = {
        // 'EUREKA': '',
        'FILE-SERVICE': '',
        // 'FRONTEND': '',
        'GEOSERVER': '',
        'GISIMPORT': '',
        'INFLUXDB': '',
        'MARIADB': '',
        'METADATA-SERVICE': '',
        'MONGODB': '',
        'RABBITMQ': '',
        'REFLECTION-SERVICE': '',
        'RESULT-CONFIG-SERVICE': '',
        'SCENARIO-MANAGEMENT-SERVICE': '',
        'TABLEBASED-IMPORT-SERVICE': '',
        'TIMESERIES-IMPORT-SERVICE': ''
        // 'ZUUL, status: ''
      };

      var getStates = function (callback) {
        $http.get('/eureka/eureka/apps')
          .then(function successCallback(res) {
            callback(res.data);
          })
          .catch(function errorCallback(err) {
            $log.error(err);
            callback({error: err});
          });
      };

      var getAll = function (callback) {
        getStates(function (res) {
          if (res.hasOwnProperty('error')) {
            return callback(res);
          }

          angular.forEach(services, function (status, name) {
            services[name] = 'DOWN';

            var apps = res.applications.application;
            apps.forEach(function (app) {
              if (app.name === name) {
                services[name] = app.instance[0].status;
              }
            });

          });
          callback(services);
        });
      };

      var getOne = function (name, callback) {
        getAll(function (res) {
          if (res.hasOwnProperty('error')) {
            return callback(res);
          }

          callback(res[name.toUpperCase()]);
        });
      };

      return {
        getAll: getAll,
        get: getOne
      };
    });

})();
