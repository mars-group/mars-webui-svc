(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioController', ScenarioController);

  /** @ngInject */
  function ScenarioController($log, $uibModal, NgTableParams, Scenario, Alert) {
    var vm = this;
    vm.alerts = new Alert();

    vm.scenarios = [];

    var loadScenarios = function () {
      Scenario.getScenarios(function (res) {
        if(res.hasOwnProperty('error')) {
          var err = res.error;
          if (err.status === 500 && err.data.message === 'Forwarding error') {
            vm.alerts.add('There is no instance of "Scenario service", so there is nothing to display!', 'danger');
          } else {
            $log.error(err, 'danger');
          }
        } else {
          vm.scenarios = res;
          vm.tableParams = new NgTableParams({}, {dataset: vm.scenarios});
        }
      });
    };

    loadScenarios();

    vm.updateSearchFilter = function () {
      angular.extend(vm.tableParams.filter(), {$: vm.searchFilter});
    };

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
