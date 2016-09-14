(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('AgentController', AgentController);

  /** @ngInject */
  function AgentController() {
    var vm = this;
    vm.title = 'Hello World'
  }
  })();
