(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioModalController', ScenarioModalController);

  /** @ngInject */
  function ScenarioModalController($uibModalInstance, Scenario, Metadata, Project) {
    var vm = this;

    vm.scenario = {};

    var project = Project.getCurrentProject().id;

    var params = {
      type: 'MODEL',
      states: 'FINISHED'
    };
    Metadata.getFiltered(params, function (res) {
      if (!res.hasOwnProperty('error')) {
        vm.models = res;
      }
    });

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    vm.save = function () {
      if (vm.form.$valid) {
        persist(function (err) {
          $uibModalInstance.close(err);
        });
      }
    };

    var persist = function (callback) {
      var data = {
        Owner: 'me',
        Project: project,
        Name: vm.scenario.name,
        Description: vm.scenario.description,
        ModelIdentifier: vm.scenario.model
      };

      Scenario.postScenario(data, function (res) {
        if (res.status !== 200) {
          callback(res.data);
        }
        callback();
      });
    };

  }

})();
