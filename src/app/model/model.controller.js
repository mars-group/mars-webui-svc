(function () {
  'use strict';

  angular
    .module('test')
    .controller('ModelController', ModelController);

  /** @ngInject */
  function ModelController() {
    var vm = this;

    vm.modelHeader = 'Model';
  }
})();
