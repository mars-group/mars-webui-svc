(function () {
  "use strict";

  angular.module("marsApp").filter("categoryFilter", categoryFilter);

  /** @ngInject */
  /**
   * itterates over elements for the category filder in AND method
   * @returns {Function}
   */
  function categoryFilter() {
    return function (data, filter) {
      return (data || []).filter(function (item) {

        for (var key in filter) {
          if (key === '$') {
            var columns = ['title', 'description', 'type', 'privacy', 'state'];
            var hideElement = true;

            for (var i = 0; i < columns.length; i++) {
              if (filter.hasOwnProperty(key)) {
                hideElement = hideElement && item[columns[i]].indexOf(filter[key].toLowerCase()) === -1;
              }
            }
            if (hideElement) {
              return false;
            }
          } else if (filter.hasOwnProperty(key) && filter[key].indexOf(item[key].toLowerCase()) === -1) {
            return false;
          }
        }
        return true;
      });
    };
  }
})();
