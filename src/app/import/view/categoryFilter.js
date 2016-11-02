(function () {
  'use strict';

  angular.module("marsApp").filter("categoryFilter", categoryFilter);

  /** @ngInject */
  /**
   * Iterates over elements for the category filter using AND method
   * @returns {Function}
   */
  function categoryFilter() {
    return function (data, filter) {
      return (data || []).filter(function (item) {

        for (var key in filter) {
          if (key === '$') {
            // var columns = ['title', 'description', 'type', 'privacy', 'state'];
            var columns = ['title'];
            var hideElement = true;

            for (var i = 0; i < columns.length; i++) {
              if (filter.hasOwnProperty(key)) {
                var lowerCaseFilter = item[columns[i]].toLowerCase();
                var lowerCaseItem = filter[key].toLowerCase();
                hideElement = hideElement && lowerCaseFilter.indexOf(lowerCaseItem) === -1;
              }
            }
            if (hideElement) {
              return false;
            }
          } else if (filter.hasOwnProperty(key) && filter[key].indexOf(item[key]) === -1) {
            return false;
          }
        }
        return true;
      });
    };
  }
})();
