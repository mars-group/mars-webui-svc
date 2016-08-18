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
      {column: 'type', name: 'AsciiGrid', id: 'asciigrid'},
      {column: 'type', name: 'GeoTiff', id: 'geotiff'},
      {column: 'type', name: 'Model', id: 'model'},
      {column: 'type', name: 'Shapefile', id: 'shapefile'},
      {column: 'type', name: 'Timeseries', id: 'timeseries'},
      {column: 'type', name: 'Tablebased', id: 'tablebased'}
    ];

    var privacy = [
      {column: 'privacy', name: 'Private', id: 'private'},
      {column: 'privacy', name: 'Project private', id: 'projectPrivate'},
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
          $log.error(err);
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
        var index = vm.tableParams.filter()[node.column].indexOf(node.id);
        vm.tableParams.filter()[node.column].splice(index, 1);

        // remove key from object if there is no filter
        if (vm.tableParams.filter()[node.column].length < 1) {
          delete vm.tableParams.filter()[node.column];
        }

      }
      vm.hasCategoryFilter = !!(vm.tableParams.filter().type || vm.tableParams.filter().privacy || vm.tableParams.filter().state);
    };

    vm.resetCategoryFilter = function () {
      vm.tableParams.filter({$: vm.tableParams.filter().$});
      vm.hasCategoryFilter = false;
      vm.selectedNodes = [];
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
          }, function () {
            // console.log('Modal dismissed at: ' + new Date());
          });

        }, function (err) {
          if (err) {
            $log.error(err);
          }
        });
    };

    vm.deleteDataset = function (/*dataset*/) {
      // TODO: Implement
      $log.info('This needs Ticket "MARS-718" to be done!');
    }

  }
})();
