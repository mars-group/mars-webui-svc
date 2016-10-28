(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ResultConfigController', ResultConfigController);

  /** @ngInject */
  function ResultConfigController($http, $log, $uibModal, Scenario) {
    var vm = this;

    vm.AgentTypes = [];         // A list of agent types and their properties in this model.
    vm.ResultConfigs = [];      // Array containing all available configurations.
    vm.SelectedConfig = {};     // Pointer to the currently selected configuration.
    vm.SelectedConfigStr = "";  // Name of the selected config (used for the select box).
    var defaultConfig = {};     // Default configuration. Used if no other config is available.
    vm.error = false;           // \ Cannot be saved or deleted. --default--

    (function() {
      if (Scenario.getCurrentScenario() != null) {
        loadModel(Scenario.getCurrentScenario()["ModelMetaData"]);
      }
      else vm.error = true;
    }());


    /** Initialization function. This function loads the model structure and creates the
     *  default configuration file. Then it tries to load already existing result output
     *  configurations for this model. If any exists, the first one is auto-selected. */
    function loadModel(modelId) {

      // Get the model structure from the backend service.
      $http.get("/result-config/api/ModelStructure/"+modelId).then(function(structResponse) {
        vm.AgentTypes = structResponse.data;
        createDefaultConfig(modelId);

        // Search for existing configurations.
        $http.get("/result-config/api/ResultConfigs?modelDataId="+modelId).then(function(configResponse) {
          vm.ResultConfigs = configResponse.data;
          changeSelection(vm.ResultConfigs[0].ConfigName);
        }, function() {
          changeSelection("--default--");
        });
      });
    }



    /** Create the default configuration for a model.
     * @param modelId The model identifier. */
    function createDefaultConfig(modelId) {
      defaultConfig = {
        Model: modelId,
        ConfigName: "--default--",
        Agents: []
      };
      for (var i = 0; i < vm.AgentTypes.length; i++) {
        var type = vm.AgentTypes[i];

        var properties = [];
        for (var j = 0; j < type["Properties"].length; j ++) {
          var propStr = type["Properties"][j].split(" ");
          properties.push({
            Type: propStr[0],
            Name: propStr[1],
            Selected: false,
            Static: false
          });
        }

        defaultConfig.Agents.push({
          TypeName: type["AgentType"],
          OutputEnabled: false,
          Frequency: 1,
          SpatialOutput: false,
          SpatialType: "stationary",
          EnableVisualization: false,
          VisualizationParams: "",
          OutputProperties: properties
        });
      }
    }



    /** Change the selection. */
    var changeSelection = function(config) {
      if (config === "--default--") {
        vm.SelectedConfig = angular.copy(defaultConfig);
        vm.SelectedConfigStr = vm.SelectedConfig.ConfigName;
      } else {
        for (var i = 0; i < vm.ResultConfigs.length; i ++) {
          if (vm.ResultConfigs[i].ConfigName === config) {
            vm.SelectedConfig = angular.copy(vm.ResultConfigs[i]);
            vm.SelectedConfigStr = vm.SelectedConfig.ConfigName;
            break;
          }
        }
      }
    };



    /** Visible selection change handler to be called by the select box. */
    vm.SelectionChanged = function() {
      changeSelection(vm.SelectedConfigStr);
    };



    /** Create a new configuration. */
    vm.CreateNew = function() {
      $uibModal.open({
        animation: false,
        templateUrl: 'app/resultconfig/resultconfigModal/resultconfigModal.html',
        controller: 'ResultConfigModalController',
        controllerAs: 'resultconfigModal',
        resolve: {
          configs: function() { return vm.ResultConfigs; },
          selected: function() { return vm.SelectedConfig; },
          selectionChanged: function() { return changeSelection; }
        }
      });
    };



    /** Save the changes of the currently selected output configuration. */
    vm.SaveConfig = function() {
      for (var i = 0; i < vm.ResultConfigs.length; i ++) {
        if (vm.ResultConfigs[i].ConfigName === vm.SelectedConfig.ConfigName) {
          vm.ResultConfigs[i].Agents = vm.SelectedConfig.Agents;

          // Update backend config.
          var cfg = vm.ResultConfigs[i];
          $http.put("/result-config/api/ResultConfigs/"+cfg.ConfigId, cfg)
            .success(function () {
              $log.info("RCS update OK.");
            })
            .error(function () {
              $log.error("RCS update failed!");
            });
          break;
        }
      }
    };



    /** Delete the currently selected configuration. The selection automatically changes
     *  to the preceding config - and if none exists, the default config is loaded. */
    vm.DeleteConfig = function() {
      for (var i = 0; i < vm.ResultConfigs.length; i ++) {
        if (vm.ResultConfigs[i].ConfigName === vm.SelectedConfig.ConfigName) {

          // Delete config also from database.
          var cfg = vm.ResultConfigs[i];
          $http.delete("/result-config/api/ResultConfigs/"+cfg.ConfigId)
            .success(function () {
              $log.info("RCS delete OK.");
            })
            .error(function () {
              $log.error("RCS delete failed!");
            });

          vm.ResultConfigs.splice(i, 1);
          if (i > 0) changeSelection(vm.ResultConfigs[i-1].ConfigName);
          else {
            if (vm.ResultConfigs.length > 0) changeSelection(vm.ResultConfigs[0].ConfigName);
            else changeSelection("--default--");
          }
          break;
        }
      }
    };
  }
})();
