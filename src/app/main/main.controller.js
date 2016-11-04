(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Metadata, Scenario) {
    var vm = this;

    vm.isDataImported = false;
    vm.isModelImported = false;
    vm.isScenarioCreated = false;
    vm.isScenarioSelected = false;
    vm.isMappingComplete = false;
    vm.currentScenario = Scenario.getCurrentScenario();

    var hasData = function () {
      var filter = {
        state: 'FINISHED'
      };
      Metadata.getFiltered(filter, function (res) {
        for (var i = 0; i < res.length; i++) {
          if (!angular.equals(res[i].type, 'MODEL')) {
            vm.isDataImported = true;
            return;
          }
        }
        vm.isDataImported = false;
      });
    };
    hasData();

    var hasModels = function () {
      var filter = {
        type: 'MODEL',
        state: 'FINISHED'
      };
      Metadata.getFiltered(filter, function (res) {
        if (res.length > 0) {
          vm.isModelImported = true;
        }
      });
    };
    hasModels();

    var hasScenario = function () {
      Scenario.getScenarios(function (res) {
        vm.isScenarioCreated = res.length > 0;
      });
    };
    hasScenario();

    var hasScenarioSelected = function () {
      vm.isScenarioSelected = Scenario.getCurrentScenario() !== null;
    };
    hasScenarioSelected();

    Scenario.getScenarios(function (scenarios) {
      vm.scenarios = scenarios;
    });

    vm.setCurrentScenario = function () {
      Scenario.setCurrentScenario(vm.currentScenario);
    };

    Scenario.registerOnChangeListener(function () {
      vm.currentScenario = Scenario.getCurrentScenario();
      hasScenarioSelected();
      hasMappingComplete();
    });

    var hasMappingComplete = function () {
      if (!Scenario.getCurrentScenario()) {
        return false;
      }

      Scenario.isMappingComplete(function successCallback(res) {
        vm.isMappingComplete = res;
      });
    };
    hasMappingComplete();

  }
})();
