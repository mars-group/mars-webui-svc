(function () {
  'use strict';

  angular
    .module('marsApp')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {},
      controller: NavbarController,
      controllerAs: 'navigation',
      bindToController: true
    };

    /** @ngInject */
    function NavbarController($http, Scenario) {
      var vm = this;

      vm.popoverTemplateUrl = 'app/components/navbar/version-popover.html';

      vm.menuItems = [
        {
          title: 'Data Management',
          children: [
            {
              title: 'Data Import',
              url: 'importData'
            },
            {
              title: 'Model Import',
              url: 'importModel'
            },
            {
              divider: 'divider'
            },
            {
              title: 'View Imports',
              url: 'importView'
            }
          ]
        },
        {
          title: 'Simulate',
          children: [
            {
              title: 'Scenario management',
              url: 'scenario'
            },
            {
              title: 'Data Mapping',
              url: 'mapping'
            },
            {
              title: 'Result Configuration',
              url: 'resultconfig'
            }
            // {
            //   title: 'Run',
            //   url: ''
            // }
          ]
        }
        // {
        //   title: 'Visualization',
        //   children: [
        //     {
        //       title: 'WebGL',
        //       url: 'webgl'
        //     }
        //   ]
        // }
      ];

      vm.projects = [
        {
          name: 'Dummy a'
        },
        {
          name: 'Dummy b'
        }
      ];

      var getScenarios = function () {
        Scenario.getScenarios(function (scenarios) {
          vm.scenarios = scenarios;
        });
      };
      getScenarios();

      vm.currentScenario = Scenario.getCurrentScenario();

      Scenario.registerOnChangeListener(function () {
        getScenarios();
        vm.currentScenario = Scenario.getCurrentScenario();
      });

      vm.setCurrentScenario = function () {
        Scenario.setCurrentScenario(vm.currentScenario);
      };

      $http.get('version.json')
        .then(function (e) {
          vm.version = e.data;
        });

    }
  }
})();
