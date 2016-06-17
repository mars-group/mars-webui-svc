'use strict';

var myApp = angular.module('marsApp');

myApp.controller('ImportCtrl', ['$scope', 'Upload', function ($scope, Upload) {

  $scope.file = undefined;

  $scope.upload = function () {
    Upload.upload({
      url: '/zuul/file/files',
      file: $scope.file,
      data: {
        lat: 42,
        lng: 23,
        privacy: 'PUBLIC',
        dataType: "gis",
        projectId: 1, // todo: add real id
        userId: 1, // todo: add real id
        title: 'myTitle',
        description: "myDesc"
      }
    }).then(function (resp) {
      console.log('Success' , resp.config.data.file.name + 'uploaded. Response:', resp.data);
    }, function (err) {
      console.log('Error:', err);
    }, function (evt) {
      // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      // console.log('progress:', progressPercentage + '%', evt.config.data);
    });
  };

}]);
