(function () {
  'use strict';

  angular
    .module('marsApp')
    .config(routerConfig);

  function routerConfig($stateProvider, $urlRouterProvider) {
    /** @ngInject */
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('importData', {
        url: '/data-import',
        templateUrl: 'app/data-management/import/data.html',
        controller: 'ImportDataController',
        controllerAs: 'importData'
      })
      .state('importModel', {
        url: '/model-import',
        templateUrl: 'app/data-management/import/model.html',
        controller: 'ImportModelController',
        controllerAs: 'importModel'
      })
      .state('importView', {
        url: '/view-import',
        templateUrl: 'app/data-management/view/view.html',
        controller: 'ImportViewController',
        controllerAs: 'importView'
      })
      .state('mapping', {
        url: '/mapping',
        templateUrl: 'app/mapping/mapping.html',
        controller: 'MappingController',
        controllerAs: 'mapping'
      })
      .state('sim-runner', {
        url: '/sim-runner',
        templateUrl: 'app/sim-runner/sim-runner.html',
        controller: 'SimRunnerController',
        controllerAs: 'simrunner'
      })
      .state('resultconfig', {
        url: '/resultconfig',
        templateUrl: 'app/resultconfig/resultconfig.html',
        controller: 'ResultConfigController',
        controllerAs: 'resultconfig'
      })
      .state('scenario', {
        url: '/scenario',
        templateUrl: 'app/scenario/scenario.html',
        controller: 'ScenarioController',
        controllerAs: 'scenario'
      })
      .state('webgl', {
        url: '/webgl',
        templateUrl: 'app/webgl/webgl.html'
      })
    ;

    $urlRouterProvider.otherwise('/');
  }

})();
