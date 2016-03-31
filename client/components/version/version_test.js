'use strict';

describe('EmployeeApp.version module', function() {
  beforeEach(module('EmployeeApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
