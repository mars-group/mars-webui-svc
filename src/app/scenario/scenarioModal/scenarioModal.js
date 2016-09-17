(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioModalController', ScenarioModalController);

  /** @ngInject */
  function ScenarioModalController($http, $log, $uibModalInstance) {
    var vm = this;

    vm.scenario = {};

    // TODO: write project service
    var project = "42";

    // TODO: write models service
    vm.models = ['mock_A', 'mock_B', 'mock_C'];


    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    vm.save = function () {
      persist(function () {
        $uibModalInstance.close();
      });
    };

    var persist = function (callback) {
      var data = {
        Owner: 'me',
        Project: project,
        Name: vm.scenario.name
      };

      $http.post('/scenario-management/scenarios', data).then(function () {
        callback();
      }, function (err) {
        if (err) {
          $log.error(err);
          callback();
        }
      });
    };

  }

})();
