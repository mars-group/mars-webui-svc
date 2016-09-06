(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('GeoPickerController', GeoPickerController);

  /** @ngInject */
  function GeoPickerController($scope, $uibModalInstance, marker) {
    var vm = this;

    angular.extend(vm, {
      center: {
        lat: 0,
        lng: 0,
        zoom: 2
      },
      events: {
        map: {
          enable: ['click'],
          logic: 'emit'
        }
      },
      marker: []
    });

    if (marker && marker.lat && marker.lng) {
      vm.marker = [marker];
    }

    // on click
    $scope.$on("leafletDirectiveMap.click", function (event, args) {
      var leafEvent = args.leafletEvent;

      // keep just one marker
      vm.marker = [{
        lat: leafEvent.latlng.lat,
        lng: leafEvent.latlng.lng
      }];
    });

    vm.ok = function () {
      $uibModalInstance.close(vm.marker[0]);
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }

})();
