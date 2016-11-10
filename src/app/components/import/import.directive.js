(function () {
  'use strict';

  angular.module('marsApp')
    .directive('globalImport', globalImport);

  /** @ngInject */
  function globalImport() {
    return {
      restrict: 'A',
      templateUrl: 'app/components/import/import.html',
      scope: {},
      controller: importController,
      controllerAs: 'import'
    };

    /** @ngInject */
    function importController() {
      // var vm = this;

      console.log('test');
    }

  }

})();
