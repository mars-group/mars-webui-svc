(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Project', function Project() {

      var project = {
        id: '42'
      };

      // TODO: implement it for real
      return {
        getId: function () {
          return project.id;
        }
      };

    });

})();
