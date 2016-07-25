(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ModelController', ModelController);

  /** @ngInject */
  function ModelController() {
    var vm = this;

    vm.modelHeader = 'Model';
  }
})();
