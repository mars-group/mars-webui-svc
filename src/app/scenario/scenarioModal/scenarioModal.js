(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioModalController', ScenarioModalController);

  /** @ngInject */
  function ScenarioModalController($uibModalInstance, Scenario, Metadata) {
    var vm = this;

    vm.scenario = {};

    // TODO: write project service
    var project = '42';

    var params = {
      type: 'MODEL'
    };
    Metadata.getFiltered(params, function (res) {
      vm.models = res.data;
    });

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
        Name: vm.scenario.name,
        Description: vm.scenario.description,
        ModelIdentifier: vm.scenario.model
      };

      Scenario.postScenario(data, function (/* res */) {
        callback();
      });
    };

  }

})();
