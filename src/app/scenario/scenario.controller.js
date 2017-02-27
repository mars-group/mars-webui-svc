(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioController', ScenarioController);

  /** @ngInject */
  function ScenarioController($log, $uibModal, NgTableParams, Alert, Scenario, Metadata) {
    var vm = this;
    vm.alerts = new Alert();

    var loadScenarios = function () {
      Scenario.getScenarios(function (res) {
        if (res.hasOwnProperty('error')) {
          var err = res.error;
          if (err.status === 500 && err.data.message === 'Forwarding error') {
            vm.alerts.add('There is no instance of "Scenario service", so there is nothing to display!', 'danger');
          } else {
            $log.error(err, 'danger');
          }
        } else {
          res.forEach(function (e) {
            // get model name
            Metadata.getOne(e.ModelMetaData, function (res) {
              if (res.hasOwnProperty('error')) {
                vm.alerts.add(res.error.data, 'warning');
                return;
              }
              e.ModelName = res.title;
            });
          });
          vm.tableParams = new NgTableParams({}, {dataset: res});
        }
      });
    };
    loadScenarios();

    vm.updateSearchFilter = function () {
      angular.extend(vm.tableParams.filter(), {$: vm.searchFilter});
    };

    vm.openScenarioModal = function (scenario) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/scenario/scenarioModal/scenarioModal.html',
        controller: 'ScenarioModalController',
        controllerAs: 'scenarioModal',
        resolve: {
          scenario: function () {
            return angular.copy(scenario);
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
      });
    };

  }
})();
