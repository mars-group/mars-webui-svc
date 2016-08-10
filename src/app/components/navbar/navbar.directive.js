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

      vm.menuItems = [{
        title: 'Data Management',
        children: [
          {
            title: 'Import',
            url: 'import'
          },
          {
            title: 'View',
            url: 'deimos'
          }]
      }, {
        title: 'Create Model',
        children: [
          {
            title: 'Agents',
            url: 'model'
          },
          {
            title: 'Layers',
            url: ''
          }]
      }, {
        title: 'Simulate',
        children: [
          {
            title: 'Data Mapping',
            url: ''
          },
          {
            title: 'Run',
            url: ''
          }]
      },
        {
          title: 'WebGl',
          children: [
            {
              title: 'Test',
              url: 'webgl'
            }]
        }];

      vm.projects = [
        {
          name: 'Dummy a'
        },
        {
          name: 'Dummy b'
        }];

    }
  }
})();

