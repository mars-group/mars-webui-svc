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
    ;

    $urlRouterProvider.otherwise('/');
  }

})();
