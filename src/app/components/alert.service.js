(function () {
  "use strict";

  angular.module('marsApp')
    .factory('Alert', function Alert() {

      return function Alert() {
        var vm = this;

        var alerts = [];

        vm.getAll = function () {
          return alerts;
        };

        vm.getOne = function (index) {
          return alerts[index];
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

        vm.removeByName = function (name) {
          angular.forEach(alerts, function (e) {
            if (angular.equals(e.msg, name)) {
              vm.remove(alerts.indexOf(e));
            }
          });
        };

      };
    });

})();
