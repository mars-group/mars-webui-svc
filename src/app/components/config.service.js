(function () {
  'use strict';

  angular.module('marsApp')
    .factory('Config', function ($http, $log) {
      var config = null;

      var loadConfig = function (callback) {
        if (config) {
          callback(config);
        }

        $http.get('config.json')
          .then(function successCallback(res) {
            config = res.data;
            callback(config);
          })
          .catch(function errorCallback(err) {
            $log.error(err);
          });
      };

      var isDevelopment = function (callback) {
        if (config) {
          callback(config);
        }
        loadConfig(function (res) {
          callback(res.development);
        });
      };

      return {
        isDevelopment: isDevelopment
      };

    });

})();
