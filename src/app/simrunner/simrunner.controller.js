(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('SimRunnerController', SimRunnerController);

  /** @ngInject */
  function SimRunnerController(SimRunner, Scenario, SimResultOutput) {
    var vm = this;

    vm.SimPlans = [];
    vm.SimRuns = [];
    vm.simResultOutput = SimResultOutput;
    vm.ScenarioId = "";

    (function() {
      var currentScenario = Scenario.getCurrentScenario();
      if(currentScenario !== null) {
        vm.ScenarioId = Scenario.getCurrentScenario().ScenarioId;
        SimRunner.getAllSimPlans({"scenarioid": vm.ScenarioId, projectid: 42}, function(res){
          if(res !== "" && !res.error) {
            vm.SimPlans = res;
          }
        });

      }
    }());

    Scenario.registerOnChangeListener(function(){
      vm.ScenarioId = Scenario.getCurrentScenario().ScenarioId;
      SimRunner.getAllSimPlans({"scenarioid": vm.ScenarioId, projectid: 42}, function(res){
        if(!res.error) {vm.SimPlans = res;}
      });
    });

    vm.GetAllSimRunsForSimPlan = function(simPlan) {
      SimRunner.getAllSimRuns({simPlanId: simPlan.id, projectid: 42}, function(res){
        simPlan.simRuns = res;
      });
    };

    vm.SimPlanName = "";

    vm.CreateSimPlan = function(){
      SimRunner.createSimPlan(vm.SimPlanName, vm.ScenarioId, "42", "42", function(res) {
        vm.SimPlans.push(res);
      });
    };

    vm.StartSimulationRun = function(simPlanId){
      SimRunner.startSimPlan(simPlanId, function(newSimrun){
        angular.forEach(vm.SimPlans, function(elem){
          if(elem.id == newSimrun.SimPlanId) {
            if(!elem.simRuns){
              elem.simRuns = [];
            }

            elem.simRuns.push(newSimrun);

          }
        });
      });
    };

    vm.AbortSimulationRun = function(simRun) {
      SimRunner.abortSimRun(simRun.id, function(res){
        simRun = res;
      });
    };
  }
})();
