(function () {
  'use strict';

  angular
    .module('test')
    .controller('ImportController', ImportController);

  /** @ngInject */
  function ImportController($timeout, $document, FileUploader, Metadata, Timeseries) {
    var vm = this;
    // var log = function (e) {
    //   $log.log(e)
    // };

    /** Will store initialized geoPicker*/
    vm.geoPicker = {};
    /** Stores the geoPicker caller btn element*/
    vm.geoPickerCaller = undefined;
    /** Only one marker must be set*/
    vm.markerSet = false;

    /** upload type constants */
    vm.CONST_UPLOAD_TIMESERIES = 'timeseries';
    vm.CONST_UPLOAD_TABLEBASED = 'tablebased';
    vm.CONST_UPLOAD_GIS = 'gis';

    /** file ending constants */
    vm.CONST_FILE_ENDING_CSV = 'csv';
    vm.CONST_FILE_ENDING_ZIP = 'zip';
    vm.CONST_FILE_ENDING_GEOTIFF = 'tif';
    vm.CONST_FILE_ENDING_ASC = 'asc';

    vm.uploader = new FileUploader();
    vm.file = null;
    vm.alerts = [];
    vm.data = [];

    vm.Data = function () {
      return {
        lat: '',
        lng : '',
        privacy : '',
        dataType : '',
        projectId : 1, // todo: add real id
        userId :1, // todo: add real id
        title : '',
        description : ''
      }
    };

    // types are: default(white), primary(blue), success(green), info(blue), warning(orange), danger(red)
    // defaults to info, if type is not set
    vm.addAlert = function (message, type) {
      vm.alerts.push({
        msg: message,
        type: type
      });
    };

    vm.closeAlert = function (index) {
      vm.alerts.splice(index, 1);
    };

    vm.uploader.filters.push({
      name: 'allowedFilesFilter',
      fn: function (item) {
        vm.data.push(new vm.Data());

        var split = item.name.split('.');
        var fileEnding = split[split.length - 1];
        fileEnding = fileEnding.toLowerCase();
        return fileEnding == vm.CONST_FILE_ENDING_CSV || fileEnding == vm.CONST_FILE_ENDING_ZIP
          || fileEnding == vm.CONST_FILE_ENDING_GEOTIFF || fileEnding == vm.CONST_FILE_ENDING_ASC;
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
                )
              } else {
                vm.addAlert('Timeseries File "' + fileItem._file.name + '" does not contain a valid DateTime Column');
              }
            });
          }
          /** if uploaded data was table-based */
          if (fileItem.formData[0].type == vm.CONST_UPLOAD_TABLEBASED
            || fileItem.formData[0].type == vm.CONST_UPLOAD_GIS) {
            /** display upload success */
            fileItem.isProcessing = false;
            fileItem.isSuccess = true;
          }
        }
      );
      //console.info('onSuccessItem', fileItem, response, status, headers);
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

    vm.clickUpload = function() {
      // I know it is dirty, but dunno how to do this a better way
      $document.querySelector('.my-drop-zone input[type=file]').click();
    };

    // /**
    //  * Init map for vm.geoPicker
    //  * @param caller jqery selector of calling btn
    //  * @returns initialized map object
    //  */
    // function initgeoPicker(caller) {
    //   vm.markerSet = false;
    //   $('#cur-lat').html('');
    //   $('#cur-lon').html('');
    //   vm.geoPickerCaller = caller;
    //
    //   //for details on map initialisation
    //   //visit: https://github.com/Leaflet/Leaflet.draw
    //   var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //     osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //     osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib}),
    //     map = new L.Map('map', {layers: [osm], center: new L.LatLng(0, 0), zoom: 2});
    //
    //   var drawnItems = new L.FeatureGroup();
    //   map.addLayer(drawnItems);
    //
    //   var drawControl = new L.Control.Draw({
    //     draw: {
    //       position: 'topleft',
    //       //allow only polygons in draw control
    //       polygon: false,
    //       polyline: false,
    //       rectangle: false,
    //       circle: false,
    //       marker: {
    //         zIndexOffset: 2000,
    //         repeatMode: false
    //       }
    //     },
    //     edit: {
    //       featureGroup: drawnItems
    //     }
    //   });
    //   map.addControl(drawControl);
    //
    //   //polygon create event
    //   //created polygon is stored in var curSelectedSpatialBoudaries
    //   map.on('draw:created', function (e) {
    //     var type = e.layerType,
    //       layer = e.layer;
    //
    //     if (vm.markerSet) {
    //       console.log('you can only set one marker');
    //       return;
    //     } else {
    //       vm.markerSet = true;
    //     }
    //
    //     $('#cur-lat').html(layer._latlng.lat);
    //     $('#cur-lon').html(layer._latlng.lng);
    //
    //     vm.geoPickerCaller.parent().find('.lat').val(layer._latlng.lat);
    //     vm.geoPickerCaller.parent().find('.lon').val(layer._latlng.lng);
    //
    //     drawnItems.addLayer(layer);
    //   });
    //
    //   //polygon update event
    //   map.on('draw:edited', function (e) {
    //
    //     var layers = e.layers._layers;
    //     var layer = layers[Object.keys(layers)[0]];
    //
    //     $('#cur-lat').html(layer._latlng.lat);
    //     $('#cur-lon').html(layer._latlng.lng);
    //
    //     vm.geoPickerCaller.parent().find('.lat').val(layer._latlng.lat);
    //     vm.geoPickerCaller.parent().find('.lon').val(layer._latlng.lng);
    //
    //   });
    //
    //   //polygon delete event
    //   map.on('draw:deleted', function (e) {
    //     var type = e.layerType,
    //       layer = e.layer;
    //
    //     vm.geoPickerCaller.parent().find('.lat').val('');
    //     vm.geoPickerCaller.parent().find('.lon').val('');
    //
    //     drawnItems.removeLayer(layer);
    //   });
    //
    //   return map;
    // }
    //
    // //display control for map container
    // vm.opengeoPicker = function (caller) {
    //   $('#map-borders').css('display', 'block');
    //   vm.geoPicker = initvm.geoPicker(caller);
    // };
    //
    // //hide and destroy map container
    // vm.closegeoPicker = function () {
    //   $('#map-borders').css('display', 'none');
    //   vm.geoPicker.remove();
    //   vm.geoPickerCaller = undefined;
    //   $('#map').html('');
    // };

  }
})();
