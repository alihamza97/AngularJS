'use strict';

angular.module('myApp.calendar', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/calendar', {
            templateUrl: 'calendar/calendar.html',
            controller: 'CalendarCtrl'
        });
    }])

    .controller('CalendarCtrl', ['TaskService', '$scope', function(TaskService, $scope) {
        $scope.event = TaskService.tasks();

        for (var i = 0; i < $scope.event.length; i++) {
            $scope.event[i].start = $scope.event[i].creatioDate
            $scope.event[i].end = $scope.event[i].finishedDate;
        }

        $scope.eventSources = [$scope.event];



    }]);
