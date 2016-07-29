(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('DeimosController', DeimosController);

  /** @ngInject */
  function DeimosController($scope, $http, NgTableParams) {

    // main table
    $scope.selected = {}; // selected data for export
    $scope.exportName = ''; // name of the export
    $scope.exportStatus = ''; // export status message
    var dataResults = []; // data that is displayed in the table

    //modal window
    $scope.modalTableData = null; // data of the modal window
    $scope.modalColumnNames = null; // column name of the modal data
    $scope.tableVisability = true; // visability of the table column
    $scope.vectorGisVisability = true; // visability of the vector gis view
    $scope.rasterGisVisability = true;
    $scope.vectorGisData = null; // data for the modal Vector gis map
    $scope.errorClass = '';
    $scope.dataExported = false;
    $scope.map = null;
    $scope.rasterGisData = null;
    $scope.searchFilter = '';
    $scope.categoryFilter = false;

    $scope.treeOptions = {
      nodeChildren: "children",
      dirSelectable: false,
      multiSelection: true
    };

    // Filter category
    var dataTypes = [
      {column: 'type', name: 'AsciiGrid', id: 'AsciiGrid'},
      {column: 'type', name: 'GeoTiff', id: 'Geotiff'},
      {column: 'type', name: 'Shapefile', id: 'Shapefile'},
      {column: 'type', name: 'Timeseries', id: 'timeseries'},
      {column: 'type', name: 'Tablebased', id: 'tablebased'}
    ];

    var privacy = [
      {column: 'privacy', name: 'Private', id: 'private'},
      {column: 'privacy', name: 'Project', id: 'project'},
      {column: 'privacy', name: 'Public', id: 'public'}
    ];

    var importStatus = [
      {column: 'state', name: 'processing', id: 'processing'},
      {column: 'state', name: 'finished', id: 'finished'}
    ];

    $scope.treedata = [
      {name: 'Data Types', id: 'dataTypes', children: dataTypes},
      {name: 'Privacy', id: 'privacy', children: privacy},
      {name: 'Import Status', id: status, children: importStatus}
    ];

    $http.get('/metadata/metadata/')
      .then(function (results) {
        dataResults = results.data;
        initTable();
      }, function (err) {
        if (err) {
          console.log(err);
        }
      });

    var initTable = function () {
      var tableOptions = {
        count: 10,          // count per page (default: 1ß)
        sorting: {
          title: 'asc'     // initial sorting
        },
        filterOptions: {filterFilterName: "categoryFilter"},
        dataset: dataResults
      };
      $scope.tableParams = new NgTableParams({}, tableOptions);
    };

    $scope.updateSearchFilter = function () {
      angular.extend($scope.tableParams.filter(), {$: $scope.searchFilter});
    };

    // filter by category
    $scope.updateCategoryFilter = function (node, selected) {
      $scope.categoryFilter = true;

      // add filter
      if (selected) {
        // create filter
        if (!$scope.tableParams.filter()[node.column]) {
          var filter = {};
          filter[node.column] = [];
          angular.extend($scope.tableParams.filter(), filter);
        }
        $scope.tableParams.filter()[node.column].push(node.id);
      }
      // remove filter
      else {
        $scope.tableParams.filter()[node.column] = undefined;
      }
    };


// // hide modal data and map tabs, when there is no table data
//     $scope.$watch('modalTableData', function (newVal) {
//       if (typeof newVal !== 'undefined' && newVal != null && newVal.length > 0) {
//         $scope.tableVisability = true;
//         angular.element('.nav-tabs a[href="#tableView"]').tab('show');
//       } else {
//         $scope.tableVisability = false;
//       }
//     });
//
//     // hide modal gis tab, when there is no gis data
//     $scope.$watch('rasterGisData', function (newVal) {
//       if (typeof newVal !== 'undefined' && newVal != null) {
//         $scope.rasterGisVisability = true;
//
//         // wait 0,2 sec till switching tab. This is a workaround for big gis files
//         setTimeout(function () {
//           angular.element('.nav-tabs a[href="#rasterGisView"]').tab('show');
//         }, 200);
//
//       } else {
//         $scope.rasterGisVisability = false;
//       }
//     });
//
//     $scope.$watch('vectorGisData', function (newVal) {
//       if (typeof newVal !== 'undefined' && newVal != null) {
//         $scope.vectorGisVisability = true;
//
//         // wait 0,2 sec till switching tab. This is a workaround for big gis files
//         setTimeout(function () {
//           angular.element('.nav-tabs a[href="#vectorGisView"]').tab('show');
//         }, 200);
//
//       } else {
//         $scope.vectorGisVisability = false;
//       }
//     });
//
// // the leaflet map
//     angular.element('#previewModal').on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
//
//       if (e.target.text === 'Map View') {
//         updateTableData();
//       } else if (e.target.text === 'raster GIS View') {
//         updateRasterGisData();
//       } else if (e.target.text === 'vector GIS View') {
//         updateVectorGisData();
//       }
//     }); // end leaflet map

    // var updateTableData = function () {
    //   cleanMap('map');
    //
    //   // check for geodata in columns.
    //   if ($scope.modalColumnNames !== null) {
    //     // check if data contains geo positions
    //     var latitude;
    //     var longitude;
    //     for (var i = 0; i < $scope.modalColumnNames.length; i++) {
    //       var field = $scope.modalColumnNames[i].SourceName.toLowerCase();
    //
    //       if (field === 'latitude' || field === 'lat' || field === 'ddlat' || field === 'y_coord') {
    //         latitude = i;
    //       } else if (field === 'longitude' || field === 'long' || field === 'lng' || field === 'lon' || field === 'ddlon' || field === 'x_coord') {
    //         longitude = i;
    //       }
    //     }
    //   }
    //
    //   // place markers on the map
    //   if ($scope.modalTableData !== null) {
    //     var markers = [];
    //     $scope.modalTableData.forEach(function (entry) {
    //       if (typeof entry[latitude] !== 'undefined' && typeof entry[longitude] !== 'undefined') {
    //
    //         var text = '';
    //         for (var i = 0; i < entry.length; i++) {
    //           text += $scope.modalColumnNames[i].SourceName + ': ';
    //           text += entry[i] + '<br />';
    //         }
    //
    //         var marker = L.marker([entry[latitude], entry[longitude]]).bindPopup(text);
    //         markers.push(marker);
    //       }
    //     });
    //
    //     if (markers.length > 0) {
    //       var markerGroup = new L.featureGroup(markers);
    //
    //       markerGroup.addTo($scope.map);
    //       $scope.map.fitBounds(markerGroup);
    //     }
    //   }
    // };

    // var updateRasterGisData = function () {
    //   cleanMap('rasterGisMap');
    //
    //   var layer = L.tileLayer('/websuite/api/deimos/getRasterGisData/' + $scope.rasterGisData + '/{z}/{x}/{y}.png', {
    //     noWrap: true,
    //     tms: true,
    //     maxZoom: 12
    //   }).addTo($scope.map);
    //
    //   // TODO: focus on tile layer
    // };
    //
    // var updateVectorGisData = function () {
    //   cleanMap('vectorGisMap');
    //
    //   var layer = L.geoJson($scope.vectorGisData).addTo($scope.map);
    //
    //   $scope.map.fitBounds(layer.getBounds(), {
    //     padding: [170, 170]
    //   });
    // };
    //
    // var cleanMap = function (map) {
    //   // removes the map, so old data doesn't stay
    //   if ($scope.map !== null) {
    //     //$scope.map.remove();
    //   }
    //
    //   //$scope.map = L.map(map).setView([51.505, -0.09], 2);
    //   $scope.map = L.map(map).setView([-25.5, 31.5], 3);
    //
    //   L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //     maxZoom: 12,
    //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    //     '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ',
    //     id: 'examples.map-i875mjb7',
    //     noWrap: true
    //   }).addTo($scope.map);
    //
    //   //initMapDrawing(map);
    // };


// // add or remove the selection to the current Export List
//     $scope.$watchCollection('selected', function () {
//       angular.forEach($scope.selected, function (value, guid) {
//         // only push if selected is true and it is not added yet.
//         if (value && !exportDataContains(guid)) {
//           var dataset = null;
//           // some is a forEach loop, that can be broken out of.
//           // this code fetches the dataset id from guid
//           dataResults.some(function (e) {
//             if (e.guid == guid) {
//               dataset = e;
//               return true;
//             }
//           });
//
//           // only add, if the id is not in the list already
//           if (dataset !== null) {
//             exportData.push(dataset);
//           }
//         } else if (!value && exportDataContains(guid)) {
//           var indexToDelete = -1;
//           exportData.some(function (e, index) {
//             if (e.guid == guid) {
//               indexToDelete = index;
//               return true;
//             }
//           });
//
//           if (indexToDelete >= 0) {
//             exportData.splice(indexToDelete, 1);
//           }
//         }
//       });
//     });

    // var exportDataContains = function (guid) {
    //   var result = false;
    //   exportData.some(function (e) {
    //     if (e.guid == guid) {
    //       result = true;
    //       return true;
    //     }
    //   });
    //   return result;
    // };
    //
    // $scope.export = function () {
    //   if (exportData.length < 1) {
    //     alert('Select some data first!');
    //     return;
    //   }
    //
    //   $scope.exportStatus = '';
    //   $scope.dataExported = false;
    //   $('#cubeNameModal').modal();
    // };
    //
    // $scope.validateExportName = function () {
    //   $scope.exportStatus = '';
    //   $scope.errorClass = '';
    //   if ($scope.exportName == null || $scope.exportName.length < 1) {
    //     $scope.errorClass = 'exportError';
    //     $scope.exportStatus += '<br />ERROR: Export name may NOT contain special characters!';
    //     return;
    //   }
    //   exportTheData();
    // };


  }
})();
