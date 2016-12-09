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
    function NavbarController($http, Scenario, ServiceState) {
      var vm = this;

      vm.serviceErrorPopoverTemplateUrl = 'app/components/navbar/serviceStatePopover.html';
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

      var getServiceStates = function () {
        ServiceState.getAll(function (res) {
          if (!res.hasOwnProperty('error')) {
            vm.serviceStates = res;
            calcServiceStateClass();
          }
        });

        vm.serviceErrors = true;
      };
      getServiceStates();

      var calcServiceStateClass = function () {
        vm.serviceStateClass = null;

        angular.forEach(vm.serviceStates, function (status, service) {
          // break forEach if value has been set
          if (vm.serviceStateClass) {
            return;
          }

          if (status === 'DOWN') {
            if (service === 'MONGODB' || service === 'METADATA-SERVICE') {
              vm.serviceStateClass = 'service-state-error';
            } else {
              vm.serviceStateClass = 'service-state-warning';
            }
          }
        });

        if (!vm.serviceStateClass) {
          vm.serviceStateClass = 'service-state-ok';
        }
      };

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
