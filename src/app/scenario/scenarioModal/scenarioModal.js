(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioModalController', ScenarioModalController);

  /** @ngInject */
  function ScenarioModalController($uibModalInstance, Metadata, Scenario, Project, Alert, scenario) {
    var vm = this;

    vm.alerts = new Alert();
    vm.scenario = scenario;
    vm.models = [];

    var isCloneScenario = angular.isDefined(vm.scenario) && vm.scenario.hasOwnProperty('ScenarioId');
    var project = Project.getId();

    var params = {
      types: ['MODEL'],
      states: ['FINISHED']
    };
    Metadata.getFiltered(params, function (res) {
      if (!res.hasOwnProperty('error')) {
        vm.models = res;

        if (isCloneScenario && vm.scenario.ModelMetaData) {
          filterModelsForClone();
        }
      }
      hasModels();
    });

    var filterModelsForClone = function () {
      Metadata.getOne(vm.scenario.ModelMetaData, function (res) {
        angular.forEach(vm.models, function (e, index) {
          if (e.additionalTypeSpecificData && !angular.equals(e.additionalTypeSpecificData, res.additionalTypeSpecificData)) {
            vm.models.splice(index, 1);
          }
        });

      });
    };

    var hasModels = function () {
      if (vm.models && vm.models.length > 0) {
        vm.hasModel = true;
      } else {
        vm.alerts.add('There are no models, please import one first!', 'warning');
      }
    };

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
        Description: vm.scenario.Description,
        ModelMetaData: vm.scenario.ModelMetaData
      };

      Scenario.postScenario(data, function (res) {
        if (res.hasOwnProperty('error')) {
          callback(res.error);
        }
        setCurrentScenarioFromId(res);
      });

      var setCurrentScenarioFromId = function (id) {
        Scenario.getScenarios(function (scenarios) {
          angular.forEach(scenarios, function (e) {
            if (e.ScenarioId === id) {
              Scenario.setCurrentScenario(e);
            }
          });
          callback();
        });
      };
    };

  }

})();
