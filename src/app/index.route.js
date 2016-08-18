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
      .state('deimos', {
        url: '/deimos',
        templateUrl: 'app/deimos/deimos.html',
        controller: 'DeimosController',
        controllerAs: 'deimos'
      })
      .state('import', {
        url: '/import',
        templateUrl: 'app/import/import.html',
        controller: 'ImportController',
        controllerAs: 'import'
      })
      .state('model', {
        url: '/model',
        templateUrl: 'app/model/model.html',
        controller: 'ModelController',
        controllerAs: 'model'
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
