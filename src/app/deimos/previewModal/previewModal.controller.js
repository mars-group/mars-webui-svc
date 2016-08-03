(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('PreviewModalController', GeoPickerController);

  /** @ngInject */
  function GeoPickerController($uibModalInstance, leafletData, dataset) {
    var vm = this;

    vm.dataset = dataset.data;

    angular.extend(vm, {
      center: {
        lat: 0,
        lng: 0,
        zoom: 2
      },
      events: {},
      marker: [{
        lat: 0,
        lng: 0
      }]
    });

    vm.fixMap = function () {
      leafletData.getMap().then(function (map) {

        // No, the 0ms timeout is no mistake, it makes things work ... don't ask!
        setTimeout(function () {
          map.invalidateSize(false);
          initMap();
        }, 0);
      });
    };

    var initMap = function () {

      // todo: implement
      switch (vm.dataset.type.toLowerCase()) {
        case 'AsciiGrid':

          break;
        case 'Geotiff':

          break;
        case 'Shapefile':

          break;
        case 'timeseries':

          break;
        case 'tablebased':

          break;
        default:

      }

    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }

})();
