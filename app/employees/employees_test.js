'use strict';

describe('myApp.employees module', function() {

  beforeEach(module('myApp.employees'));

  describe('employees controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var employeesCtrl = $controller('EmployeesCtrl');
      expect(employeesCtrl).toBeDefined();
    }));

  });
});