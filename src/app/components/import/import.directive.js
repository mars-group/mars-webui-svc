(function () {
  'use strict';

  angular
    .module('marsApp')
    .directive('importView', importView)
    .filter('isNotEmpty', function () {
      return function (object) {
        return !angular.equals({}, object);
      };
    });

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

      vm.add = function (dataId, status) {
        var type = '';
        switch (status) {
          case 'PROCESSING':
            type = 'info';
            break;
          case 'ERROR':
            type = 'danger';
            break;
          case 'FINISHED':
            type = 'success';
            break;
        }

        vm.uploadStates[dataId] = {
          message: dataId,
          status: status,
          type: type
        };
      };

      vm.remove = function (key) {
        delete vm.uploadStates[key];
      };

      Metadata.registerOnChangeListener(function (res) {
        vm.add(res.dataId, res.status);
      });
    }

  }

})();
