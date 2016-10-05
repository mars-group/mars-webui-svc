(function () {
  "use strict";

  angular.module('marsApp')
    .factory('Alert', function Alert() {

      return function () {
        var vm = this;

        vm.alerts = [];

        vm.get = function () {
          return vm.alerts;
        };

        vm.add = function (message, type) {
          vm.alerts.push({
            msg: message,
            type: type
          });
        };

        vm.remove = function (index) {
          vm.alerts.splice(index, 1);
        };
      };
    });

})();
