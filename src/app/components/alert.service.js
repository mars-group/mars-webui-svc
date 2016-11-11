(function () {
  'use strict';

  angular.module('marsApp')
    .factory('Alert', function Alert() {

      return function Alert() {
        var vm = this;

        var alerts = {};

        /**
         *
         * @param message
         * @param type are: default(white), primary(blue), success(green), info(blue), warning(orange), danger(red).
         * defaults to info, if type is not set
         */
        vm.add = function (message, type) {
          if (type) {
            alerts[message] = type;
          } else {
            alerts[message] = 'info';
          }
        };

        vm.getAll = function () {
          return alerts;
        };

        vm.remove = function (key) {
          delete alerts[key];
        };

      };
    });

})();
