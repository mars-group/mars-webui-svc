(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('MissionCTLController', MissionCTLController);

  /** @ngInject */
  function MissionCTLController() {
    var vm = this;

    vm.test = 'Hello World!';

  }
})();
