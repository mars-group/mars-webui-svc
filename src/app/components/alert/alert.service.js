(function () {
  "use strict";

  angular.module('marsApp')
    .factory('Alert', function Alert() {

      return function Alert () {
        var vm = this;

        vm.alerts = [];

        vm.get = function () {
          return vm.alerts;
        };

        /**
         *
         * @param message
         * @param type are: default(white), primary(blue), success(green), info(blue), warning(orange), danger(red).
         * defaults to info, if type is not set
         */
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
