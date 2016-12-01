(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioModalController', ScenarioModalController);

  /** @ngInject */
  function ScenarioModalController($uibModalInstance, Scenario, Metadata, Project, Alert, scenario) {
    var vm = this;

    vm.alerts = new Alert();

    if (scenario) {
      vm.scenario = scenario;
    } else {
      vm.scenario = {};
    }
    console.log('scenario:', scenario);

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
        Name: vm.scenario.Name,
        Description: vm.scenario.Description
      };

      if (!vm.scenario.ScenarioId) {
        data.ModelIdentifier = vm.scenario.Model;
      }

      Scenario.postScenario(data, function (res) {
        if (res.hasOwnProperty('error')) {
          return callback(res.error);
        }
        callback();
      });
    };

    var hasModels = function () {
      var filter = {
        types: ['MODEL'],
        state: 'FINISHED'
      };
      Metadata.getFiltered(filter, function (res) {
        if (!res.hasOwnProperty('error') && res.length > 0) {
          vm.hasModel = true;
        } else {
          vm.alerts.add('There are no models, please import one first!', 'warning');
        }
      });
    };
    hasModels();

  }

})();
