'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /departments when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/departments");
  });


  describe('departments', function() {

    beforeEach(function() {
      browser.get('index.html#!/departments');
    });


    it('should render departments when user navigates to /departments', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('employees', function() {

    beforeEach(function() {
      browser.get('index.html#!/employees');
    });


    it('should render employees when user navigates to /employees', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
