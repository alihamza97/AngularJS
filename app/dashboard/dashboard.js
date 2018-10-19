'use strict';

angular.module('myApp.dashboard', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        });
    }])

    .controller('DashboardCtrl', ['$scope', 'TaskService', 'EmployeeService', 'DepartmentService','$http' ,function($scope, TaskService, EmployeeService, DepartmentService,$http) {


        // Show pirate!
       // Cross Origin issue, so no connection to API

        // var apiUrl = 'https://i886625.venus.fhict.nl/pirates.json';
        // $http.get(apiUrl).then(function(response) {
        //     var response = response.data;
        //
        //     var firstPirate = response[0];
        //
        //     $scope.pirateName = firstPirate.name;
        //     $scope.pirateLife = firstPirate.life;
        //     $scope.pirateYearsActive = firstPirate.years_active;
        //     $scope.pirateCountryOfOrigin = firstPirate.countryOfOrigin;
        //     $scope.pirateComments = firstPirate.comments;
        //
        // });





        $http.get('http://i874156.iris.fhict.nl/WEB2/tasks')
            .then(function(response) {
                $scope.tasks = response.data;
            });
        $http.get('http://i874156.iris.fhict.nl/WEB2/departments')
            .then(function(response) {
                $scope.departments = response.data;
            });

        $http.get('http://i874156.iris.fhict.nl/WEB2/employees')
            .then(function(response) {
                $scope.employees = response.data;
            });
        $scope.tasks = TaskService.tasks();
        $scope.employees = EmployeeService.employees();
        $scope.departments = DepartmentService.departments();



    }]);

