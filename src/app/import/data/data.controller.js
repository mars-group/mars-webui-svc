(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ImportDataController', ImportDataController);

  /** @ngInject */
  function ImportDataController($timeout, $uibModal, $document, FileUploader, Metadata, Timeseries) {
    var vm = this;

    /** Will store initialized geoPicker*/
    vm.geoPicker = {};
    /** Stores the geoPicker caller btn element*/
    vm.geoPickerCaller = undefined;
    /** Only one marker must be set*/
    vm.markerSet = false;

    /** upload type constants */
    vm.CONST_UPLOAD_TIMESERIES = 'TIME_SERIES';
    vm.CONST_UPLOAD_TABLEBASED = 'TABLE_BASED';
    vm.CONST_UPLOAD_GIS = 'GIS';

    /** file ending constants */
    vm.CONST_FILE_ENDING_CSV = 'csv';
    vm.CONST_FILE_ENDING_ZIP = 'zip';
    vm.CONST_FILE_ENDING_GEOTIFF = 'tif';
    vm.CONST_FILE_ENDING_ASC = 'asc';

    vm.uploader = new FileUploader();
    vm.file = null;
    vm.alerts = [];
    vm.data = [];

    vm.showOneUploadAtATime = true;

    vm.Data = function () {
      return {
        lat: '',
        lng: '',
        privacy: '',
        dataType: '',
        projectId: 1, // todo: add real id
        userId: 1, // todo: add real id
        title: '',
        description: ''
      };
    };

    // types are: default(white), primary(blue), success(green), info(blue), warning(orange), danger(red)
    // defaults to info, if type is not set
    vm.addAlert = function (message, type) {
      vm.alerts.push({
        msg: message,
        type: type
      });
    };

    vm.removeAlert = function (index) {
      vm.alerts.splice(index, 1);
    };

    vm.uploader.filters.push({
      name: 'allowedFilesFilter',
      fn: function (item) {
        vm.data.push(new vm.Data());

        var split = item.name.split('.');
        var fileEnding = split[split.length - 1];
        fileEnding = fileEnding.toLowerCase();
        return fileEnding == vm.CONST_FILE_ENDING_CSV || fileEnding == vm.CONST_FILE_ENDING_ZIP ||
          fileEnding == vm.CONST_FILE_ENDING_GEOTIFF || fileEnding == vm.CONST_FILE_ENDING_ASC;
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
          vm.addAlert('Please provide a title for data file \'' + filename + '\'');
          return false;
        }
        /** geo coords must be set and valid if data type is TimeSeries*/
        if (vm.data[i].dataType == vm.CONST_UPLOAD_TIMESERIES) {
          var patternDecimal = /-?[0-9]+\.[0-9]+/;
          if (!patternDecimal.test(vm.data[i].lat) || !patternDecimal.test(vm.data[i].lng)) {
            vm.addAlert('Please provide valid LAT and LON (decimals) for data file \'' + filename + '\'');
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
      checkMetadataWriteStatus(Metadata, importId, 100, 5, 0,
        /** callback when metadata is written*/
        function () {
          /** if uploaded data was time-series */
          if (fileItem.formData[0].type == vm.CONST_UPLOAD_TIMESERIES) {
            Metadata.getPossibleDateColumn(importId, function (possibleDateTimeColumn) {
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
                    vm.addAlert(err);
                  }
                );
              } else {
                vm.addAlert('Timeseries File "' + fileItem._file.name + '" does not contain a valid DateTime Column');
              }
            });
          }
          /** if uploaded data was table-based */
          if (fileItem.formData[0].type == vm.CONST_UPLOAD_TABLEBASED ||
            fileItem.formData[0].type == vm.CONST_UPLOAD_GIS) {
            /** display upload success */
            fileItem.isProcessing = false;
            fileItem.isSuccess = true;
          }
        }
      );
    };

    /** Error routine if file cant be added to upload queue */
    vm.uploader.onWhenAddingFileFailed = function (item, filter) {
      /** if filter 'allowedFilesFilter' was not passed*/
      if (filter.name == 'allowedFilesFilter') {
        vm.addAlert('Only AsciiGrid, GeoTiff, CSV and ZIP files are allowed');
      }
      /** if filter 'uniqueFilenameFilter' was not passed*/
      if (filter.name == 'uniqueFilenameFilter') {
        vm.addAlert(item.name + ' is already in the upload queue');
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

        if (tries > maxTries) {
          vm.addAlert('max. tries of ' + maxTries + ' reached in Metadadata write-check for import ' + importId);
        }
      });
    }

    vm.clickUpload = function () {
      $document[0].getElementById('uploadBtn').click();
    };

    vm.clearGeoPicker = function (index) {
      // this removes the geo coordinate, when the user switches the dataType to GIS, since no coordinate is needed.
      if (vm.data[index].dataType === vm.CONST_UPLOAD_GIS) {
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
        // console.log('Modal dismissed at: ' + new Date());
      });
    };

  }
})();
