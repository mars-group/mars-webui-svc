(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ResultConfigModalController', ResultConfigModalController);

  /** @ngInject */
  function ResultConfigModalController($uibModalInstance, $http, $log, configs, selected, selectionChanged) {
    var vm = this;

    vm.ConfigName = "";


    // Creation submitted. Check name, then insert the configuration as new entry.
    vm.ok = function() {
      for (var i = 0; i < configs.length; i ++) {
        if (configs[i].ConfigName === vm.ConfigName) return;
      }
      selected.ConfigName = vm.ConfigName;
      selected.ConfigId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === "x" ? r : (r&0x3|0x8);
        return v.toString(16);
      });
      configs.push(selected);

      // Send new config to the backend.
      $http.post("/result-config/api/ResultConfigs", selected)
        .success(function() {
          $log.info("RCS create OK.");
        })
        .error(function() {
          $log.error("RCS create failed!");
        });

      selectionChanged(vm.ConfigName);
      $uibModalInstance.close();
    };


    // Dialog canceled. Just close it.
    vm.cancel = function() {
      $uibModalInstance.close();
    };
  }
})();
