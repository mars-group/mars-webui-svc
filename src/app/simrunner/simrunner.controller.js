(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('SimRunnerController', SimRunnerController);

  /** @ngInject */
  function SimRunnerController(SimRunner, Scenario) {
    var vm = this;

    vm.SimPlans = [];

    vm.ScenarioId = "";

      (function() {
      var currentScenario = Scenario.getCurrentScenario();
      if(currentScenario !== null) {
        vm.ScenarioId = Scenario.getCurrentScenario().ScenarioId;
        SimRunner.getAllSimPlans({"scenarioid": currentScenario.ScenarioId}, function(res){
          vm.SimPlans = res;
        });
      }
    }());



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
