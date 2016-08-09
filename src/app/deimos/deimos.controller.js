(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('DeimosController', DeimosController);

  /** @ngInject */
  function DeimosController($http, $log, $uibModal, NgTableParams) {
    var vm = this;

    var tableData = []; // data that is displayed in the table

    // Filter categories
    // TODO: get from code
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

    vm.categoryTreeData = [
      {name: 'Data Types', id: 'dataTypes', children: dataTypes},
      {name: 'Privacy', id: 'privacy', children: privacy},
      {name: 'Import Status', id: status, children: importStatus}
    ];

    vm.categoryTreeOptions = {
      nodeChildren: "children",
      dirSelectable: false,
      multiSelection: true
    };

    vm.categoryTreeExpandedNodes = [vm.categoryTreeData[0], vm.categoryTreeData[1], vm.categoryTreeData[2]];

    $http.get('/metadata/metadata/')
      .then(function (results) {
        tableData = results.data;
        initDataTable();
      }, function (err) {
        if (err) {
          $log(err);
        }
      });

    var initDataTable = function () {
      var tableOptions = {
        count: 10,          // count per page (default: 10)
        sorting: {
          title: 'asc'
        },
        filterOptions: {filterFilterName: "categoryFilter"},
        dataset: tableData
      };
      vm.tableParams = new NgTableParams({}, tableOptions);
    };

    vm.updateSearchFilter = function () {
      angular.extend(vm.tableParams.filter(), {$: vm.searchFilter});
    };

    // filter by category
    vm.updateCategoryFilter = function (node, selected) {

      // add filter
      if (selected) {
        // create filter
        if (!vm.tableParams.filter()[node.column]) {
          var filter = {};
          filter[node.column] = [];
          angular.extend(vm.tableParams.filter(), filter);
        }
        vm.tableParams.filter()[node.column].push(node.id);
      }
      // remove filter
      else {
        // remove filter from array
        vm.tableParams.filter()[node.column].splice(node.id, 1);


        // remove key from object if there is no filter
        if (vm.tableParams.filter()[node.column].length < 1) {
          delete vm.tableParams.filter()[node.column];
        }
      }

      vm.categoryFilterActive = !angular.equals(vm.tableParams.filter(), {});
    };


    vm.openPreviewModal = function (dataId) {

      var settings = {
        templateUrl: 'app/deimos/previewModal/previewModal.html',
        controller: 'PreviewModalController',
        controllerAs: 'preview',
        resolve: {}
      };

      $http.get('/metadata/metadata/' + dataId)
        .then(function (result) {
          settings.resolve.dataset = result;
          var modalInstance = $uibModal.open(settings);

          modalInstance.result.then(function (result) {
            $log('result:', result);
          }, function () {
            // console.log('Modal dismissed at: ' + new Date());
          });

        }, function (err) {
          if (err) {
            $log(err);
          }
        });
    };

    vm.deleteDataset = function (dataset) {
      // TODO: Implement
      $log.info('This needs Ticket "MARS-718" to be done!');
    }

  }
})();
