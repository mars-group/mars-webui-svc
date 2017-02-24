(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioModalController', ScenarioModalController);

  /** @ngInject */
  function ScenarioModalController($uibModalInstance, $log, Metadata, Scenario, Mapping, Project, Alert, scenario) {
    var vm = this;

    vm.alerts = new Alert();
    vm.scenario = scenario;

    var isCloneScenario = angular.isDefined(vm.scenario) && vm.scenario.hasOwnProperty('ScenarioId');
    var project = Project.getId();

    var params = {
      types: ['MODEL'],
      states: ['FINISHED']
    };
    Metadata.getFiltered(params, function (res) {
      if (!res.hasOwnProperty('error')) {
        vm.models = res;
      }
      hasModels();
    });

    var hasModels = function () {
      if (vm.models && vm.models.length > 0) {
        vm.hasModel = true;

        // set active model
        if (isCloneScenario) {
          vm.scenario.Model = vm.scenario.ModelMetaData;
        }
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
        ModelMetaData: vm.scenario.Model
      };

      var loadMapping = function (scenarioId, callback) {
        Mapping.getMapping(scenarioId)
          .then(function (res) {
            if (res.status > 299) {
              vm.alerts(res, 'danger');
            }
            callback(res);

          }, function (err) {
            $log.error(err);
          });
      };

      Scenario.postScenario(data, function (res) {
        if (res.hasOwnProperty('error')) {
          callback(res.error);
        }
        callback();
      });

      var putMapping = function (mapping, scenarioId) {
        Mapping.putMapping(mapping, scenarioId, function (err) {
          if (err) {
            vm.alerts.add(err.config.url + '" caused the following error: "' + err.data.Description + '"!', 'danger');
          }
          loadMapping(scenarioId, function (res) {
            putParameters(res, scenarioId);
          });
        });
      };

      var putParameters = function (mapping, scenarioId) {
        Mapping.putParameter(mapping, scenarioId, function (err) {
          if (err) {
            vm.alerts.add(err.config.url + '" caused the following error: "' + err.data.Description + '"!', 'danger');
          }
          callback();
        });
      };

    };

  }

})();
