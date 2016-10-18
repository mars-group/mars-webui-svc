(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('PreviewModalController', GeoPickerController);

  /** @ngInject */
  function GeoPickerController($uibModalInstance, $timeout, leafletData, dataset) {
    var vm = this;

    vm.dataset = dataset;

    angular.extend(vm, {
      center: {
        lat: 0,
        lng: 0,
        zoom: 2
      },
      events: {},
      markers: []
    });

    vm.fixMap = function () {
      leafletData.getMap().then(function (map) {

        // No, the 0ms timeout is no mistake, it makes things work ... don't ask!
        $timeout(function () {
          map.invalidateSize(false);
          initMap();
        }, 0);
      });
    };

    var initMap = function () {

      switch (vm.dataset.type.toLowerCase()) {

        case 'AsciiGrid':
          break;

        case 'Geotiff':
          break;

        case 'Shapefile':
          // use WMS
          break;

        case 'timeseries':
        case 'tablebased':
          vm.markers[0] = {
            lng: vm.dataset.geoindex.coordinates[0],
            lat: vm.dataset.geoindex.coordinates[1]
          };
          break;

        default:

      }

    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }

})();
