(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioController', ScenarioController);

  /** @ngInject */
  function ScenarioController($uibModal, NgTableParams, Scenario) {
    var vm = this;

    vm.scenario = [];

    // TODO: create project service
    var project = 42;


    var loadScenarios = function () {
      Scenario.getScenarios(project, function (scenarios) {
        console.log(scenarios);
      });

    };
    loadScenarios();

    vm.tableParams = new NgTableParams({}, {dataset: vm.scenario});

    vm.openScenarioModal = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/scenario/scenarioModal/scenarioModal.html',
        controller: 'ScenarioModalController',
        controllerAs: 'scenarioModal',
        resolve: {
          scenario: function () {
            return {};
          }
        }
      });

      modalInstance.result.then(function (scenario) {
        vm.scenario.push(scenario);
        vm.tableParams = new NgTableParams({}, {dataset: vm.scenario});
      }, function () {
        // console.log('Modal dismissed at: ' + new Date());
      });
    };
    // vm.openScenarioModal();

  }
})();
