(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioController', ScenarioController);

  /** @ngInject */
  function ScenarioController($uibModal) {
    var vm = this;


    vm.openScenarioModal = function () {

      var modalInstance = $uibModal.open({
        templateUrl: 'app/scenario/scenarioModal/scenarioModal.html',
        controller: 'ScenarioModalController',
        controllerAs: 'scenarioModal',
        resolve: {
          marker: function () {
            return {};
          }
        }
      });

      modalInstance.result.then(function (marker) {
      }, function () {
        // console.log('Modal dismissed at: ' + new Date());
      });
    };
    vm.openScenarioModal();

  }
})();
