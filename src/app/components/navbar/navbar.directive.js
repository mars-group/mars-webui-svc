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
      scope: {
        creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    /** @ngInject */
    function NavbarController() {
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

    }
  }
})();

