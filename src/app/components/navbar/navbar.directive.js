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
    // TODO: find a way to remove the $scope
    function NavbarController(Scenario, $scope) {
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

      $scope.currentScenario = Scenario.getCurrentScenario();

      Scenario.registerOnChangeListener(function () {
        $scope.currentScenario = Scenario.getCurrentScenario();
      });

      vm.setCurrentScenario = function () {
        Scenario.setCurrentScenario($scope.currentScenario);
      };

    }
  }
})();

