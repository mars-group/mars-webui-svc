(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ResultConfigController', ResultConfigController);

  /** @ngInject */
  function ResultConfigController($http, $uibModal) {

    var vm = this;

    vm.test = "Hodor";  //TODO Remove it !!!

    vm.AgentTypes = [];         // A list of agent types and their properties in this model.
    vm.ResultConfigs = [];      // Array containing all available configurations.
    vm.SelectedConfig = {};     // Pointer to the currently selected configuration.
    vm.SelectedConfigStr = "";  // Name of the selected config (used for the select box).
    var defaultConfig = {};     // Default configuration. Used if no other config is available.
                                // \ Cannot be saved or deleted. --default--

    var backend = "http://localhost:8000/api";
    var model = "c1f7343a-9ad0-4d1d-ac46-d658c99d38a4";
    // Scenario => getCurrentScenario => ModelMetaDataId


    /** Initialization function. This function loads the model structure and creates the
     *  default configuration file. Then it tries to load already existing result output
     *  configurations for this model. If any exists, the first one is auto-selected. */
    (function() {

      // Get the model structure from the backend service.
      $http.get(backend+"/ModelStructure/"+model).then(function(structResponse) {
        vm.AgentTypes = structResponse.data;
        createDefaultConfig(model);

        // Search for existing configurations.
        $http.get(backend+"/ResultConfigs/"+model).then(function(configResponse) {
          vm.ResultConfigs = configResponse.data;
          changeSelection(vm.ResultConfigs[0].ConfigName);
        }, function() {
          changeSelection("--default--");
        });
      });
    }());



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
    function changeSelection(config) {
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
    }



    /** Visible selection change handler to be called by the select box. */
    this.SelectionChanged = function() {
      changeSelection(vm.SelectedConfigStr);
    };



    /** Create a new configuration. */
    this.CreateNew = function() {
      $uibModal.open({
        animation: false,
        templateUrl: "NewConfigDialogue",
        controller: function(vm, $uibModalInstance, configs, selected) {
          vm.ConfigName = "";

          // Creation submitted. Check name, then insert the configuration as new entry.
          vm.ok = function() {
            for (var i = 0; i < configs.length; i ++) {
              if (configs[i].ConfigName === vm.ConfigName) return;
            }
            selected.ConfigName = vm.ConfigName;
            configs.push(selected);

            // Send new config to the backend.
            $http.post(backend+"/ResultConfigs", selected)
              .success(function() {
                console.log("RCS save OK.");
              })
              .error(function() {
                console.log("RCS save failed!");
              });

            changeSelection(vm.ConfigName);
            $uibModalInstance.close();
          };

          // Dialog canceled. Just close it.
          vm.cancel = function() {
            $uibModalInstance.close();
          };
        },
        scope: vm,
        resolve: {
          configs: function() { return vm.ResultConfigs; },
          selected: function() { return vm.SelectedConfig; }
        }
      });
    };



    /** Save the changes of the currently selected output configuration. */
    this.SaveConfig = function() {
      for (var i = 0; i < vm.ResultConfigs.length; i ++) {
        if (vm.ResultConfigs[i].ConfigName === vm.SelectedConfig.ConfigName) {
          vm.ResultConfigs[i].Agents = vm.SelectedConfig.Agents;

          // Update backend config.
          var cfg = vm.ResultConfigs[i];
          $http.put(backend+"/ResultConfigs/"+cfg.Model+"/"+cfg.ConfigName, cfg)
            .success(function () {
              console.log("RCS update OK.");
            })
            .error(function () {
              console.log("RCS update failed!");
            });
          break;
        }
      }
    };



    /** Delete the currently selected configuration. The selection automatically changes
     *  to the preceding config - and if none exists, the default config is loaded. */
    this.DeleteConfig = function() {
      for (var i = 0; i < vm.ResultConfigs.length; i ++) {
        if (vm.ResultConfigs[i].ConfigName === vm.SelectedConfig.ConfigName) {

          // Delete config also from database.
          var cfg = vm.ResultConfigs[i];
          $http.delete(backend+"/ResultConfigs/"+cfg.Model+"/"+cfg.ConfigName)
            .success(function () {
              console.info("RCS delete OK.");
            })
            .error(function () {
              console.info("RCS delete failed!");
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
