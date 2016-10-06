(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioController', ScenarioController);

  /** @ngInject */
  function ScenarioController($uibModal, NgTableParams, Scenario) {
    var vm = this;

    vm.scenarios = [];

    // TODO: create project service
    var project = 42;


    var loadScenarios = function () {
      Scenario.getScenarios(project, function (scenarios) {
        vm.scenarios = scenarios;
        vm.tableParams = new NgTableParams({}, {dataset: vm.scenarios});
      });
    };

    loadScenarios();

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

      modalInstance.result.then(function () {
        loadScenarios();
      }, function () {
        // console.log('Modal dismissed at: ' + new Date());
      });
    };

  }
})();
