(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioModalController', ScenarioModalController);

  /** @ngInject */
  function ScenarioModalController($uibModalInstance, Metadata, Scenario, Project, Alert, scenario, Mapping) {
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
      }
      hasModels();
    });

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

      // create scenario
      Scenario.postScenario(data, function (res) {
        if (res.hasOwnProperty('error')) {
          callback(res.error);
        }

        if (isCloneScenario) {
          console.log('clone scenario');
          loadMapping(res, function (mapping) {
            putMapping(mapping, res);
            putParameters(mapping, res);
          });
        }

        setCurrentScenarioFromId(res);
        callback();
      });

      // load mapping from cloned Scenario
      var loadMapping = function (scenarioId, callback) {
        Mapping.getMapping(scenarioId)
          .then(function (res) {
            if (res.status > 299) {
              vm.alerts.add(res, 'danger');
            }
            callback(res);

          }, function (err) {
            $log.error(err);
          });
      };

      // save mapping to new scenario
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

      // save Parameters to new scenario
      var putParameters = function (mapping, scenarioId) {
        Mapping.putParameter(mapping, scenarioId, function (err) {
          if (err) {
            vm.alerts.add(err.config.url + '" caused the following error: "' + err.data.Description + '"!', 'danger');
          }
          callback();
        });
      };

      // make new scenario active
      var setCurrentScenarioFromId = function (id) {
        Scenario.getScenario(id, function (res) {
          delete res.InitializationDescription;
          delete res.ParameterizationDescription;
          res.ScenarioId = id;
          Scenario.setCurrentScenario(res);
        });
      };

    };

  }

})();
