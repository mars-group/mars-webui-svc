(function () {
  'use strict';

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
          var alert = {
            msg: message,
            type: type
          };

          // prevent duplicate entries
          for (var i = 0; i < alerts.length; i++) {
            if (angular.equals(alert, alerts[i])) {
              return;
            }
          }

          alerts.push(alert);
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
