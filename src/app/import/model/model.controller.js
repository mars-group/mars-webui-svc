(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ImportModelController', ImportModelController);

  /** @ngInject */
  function ImportModelController($timeout, $document, FileUploader, Metadata, Alert) {
    var vm = this;

    vm.alert = Alert;
    vm.uploader = new FileUploader();
    vm.file = null;
    vm.data = [];
    vm.showOneUploadAtATime = true;


    vm.Data = function () {
      return {
        privacy: '',
        dataType: 'MODEL',
        projectId: 1, // todo: add real id
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
        return fileEnding == 'zip';
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
        vm.uploader.queue[i].formData.push(vm.data[i]);

        // The leading "/zuul" bypasses the Spring DispatcherServlet for big files
        vm.uploader.queue[i].url = '/zuul/file/files/models';
      }

      vm.uploader.uploadAll();
    };

    /** further processing after upload */
    vm.uploader.onSuccessItem = function (fileItem, response) {
      /** setting status to processing */
      fileItem.isProcessing = true;
      checkMetadataWriteStatus(Metadata, response, 100, 5, 0,
        /** callback when metadata is written*/
        function () {
          /** display upload success */
          fileItem.isProcessing = false;
          fileItem.isSuccess = true;
        }
      );
    };

    /** Error routine if file cant be added to upload queue */
    vm.uploader.onWhenAddingFileFailed = function (item, filter) {
      /** if filter 'allowedFilesFilter' was not passed*/
      if (filter.name == 'allowedFilesFilter') {
        vm.alert.add('Only ZIP files are allowed');
      }
      /** if filter 'uniqueFilenameFilter' was not passed*/
      if (filter.name == 'uniqueFilenameFilter') {
        vm.alert.add(item.name + ' is already in the upload queue');
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
          vm.alert.add('max. tries of ' + maxTries + ' reached in Metadadata write-check for import ' + importId);
        }
      });
    }

    vm.clickUpload = function () {
      $document[0].getElementById('uploadBtn').click();
    };


    vm.removeUpload = function (index) {
      vm.data.splice(index, 1);
    };

    vm.removeAllUploads = function () {
      vm.data = [];
    };


  }
})();
