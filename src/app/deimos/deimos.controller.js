(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('DeimosController', DeimosController);

  /** @ngInject */
  function DeimosController($scope, $http, NgTableParams, $timeout) {

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
    $scope.rasterGisData = null; //


    // Filter category
    var dataTypes = [
      {'label': 'AsciiGrid', 'id': 'asc', 'children': [], collapsed: true, "fullName": ''},
      {'label': 'GeoTiff', 'id': 'gif', 'children': [], collapsed: true, "fullName": ''},
      {'label': 'Shapefile', 'id': 'shp', 'children': [], collapsed: true, "fullName": ''},
      {'label': 'Timeserias', 'id': 'table', 'children': [], collapsed: true, "fullName": ''},
      {'label': 'Tablebased', 'id': 'time', 'children': [], collapsed: true, "fullName": ''}
    ];

    var privacy = [
      {'label': 'Private', 'id': 'private', 'children': [], collapsed: true, "fullName": ''},
      {'label': 'Project', 'id': 'project', 'children': [], collapsed: true, "fullName": ''},
      {'label': 'Public', 'id': 'public', 'children': [], collapsed: true, "fullName": ''}
    ];

    var importStatus = [
      {'label': 'AsciiGrid', 'id': 'asc', 'children': [], collapsed: true, "fullName": ''},
      {'label': 'GeoTiff', 'id': 'gif', 'children': [], collapsed: true, "fullName": ''},
      {'label': 'Shapefile', 'id': 'shp', 'children': [], collapsed: true, "fullName": ''}
    ];

    $scope.treedata = [
      {'label': 'Data Types', 'id': 'dataTypes', 'children': dataTypes, collapsed: false, "fullName": ''},
      {'label': 'Privacy', 'id': 'privacy', 'children': privacy, collapsed: false, "fullName": ''},
      {'label': 'Import Status', 'id': 'status', 'children': importStatus, collapsed: false, "fullName": ''}
    ];

    // filter by category
    $scope.filterByCategory = function (node) {
      console.log(node);

      dataResults = dataResults.filter(node);
      $scope.updateTable();
    };

    $scope.showAllDatasets = function () {
      $http.get('/metadata/metadata/')
        .then(function (results) {
          dataResults = results.data;
          initTable();
        }, function (err) {
          if (err) {
            console.log(err);
          }
        });
    };
    $scope.showAllDatasets();

    var initTable = function () {
      var tableOptions = {
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
          title: 'asc'     // initial sorting
        }
      };
      $scope.tableParams = new NgTableParams(tableOptions, {dataset: dataResults});

      $scope.updateTable = function () {
        console.log('update table');

        var term = $scope.filter;
        // if ($scope.isInvertedSearch){
        //   term = "!" + term;
        // }
        $scope.tableParams.filter({$: term});
      };
    };

  }
})();
