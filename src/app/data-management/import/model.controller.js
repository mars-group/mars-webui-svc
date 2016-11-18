(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ImportModelController', ImportModelController);

  /** @ngInject */
  function ImportModelController() {
    var vm = this;

    vm.pageTitle = 'Model import';
    vm.dataTypes = [
      {name: 'MODEL', clearName: 'Model data'}
    ];

  }
})();
