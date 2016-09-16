(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioModalController', ScenarioModalController);

  /** @ngInject */
  function ScenarioModalController($http, $log, $uibModalInstance) {
    var vm = this;

    vm.scenario = {};

    // TODO: write models service
    vm.models = ['mock_A', 'mock_B', 'mock_C'];


    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    vm.save = function () {
      persist(function () {
        $uibModalInstance.close(vm.scenario);
      });
    };

    var persist = function (callback) {
      var data = {
        Owner: 'me',
        Project: 42,
        Name: vm.scenario.name
      };

      var config = {
        // params: data,
        headers: {
          'Accept': 'application/json'
        }
      };

      $http.post('/scenario-management/scenarios', data).then(function (results) {
        console.log('POST results:', results.data);
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
