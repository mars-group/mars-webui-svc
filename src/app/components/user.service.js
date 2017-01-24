(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('User', function Project() {

      var user = {
        id: 1
      };

      // TODO: implement it for real
      return {
        getId: function () {
          return user.id;
        }
      };

    });

})();
