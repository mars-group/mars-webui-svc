(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('SimRunnerController', SimRunnerController);

  /** @ngInject */
  function SimRunnerController(SimRunner, Scenario) {
    var vm = this;

    vm.SimPlans = [];


    (function() {
      SimRunner.getAllSimPlans(null, function(res){
        vm.SimPlans = res;
      });
    }());


    vm.ScenarioId = Scenario.getCurrentScenario().ScenarioId;
    vm.SimPlanName = "";

    vm.CreateSimPlan = function(simPlanName, scenarioConfigId, resultConfigId, executionConfigId){
      SimRunner.createSimPlan(simPlanName, scenarioConfigId, resultConfigId, executionConfigId, function() {

      });
    };

    vm.StartSimulation = function(){
      SimRunner.createSimPlan(vm.SimPlanName, vm.ScenarioId, "42", "42", function(res) {
        SimRunner.startSimPlan(res.data.Id, function(res){});
      });
    };
  }
})();
