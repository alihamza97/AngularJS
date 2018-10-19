'use strict';

describe('myApp.tasks module', function() {

    beforeEach(module('myApp.tasks'));

    describe('tasks controller', function(){

        it('should ....', inject(function($controller) {
            //spec body
            var tasksCtrl = $controller('TasksCtrl');
            expect(tasksCtrl).toBeDefined();
        }));

    });
});
