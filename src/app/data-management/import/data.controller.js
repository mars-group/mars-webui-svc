(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ImportDataController', ImportDataController);

  /** @ngInject */
  function ImportDataController() {
    var vm = this;

    vm.pageTitle = 'File import';
    vm.dataTypes = [
      {name: 'GEO_POTENTIAL_FIELD', clearName: 'Geo-potential-field data'},
      {name: 'GRID_POTENTIAL_FIELD', clearName: 'Grid-potential-field data'},
      {name: 'OBSTACLE_LAYER', clearName: 'Obstacle-layer data'},
      {name: 'TABLE_BASED', clearName: 'Table-based data'},
      {name: 'TIME_SERIES', clearName: 'Time-series data'},
      {name: 'GIS', clearName: 'GIS data'}
    ];

  }
})();
