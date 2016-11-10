(function () {
  'use strict';

  angular.module('marsApp')
    .directive('importView', importView);

  /** @ngInject */
  function importView() {
    return {
      restrict: 'A',
      templateUrl: 'app/components/import/import.html',
      scope: {},
      controller: importViewCtrl,
      controllerAs: 'importView'
    };

    /** @ngInject */
    function importViewCtrl(Metadata) {
      var vm = this;

      vm.uploadStates = {};

      Metadata.registerOnChangeListener(function (res) {
        vm.uploadStates[res.dataId] = res.status;
      });
    }

  }

})();
