(function() {
  'use strict';

  angular
    .module('test')
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
      .state('model', {
        url: '/model',
        templateUrl: 'app/model/model.html',
        controller: 'ModelController',
        controllerAs: 'model'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
