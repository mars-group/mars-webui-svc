(function () {
  'use strict';

  angular.module('test')
    .controller('GeoPickerController', GeoPickerController);

  /** @ngInject */
  // The use of $scope is needed because of leaflet
  function GeoPickerController($scope, $uibModalInstance, marker) {
    var vm = this;

    // the marker has to be an array for leaflet
    if (marker) {
      $scope.marker = [marker];
    }

    // map events (don't remove it)
    $scope.events = {};

    // center map
    vm.center = {
      lat: 0,
      lng: 0,
      zoom: 2
    };

    // on click
    $scope.$on("leafletDirectiveMap.click", function(event, args){
      var leafEvent = args.leafletEvent;

      // keep just one marker
      $scope.marker = [{
        lat: leafEvent.latlng.lat,
        lng: leafEvent.latlng.lng
      }];
    });

    vm.ok = function () {
      $uibModalInstance.close($scope.marker[0]);
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }

})();
