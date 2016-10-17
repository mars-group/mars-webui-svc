(function () {
  'use strict';

  angular
    .module('marsApp')

    .controller('modalCtrl', modalCtrl);

  function modalCtrl($uibModalInstance) {
    var vm = this;

    vm.stateVariable = {
      name: '',
      type: '',
      value: '',
      externallyIntialized: ''
    },

      vm.stateVariableTypes = ['float', 'double', 'string', 'enum', 'boolean', 'int'],

      vm.cancel = function () {
        console.log(vm.stateVariable);
        // console.log('hello');
        $uibModalInstance.dismiss('cancel');
      }

  }
})();
