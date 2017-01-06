(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MappingModalController', MappingModalController);

  /** @ngInject */
  function MappingModalController($uibModalInstance, NgTableParams, mappingErrors) {
    var vm = this;

    vm.tableParams = new NgTableParams({}, {dataset: mappingErrors.Errors});

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

})();
