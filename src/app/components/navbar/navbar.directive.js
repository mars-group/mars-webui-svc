(function () {
  'use strict';

  angular
    .module('test')
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

      vm.menuItems = [{
        title: 'Data Management',
        url: '',
        children: [{
          title: 'Import',
          url: 'import'
        },
          {
            title: 'Datasets (DEIMOS)',
            url: ''
          }]
      }, {
        title: 'Create Model',
        url: '',
        children: [{
          title: 'Agents',
          url: 'model'
        },
          {
            title: 'Layers',
            url: ''
          }]
      }, {
        title: 'Simulate',
        url: '',
        children: [{
          title: 'Data Mapping',
          url: ''
        },
          {
            title: 'Run',
            url: ''
          }]
      }];

      vm.projects = [{
        name: 'Dummy a'
      }, {
        name: 'Dummy b'
      }];

    }
  }
})();

