(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ImportDataController', ImportDataController);

  /** @ngInject */
  function ImportDataController($timeout, $uibModal, $document, $log, FileUploader, Metadata, Timeseries, Alert, Project) {
    var vm = this;

    /** Will store initialized geoPicker*/
    vm.geoPicker = {};
    /** Stores the geoPicker caller btn element*/
    vm.geoPickerCaller = undefined;
    /** Only one marker must be set*/
    vm.markerSet = false;

    /** upload type constants */
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
      /** validation */
      for (var i = 0; i < vm.uploader.queue.length; i++) {
        var filename = vm.uploader.queue[i]._file.name;
        /** title must be set */
        if (vm.title === '') {
          vm.alerts.add('Please provide a title for data file \'' + filename + '\'');
          return false;
        }
        /** geo coords must be set and valid if data type is TimeSeries*/
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

    /** further processing after upload */
    vm.uploader.onSuccessItem = function (fileItem, response) {
      /** setting status to processing */
      fileItem.isProcessing = true;
      var importId = response;
      checkMetadataWriteStatus(Metadata, importId, 500, 20, 0,
        /** callback when metadata is written*/
        function () {
          /** if uploaded data was time-series */
          if (fileItem.formData[0].type == vm.TIME_SERIES) {
            Metadata.getDateColumn(importId, function (possibleDateTimeColumn) {
              if (possibleDateTimeColumn) {
                Timeseries.processDataOverNode(importId, possibleDateTimeColumn,
                  function () {
                    /** display upload success */
                    fileItem.isProcessing = false;
                    fileItem.isSuccess = true;
                  },
                  function (err) {
                    fileItem.isProcessing = false;
                    fileItem.isSuccess = false;
                    fileItem.isError = false;
                    vm.alerts.add(err);
                  }
                );
              } else {
                vm.alerts.add('Timeseries File "' + fileItem._file.name + '" does not contain a valid DateTime Column');
              }
            });
          } else {
            /** display upload success */
            fileItem.isProcessing = false;
            fileItem.isSuccess = true;
          }
        }
      );
    };

    vm.uploader.onErrorItem = function (item, response, status) {
      $log.error('item:', item);
      $log.error('response:', response);
      $log.error('status:', status);
      vm.alerts.add('There was an error while processing ' + item + '. The error was: ' + response, 'danger');
    };

    /** Error routine if file cant be added to upload queue */
    vm.uploader.onWhenAddingFileFailed = function (item, filter) {
      /** if filter 'allowedFilesFilter' was not passed*/
      if (filter.name == 'allowedFilesFilter') {
        vm.alerts.add('Only AsciiGrid, GeoTiff, CSV and ZIP files are allowed');
      }
      /** if filter 'uniqueFilenameFilter' was not passed*/
      if (filter.name == 'uniqueFilenameFilter') {
        vm.alerts.add(item.name + ' is already in the upload queue');
      }
    };

    /**
     * recursively check if Metadata is written
     * @param Metadata  Metadata Angular Service
     * @param importId  importId to check metadata status for
     * @param interval  ms to wait until the next check will be performed
     * @param maxTries  maximum checks to perform
     * @param tries     the value of this parameter should be 0, because it is used as counter
     *                  inside of the recursion
     * @param callback  callback that will be performed when metadata has been written
     */
    function checkMetadataWriteStatus(Metadata, importId, interval, maxTries, tries, callback) {
      Metadata.hasStatusWritten(importId, function (hasStatusWritten) {
        if (!hasStatusWritten && tries <= maxTries) {
          $timeout(function () {
            checkMetadataWriteStatus(Metadata, importId, interval, maxTries, tries + 1, callback);
          }, interval);
        }

        /**
         * execute success callback
         */
        if (hasStatusWritten) {
          callback();
        }

      });
    }

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
