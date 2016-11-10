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
      controllerAs: 'import'
    };

    /** @ngInject */
    function importViewCtrl() {
      // var vm = this;

      // console.log('test');
    }

  }

})();
