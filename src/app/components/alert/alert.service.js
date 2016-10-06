(function () {
  "use strict";

  angular.module('marsApp')
    .factory('Alert', function Alert() {

      return function Alert() {
        var vm = this;

        var alerts = [];

        vm.get = function () {
          return alerts;
        };

        /**
         *
         * @param message
         * @param type are: default(white), primary(blue), success(green), info(blue), warning(orange), danger(red).
         * defaults to info, if type is not set
         */
        vm.add = function (message, type) {
          alerts.push({
            msg: message,
            type: type
          });
        };

        vm.remove = function (index) {
          alerts.splice(index, 1);
        };
      };
    });

})();
