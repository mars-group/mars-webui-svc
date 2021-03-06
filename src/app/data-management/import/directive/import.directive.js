(function () {
  'use strict';

  angular
    .module('marsApp')
    .directive('import', importCtrl);

  /** @ngInject */
  function importCtrl() {
    return {
      restrict: 'A',
      templateUrl: 'app/data-management/import/directive/import.html',
      scope: {
        pageTitle: '=',
        dataTypes: '='
      },
      controller: importController,
      controllerAs: 'import'
    };
  }

  /** @ngInject */
  var importController = function ($scope, $log, $uibModal, $document, FileUploader, Metadata, Alert, Project, User) {
    var vm = this;

    vm.isModelUpload = $scope.dataTypes[0].name === 'MODEL';
    vm.TIME_SERIES = 'TIME_SERIES';
    vm.geoPicker = {};
    vm.geoPickerCaller = undefined;
    vm.markerSet = false;
    vm.uploader = new FileUploader();
    vm.file = null;
    vm.alerts = new Alert();
    vm.data = [];
    vm.showOneUploadAtATime = true;
    vm.isBulkUpload = false;

    var fileEndings = ['asc', 'csv', 'tif', 'zip'];

    vm.Data = function () {
      return {
        projectId: Project.getId(),
        userId: User.getId()
      };
    };

    vm.uploader.filters.push({
      name: 'allowedFilesFilter',
      fn: function (item) {
        vm.alerts.removeAll();

        if (vm.uploader.progress === 100 && vm.uploader.isUploading === false) {
          vm.uploader.clearQueue();
          vm.removeAllUploads();
        }

        vm.data.push(new vm.Data());

        var split = item.name.split('.');
        var fileEnding = split[split.length - 1];
        fileEnding = fileEnding.toLowerCase();

        return !angular.equals(fileEndings.indexOf(fileEnding), -1);
      }
    }, {
      name: 'uniqueFilenameFilter',
      fn: function (item) {
        for (var i = 0; i < vm.uploader.queue.length; i++) {
          var filename = vm.uploader.queue[i]._file.name;
          if (item.name == filename) {
            return false;
          }
        }
        return true;
      }
    });

    var convertTagsToArray = function (tags) {
      var res = [];
      angular.forEach(tags, function (e) {
        res.push(e.text);
      });
      return res;
    };

    vm.uploadFiles = function () {
      for (var i = 0; i < vm.uploader.queue.length; i++) {
        if (vm.isBulkUpload) {
          var split = vm.uploader.queue[i]._file.name.split('.');
          var baseFilename = split[split.length - 2];

          vm.data[i].title = vm.data.bulk.title + '_' + baseFilename;
          vm.data[i].dataType = vm.data.bulk.dataType;
          vm.data[i].privacy = vm.data.bulk.privacy;
          vm.data[i].description = vm.data.bulk.description ? vm.data.bulk.description : '';
          vm.data[i].lat = vm.data.bulk.lat;
          vm.data[i].lng = vm.data.bulk.lng;
          vm.data[i].tags = convertTagsToArray(vm.data.bulk.tags);
        } else {
          vm.data[i].tags = convertTagsToArray(vm.data[i].tags);
        }

        if (vm.isModelUpload) {
          vm.data[i].dataType = $scope.dataTypes[0].name;
        }

        if (vm.data[i].dataType !== vm.TIME_SERIES) {
          if (vm.data[i].lat) {
            delete vm.data[i].lat;
          }
          if (vm.data[i].lng) {
            delete vm.data[i].lng;
          }
        }

        vm.uploader.queue[i].formData.push(vm.data[i]);

        vm.uploader.queue[i].url = '/file/files';

        if (vm.isModelUpload) {
          vm.uploader.queue[i].url += '/models';
        }
      }

      if (vm.isBulkUpload) {
        delete vm.data.bulk;
      }

      vm.uploader.uploadAll();
    };

    vm.uploader.onSuccessItem = function (fileItem, response) {
      fileItem.isProcessing = true;
      Metadata.startLongpolling(response, 'INIT', function () {
          if (fileItem.formData[0].type == vm.TIME_SERIES) {
            Metadata.getDateColumn(response, function (possibleDateTimeColumn) {
              if (!possibleDateTimeColumn) {
                vm.alerts.add('Timeseries File "' + fileItem._file.name + '" does not contain a valid DateTime Column');
              }
            });
          }
          fileItem.isProcessing = true;
        }
      );
    };

    vm.uploader.onErrorItem = function (item, response) {
      $log.error('item:', item);
      $log.error('response:', response);
      if (angular.equals(item.url, '/file/files') && angular.equals(response.message, 'Forwarding error')) {
        vm.alerts.add('There is no instance of "File service"! Importing data is not available right now!', 'danger');
      } else {
        vm.alerts.add('Error while processing "' + item.file.name + '": ' + response.message, 'danger');
      }
    };

    vm.uploader.onWhenAddingFileFailed = function (item, filter) {
      if (filter.name == 'allowedFilesFilter') {
        vm.alerts.add('Only AsciiGrid, GeoTiff, CSV and ZIP files are allowed');
      }
      if (filter.name == 'uniqueFilenameFilter') {
        vm.alerts.add(item.name + ' is already in the upload queue');
      }
    };

    vm.clickUpload = function () {
      $document[0].getElementById('uploadBtn').click();
    };

    vm.clearGeoPicker = function (index) {
      if (typeof index !== 'undefined' && vm.data[index].dataType !== vm.TIME_SERIES) {
        vm.data[index].lat = '';
        vm.data[index].lng = '';
      } else if (vm.isBulkUpload && vm.data.dataType !== vm.TIME_SERIES) {
        vm.data.bulk.lat = '';
        vm.data.bulk.lng = '';
      }
    };

    vm.removeUpload = function (index, event) {
      vm.data.splice(index, 1);
      event.preventDefault(); // prevents redirect to /
    };

    vm.removeAllUploads = function () {
      vm.data = [];
    };

    vm.openGeoPicker = function (id) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/data-management/import/directive/geoPicker/geoPicker.html',
        controller: 'GeoPickerController',
        controllerAs: 'geoPicker',
        resolve: {
          marker: function () {
            if (typeof id !== 'undefined') {
              return {
                lat: vm.data[id].lat,
                lng: vm.data[id].lng
              };
            } else if (vm.isBulkUpload) {
              return {
                lat: vm.data.bulk.lat,
                lng: vm.data.bulk.lng
              };
            }
          }
        }
      });

      modalInstance.result.then(function (marker) {
        if (typeof id !== 'undefined') {
          vm.data[id].lat = marker.lat;
          vm.data[id].lng = marker.lng;
        } else if (vm.isBulkUpload) {
          vm.data.bulk.lat = marker.lat;
          vm.data.bulk.lng = marker.lng;
        }
      }, function () {
      });
    };


  };
})();
