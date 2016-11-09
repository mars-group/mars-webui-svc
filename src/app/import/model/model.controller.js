(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ImportModelController', ImportModelController);

  /** @ngInject */
  function ImportModelController($log, $document, FileUploader, Metadata, Alert, Project) {
    var vm = this;

    vm.alerts = new Alert();
    vm.uploader = new FileUploader();
    vm.file = null;
    vm.data = [];
    vm.showOneUploadAtATime = true;

    vm.Data = function () {
      return {
        privacy: '',
        dataType: 'MODEL',
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
      for (var i = 0; i < vm.uploader.queue.length; i++) {
        vm.uploader.queue[i].formData.push(vm.data[i]);

        // The leading "/zuul" bypasses the Spring DispatcherServlet for big files
        vm.uploader.queue[i].url = '/zuul/file/files/models';
      }

      vm.uploader.uploadAll();
    };

    vm.uploader.onSuccessItem = function (fileItem, response) {
      fileItem.isProcessing = true;
      checkMetadataWriteStatus(response, 'INIT', function () {
          fileItem.isProcessing = false;
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
        vm.alerts.add('Only ZIP files are allowed');
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


    vm.removeUpload = function (index) {
      vm.data.splice(index, 1);
    };

    vm.removeAllUploads = function () {
      vm.data = [];
    };


  }
})();
