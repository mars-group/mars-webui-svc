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
      .state('importView', {
        url: '/view-import',
        templateUrl: 'app/import/view/view.html',
        controller: 'ImportViewController',
        controllerAs: 'importView'
      })
      .state('modelAgents',{
        url:'/model-agents',
        templateUrl:'app/modeling/agents/agents.html',
        controller:'AgentController',
        controllerAs:'agents'
      })
      .state('mapping', {
        url: '/mapping',
        templateUrl: 'app/mapping/mapping.html',
        controller: 'MappingController',
        controllerAs: 'mapping'
      })
      .state('webgl', {
        url: '/webgl',
        templateUrl: 'app/webgl/webgl.html'
      })
    ;

    $urlRouterProvider.otherwise('/');
  }

})();
