(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ImportDataController', ImportDataController);

  /** @ngInject */
  function ImportDataController($log, $uibModal, $document, FileUploader, Metadata, Timeseries, Alert, Project) {
    var vm = this;

    vm.geoPicker = {};
    vm.geoPickerCaller = undefined;
    vm.markerSet = false;

    vm.GEO_POTENTIAL_FIELD = 'GEO_POTENTIAL_FIELD';
    vm.GIS = 'GIS';
    vm.GRID_POTENTIAL_FIELD = 'GRID_POTENTIAL_FIELD';
    vm.OBSTACLE_LAYER = 'OBSTACLE_LAYER';
    vm.TABLE_BASED = 'TABLE_BASED';
    vm.TIME_SERIES = 'TIME_SERIES';

    var fileEndings = ['asc', 'csv', 'tif', 'zip'];

    vm.uploader = new FileUploader();
    vm.file = null;
    vm.alerts = new Alert();
    vm.data = [];
    vm.showOneUploadAtATime = true;


    vm.Data = function () {
      return {
        lat: '',
        lng: '',
        privacy: '',
        dataType: '',
        projectId: Project.getCurrentProject().id,
        userId: 1, // todo: add real id
        title: '',
        description: ''
      };
    };

    vm.uploader.filters.push({
      name: 'allowedFilesFilter',
      fn: function (item) {
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

    vm.uploadFiles = function () {
      for (var i = 0; i < vm.uploader.queue.length; i++) {
        var filename = vm.uploader.queue[i]._file.name;

        if (vm.data[i].dataType === vm.TIME_SERIES) {
          var patternDecimal = /-?[0-9]+\.[0-9]+/;
          if (!patternDecimal.test(vm.data[i].lat) || !patternDecimal.test(vm.data[i].lng)) {
            vm.alerts.add('Please provide valid LAT and LON (decimals) for data file \'' + filename + '\'');
            return false;
          }
        }

        vm.uploader.queue[i].formData.push(vm.data[i]);

        // The leading "/zuul" bypasses the Spring DispatcherServlet for big files
        vm.uploader.queue[i].url = '/zuul/file/files';
      }

      vm.uploader.uploadAll();
    };

    vm.uploader.onSuccessItem = function (fileItem, response) {
      fileItem.isProcessing = true;
      checkMetadataWriteStatus(response, 'INIT', function () {
          if (fileItem.formData[0].type == vm.TIME_SERIES) {
            Metadata.getDateColumn(response, function (possibleDateTimeColumn) {
              if (possibleDateTimeColumn) {
                Timeseries.processDataOverNode(response, possibleDateTimeColumn,
                  function () {
                    fileItem.isProcessing = false;
                  },
                  function (err) {
                    fileItem.isProcessing = false;
                    fileItem.isError = true;
                    vm.alerts.add(err);
                  }
                );
              } else {
                vm.alerts.add('Timeseries File "' + fileItem._file.name + '" does not contain a valid DateTime Column');
              }
            });
          } else {
            fileItem.isProcessing = false;
          }
        }
      );
    };

    vm.uploader.onErrorItem = function (item, response) {
      $log.error('item:', item);
      $log.error('response:', response);
      if (angular.equals(item.url, '/zuul/file/files') && angular.equals(response.message, 'Forwarding error')) {
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

    var checkMetadataWriteStatus = function (importId, status, callback) {
      var params = {
        state: status
      };

      Metadata.hasStatusWritten(importId, params, function (res) {

        if (res.hasOwnProperty('error')) {
          vm.alerts.add(res, 'danger');
          return callback();
        } else if (res === 'FINISHED' || res === 'ERROR') {
          return callback();
        }
        checkMetadataWriteStatus(importId, res, callback);
      });
    };

    vm.clickUpload = function () {
      $document[0].getElementById('uploadBtn').click();
    };

    vm.clearGeoPicker = function (index) {
      if (vm.data[index].dataType !== vm.TIME_SERIES) {
        vm.data[index].lat = '';
        vm.data[index].lng = '';
      }
    };

    vm.removeUpload = function (index) {
      vm.data.splice(index, 1);
    };

    vm.removeAllUploads = function () {
      vm.data = [];
    };

    vm.openGeoPicker = function (id) {

      var modalInstance = $uibModal.open({
        templateUrl: 'app/import/data/geoPicker/geoPicker.html',
        controller: 'GeoPickerController',
        controllerAs: 'geoPicker',
        resolve: {
          marker: function () {
            return {
              lat: vm.data[id].lat,
              lng: vm.data[id].lng
            };
          }
        }
      });

      modalInstance.result.then(function (marker) {
        vm.data[id].lat = marker.lat;
        vm.data[id].lng = marker.lng;
      }, function () {
      });
    };

  }
})();
