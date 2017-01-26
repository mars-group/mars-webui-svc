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

      vm.versionPopoverTemplateUrl = 'app/components/navbar/versionPopover.html';
      vm.serviceErrors = false;
      vm.currentScenario = Scenario.getCurrentScenario();

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
          title: 'Setup',
          children: [
            {
              title: 'Scenario Management',
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
          ]
        },
        {
          title: 'Simulation',
          children: [
            {
              title: 'Execution Config',
              url: ''
            },
            {
              title: 'Run',
              url: 'simrunner'
            }
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
        Scenario.getScenarios(function (res) {
          if (!res.hasOwnProperty('error')) {
            vm.scenarios = res;
          }
        });
      };
      getScenarios();

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
