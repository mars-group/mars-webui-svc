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
    function NavbarController(Scenario) {
      var vm = this;

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
            },
            {
              title: 'Run',
              url: ''
            }
          ]
        },
        {
          title: 'WebGL',
          children: [
            {
              title: 'Test',
              url: 'webgl'
            }
          ]
        }
      ];

      vm.projects = [
        {
          name: 'Dummy a'
        },
        {
          name: 'Dummy b'
        }
      ];

      // TODO: create project service
      var project = 42;
      Scenario.getScenarios(project, function (scenarios) {
        vm.scenarios = scenarios;
      });

      vm.currentScenario = Scenario.getCurrentScenario();

      Scenario.registerOnChangeListener(function () {
        vm.currentScenario = Scenario.getCurrentScenario();
      });

      vm.setCurrentScenario = function () {
        Scenario.setCurrentScenario(vm.currentScenario);
      };

    }
  }
})();
