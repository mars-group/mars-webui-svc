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
      SimRunner.getAllSimPlans({"scenarioid": Scenario.getCurrentScenario().ScenarioId}, function(res){
        vm.SimPlans = res;
      });
    }());


    vm.ScenarioId = Scenario.getCurrentScenario().ScenarioId;
    vm.SimPlanName = "";

    vm.CreateSimPlan = function(){
      SimRunner.createSimPlan(vm.SimPlanName, vm.ScenarioId, "42", "42", function(/*res*/) {

      });
    };

    vm.StartSimulationRun = function(simPlanId){
      SimRunner.startSimPlan(simPlanId, function(/*res*/){});
    };
  }
})();
