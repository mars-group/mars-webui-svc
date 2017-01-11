(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MissionCTLController', MissionCTLController);

  /** @ngInject */
  function MissionCTLController(MissionCTL, Scenario) {
    var vm = this;

    vm.SimPlans = [];


    (function() {
      MissionCTL.getAllSimPlans(null, function(res){
        vm.SimPlans = res;
      });
    }());


    vm.ScenarioId = Scenario.getCurrentScenario().ScenarioId;
    vm.SimPlanName = "";

    vm.CreateSimPlan = function(simPlanName, scenarioConfigId, resultConfigId, executionConfigId){
      MissionCTL.createSimPlan(simPlanName, scenarioConfigId, resultConfigId, executionConfigId, function() {

      });
    };

    vm.StartSimulation = function(){
      MissionCTL.createSimPlan(vm.SimPlanName, vm.ScenarioId, "42", "42", function(res) {
        MissionCTL.startSimPlan(res.data.Id, function(res){});
      });
    };
  }
})();
