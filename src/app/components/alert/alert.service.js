(function () {
  "use strict";

  angular.module('marsApp')
    .factory('Alert', function Alert() {

      var alerts = [];
      return {
        get: function () {
          return alerts;
        },
        // types are: default(white), primary(blue), success(green), info(blue), warning(orange), danger(red)
        // defaults to info, if type is not set
        add: function (message, type) {
          alerts.push({
            msg: message,
            type: type
          });
        },
        remove: function (index) {
          alerts.splice(index, 1);
        }
      };
    });

})();
