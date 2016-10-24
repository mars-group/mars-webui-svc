(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('Project', function Project() {

      var currentProject = {
        id: 42
      };

      // TODO: implement it for real
      return {
        getCurrentProject: function () {
          return currentProject;
        }
      };

    });

})();
