(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioModalController', ScenarioModalController);

  /** @ngInject */
  function ScenarioModalController($uibModalInstance, Scenario) {
    var vm = this;

    vm.scenario = {};

    // TODO: write project service
    var project = '42';

    // TODO: write models service
    vm.models = ['mock_A', 'mock_B', 'mock_C'];


    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    vm.save = function () {
      if (vm.form.$valid) {
        persist(function () {
          $uibModalInstance.close();
        });
      }
    };

    var persist = function (callback) {
      var data = {
        Owner: 'me',
        Project: project,
        Name: vm.scenario.name
      };

      Scenario.postScenario(data, function (/* res */) {
        callback();
      });
    };

  }

})();
