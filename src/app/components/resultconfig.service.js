(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('ResultConfig', function ResultConfig($http, $log) {
      return {

        // Get the model structure from the backend service.
        getModelStructure: function(modelId, callback) {
          $http.get("/result-config/api/ModelStructure/"+modelId).then(function(resp) {
            $log.info("[ResultConfigService] Fetched structure for model '"+modelId+"'.");
            callback(resp.data);
          });
        },


        // Search for existing configurations.
        getConfigsForModel: function(modelId, callback, errCallback) {
          $http.get("/result-config/api/ResultConfigs?modelDataId="+modelId).then(function(resp) {
            var nr = resp.data.length;
            $log.info("[ResultConfigService] Loaded "+nr+" config"+(nr==1? "": "s")+" for model '"+modelId+"'.");
            callback(resp.data);
          }, errCallback);
        },


        // Create a new config.
        createConfig: function(config, callback) {
          $http.post("/result-config/api/ResultConfigs", config)
            .success(function(resp) {
              $log.info("[ResultConfigService] Config successfully created ('"+resp+"').");
              callback(resp);
            })
            .error(function() {
              $log.error("[ResultConfigService] Config creation (POST) failed!");
            });
        },


        // Update config in the back-end.
        updateConfig: function(config) {
          $http.put("/result-config/api/ResultConfigs/"+config.ConfigId, config)
            .success(function() {
              $log.info("[ResultConfigService] '"+config.ConfigName+"' ("+config.ConfigId+") updated.");
            })
            .error(function() {
              $log.error("[ResultConfigService] Update of '"+config.ConfigName+"' ("+config.ConfigId+") failed!");
            }
          );
        },


        // Delete config also from database.
        deleteConfig: function(configId) {
          $http.delete("/result-config/api/ResultConfigs/"+configId)
            .success(function() {
              $log.info("[ResultConfigService] Deletion of '"+configId+"' OK.");
            })
            .error(function() {
              $log.error("[ResultConfigService] Deletion of '"+configId+"' failed!");
            }
          );
        }
      };
    });
})();
