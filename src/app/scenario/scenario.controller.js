(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioController', ScenarioController);

  /** @ngInject */
  function ScenarioController($uibModal, NgTableParams, Scenario, Alert) {
    var vm = this;
    vm.alerts = new Alert();

    vm.scenarios = [];

    var loadScenarios = function () {
      Scenario.getScenarios(function (scenarios) {
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

      modalInstance.result.then(function (err) {
        if (err) {
          vm.alerts.add('Error: ' + err.Description, 'danger');
        } else {
          loadScenarios();
        }
      }, function () {
        // console.log('Modal dismissed at: ' + new Date());
      });
    };

  }
})();
