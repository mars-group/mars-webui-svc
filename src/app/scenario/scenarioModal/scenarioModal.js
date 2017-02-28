(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('ScenarioModalController', ScenarioModalController);

  /** @ngInject */
  function ScenarioModalController($uibModalInstance, Metadata, Scenario, Project, Alert, scenario, Mapping, $log) {
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

      var scenarioId;

      // create scenario
      Scenario.postScenario(data, function (res) {
        if (res.hasOwnProperty('error')) {
          return callback(res.error);
        }

        scenarioId = res;

        if (isCloneScenario) {
          loadMapping(function (mapping) {
            saveMapping(mapping);
          });
        }

        setCurrentScenario();
        callback();
      });

      // load mapping from original Scenario
      var loadMapping = function (callback) {
        Mapping.getMapping(vm.scenario.ScenarioId)
          .then(function (res) {
            callback(res);
          }, function (err) {
            $log.error(err);
            return callback(err);
          });
      };

      // save mapping to new scenario
      var saveMapping = function (mapping) {
        Mapping.putMapping(mapping, scenarioId, function (err) {
          if (err) {
            return callback(err);
          }
          loadMapping(function (mapping) {
            Mapping.putParameter(mapping, scenarioId, function (err) {
              if (err) {
                return callback(err);
              }
            });
          });
        });
      };

      // make new scenario active
      var setCurrentScenario = function () {
        Scenario.getScenario(scenarioId, function (res) {
          delete res.InitializationDescription;
          delete res.ParameterizationDescription;
          res.ScenarioId = scenarioId;
          Scenario.setCurrentScenario(res);
        });
      };

    };

  }

})();
