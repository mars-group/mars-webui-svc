(function () {
  'use strict';

  angular
    .module('marsApp')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
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
      .state('importData', {
        url: '/data-import',
        templateUrl: 'app/import/data/data.html',
        controller: 'ImportDataController',
        controllerAs: 'importData'
      })
      .state('importModel', {
        url: '/model-import',
        templateUrl: 'app/import/model/model.html',
        controller: 'ImportModelController',
        controllerAs: 'importModel'
      })
      .state('webgl', {
        url: '/webgl',
        templateUrl: 'app/webgl/webgl.html'
      })
    ;

    $urlRouterProvider.otherwise('/');
  }

})();
