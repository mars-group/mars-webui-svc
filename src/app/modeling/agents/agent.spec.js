(function () {
  'use strict';

  /**
   * @todo Complete the test
   * This example is not perfect.
   */
  describe('directive navbar', function () {
    var vm;
    var el;
    var timeInMs;

    beforeEach(module('marsApp'));
    beforeEach(inject(function ($compile, $rootScope) {

      timeInMs = new Date();
      timeInMs = timeInMs.setHours(timeInMs.getHours() - 24);

      el = angular.element('<acme-navbar creation-date="' + timeInMs + '"></acme-navbar>');

      $compile(el)($rootScope.$new());
      $rootScope.$digest();
      vm = el.isolateScope().vm;
    }));

    it('should be compiled', function () {
      expect(1).toEqual(1);
    });


  });
})();
