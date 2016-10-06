(function () {
  'use strict';

  angular
    .module('marsApp')

    .controller('modalCtrl', modalCtrl);

  function modalCtrl($uibModalInstance) {
    var vm = this;

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    }

  }
})();
