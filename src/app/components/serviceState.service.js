(function () {
  'use strict';

  angular.module('marsApp')
    .factory('ServiceState', function ServiceError($http, $log) {

      var services = [
        // 'EUREKA',
        'FILE-SERVICE',
        // 'FRONTEND',
        'GEOSERVER',
        'GISIMPORT',
        'INFLUXDB',
        'MARIADB',
        'METADATA-SERVICE',
        'MONGODB',
        'RABBITMQ',
        'REFLECTION-SERVICE',
        'RESULT-CONFIG-SERVICE',
        'SCENARIO-MANAGEMENT-SERVICE',
        'TABLEBASED-IMPORT-SERVICE',
        'TIMESERIES-IMPORT-SERVICE'
        // 'ZUUL'
      ];

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

      return {
        getAll: function (callback) {
          getStates(function (res) {
            if (res.hasOwnProperty('error')) {
              return callback(res);
            }

            var apps = res.applications.application;
            var serviceStates = [];

            services.forEach(function (service) {
              var tmpApp = {
                name: service,
                status: 'DOWN'
              };

              apps.forEach(function (app) {
                if (app.name === service) {
                  tmpApp.status = app.instance[0].status;
                }
              });

              serviceStates.push(tmpApp);
            });
            callback(serviceStates);
          });
        }

      };
    });

})();
