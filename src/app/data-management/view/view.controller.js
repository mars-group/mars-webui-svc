(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ImportViewController', ImportViewController);

  /** @ngInject */
  function ImportViewController($log, $uibModal, $scope, $window, NgTableParams, Metadata, Alert) {
    var vm = this;

    vm.alerts = new Alert();

    // Filter categories
    // TODO: get from code
    var dataTypes = [
      {column: 'type', name: 'AsciiGrid', id: 'ASCIIGRID'},
      {column: 'type', name: 'GeoTiff', id: 'GEOTIFF'},
      {column: 'type', name: 'Model', id: 'MODEL'},
      {column: 'type', name: 'Shapefile', id: 'SHAPEFILE'},
      {column: 'type', name: 'Timeseries', id: 'TIME_SERIES'},
      {column: 'type', name: 'Tablebased', id: 'TABLE_BASED'},
      {column: 'type', name: 'Geo-Potential field', id: 'GEO_POTENTIAL_FIELD'},
      {column: 'type', name: 'Grid-Potential field', id: 'GRID_POTENTIAL_FIELD'},
      {column: 'type', name: 'Obstacle layer', id: 'OBSTACLE_LAYER'}
    ];

    var privacy = [
      {column: 'privacy', name: 'Private', id: 'PRIVATE'},
      {column: 'privacy', name: 'Project private', id: 'PROJECT_PRIVATE'},
      {column: 'privacy', name: 'Public', id: 'PUBLIC'}
    ];

    var importStatus = [
      {column: 'state', name: 'processing', id: 'PROCESSING'},
      {column: 'state', name: 'finished', id: 'FINISHED'}
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

    Metadata.getAll(function (res) {
      if (res.hasOwnProperty('error')) {
        var err = res.error;
        if (err.status === 500 && err.data.message === 'Forwarding error') {
          vm.alerts.add('There is no instance of "Metadata service", so there is nothing to display!', 'danger');
        } else {
          vm.alerts.add(err, 'danger');
        }
      } else {
        initDataTable(res);
      }
    });

    var initDataTable = function (tableData) {
      var tablePageSize = $window.sessionStorage.getItem('tablePageSize');

      if (!tablePageSize) {
        tablePageSize = 10;
      }

      var tableOptions = {
        sorting: {
          title: 'asc'
        },
        filterOptions: {filterFilterName: "categoryFilter"},
        dataset: tableData
      };
      vm.tableParams = new NgTableParams({count: tablePageSize}, tableOptions);

      // store elements per page in the session storage
      $scope.$watch(angular.bind(vm, function () {
        return vm.tableParams.count();
      }), function (newVal) {
        $window.sessionStorage.setItem('tablePageSize', newVal);
      });
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
        templateUrl: 'app/data-management/view/previewModal/previewModal.html',
        controller: 'PreviewModalController',
        controllerAs: 'preview',
        resolve: {}
      };

      Metadata.getOne(dataId, function (res) {
        settings.resolve.dataset = res;
        var modalInstance = $uibModal.open(settings);

        modalInstance.result.then(function () {
        }, function () {
        });
      });

    };

    vm.deleteDataset = function (/*dataset*/) {
      // TODO: Implement
      $log.info('This needs Ticket "MARS-718" to be done!');
    };

  }
})();
