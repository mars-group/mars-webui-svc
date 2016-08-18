(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioModalController', ScenarioModalController);

  /** @ngInject */
  function ScenarioModalController($uibModalInstance, $scope) {
    var vm = this;
    vm.scenario = {};

    $scope.startDate = new Date();

    $scope.today = function() {
      $scope.startDate = new Date();
    };

    $scope.clear = function() {
      $scope.startDate = null;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      startingDay: 1
    };

    $scope.openDatepicker = function() {
      $scope.popup1.opened = true;
    };

    $scope.format = 'dd-MMMM-yyyy';

    $scope.popup1 = {
      opened: false
    };



    vm.save = function () {
      storeInDb();
      $uibModalInstance.close(vm.marker[0]);
    };


    var storeInDb = function () {
      // TODO: Implement
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }

})();
