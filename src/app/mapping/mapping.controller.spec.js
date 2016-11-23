(function () {
  'use strict';

  describe('MappingController', function () {
    var vm;

    beforeEach(module('marsApp'));
    beforeEach(inject(function (_$controller_) {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      vm = _$controller_('MappingController');
    }));


    it('mein toller test', function () {
      expect(true).toEqual(true);
    });

  });

})();
