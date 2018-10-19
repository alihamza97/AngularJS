'use strict';

angular.module('myApp.departments', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/departments', {
            templateUrl: 'departments/departments.html',
            controller: 'DepartmentsCtrl'
        });
    }])

    // .controller('DepartmentsCtrl', [function($scope) {
    //	var departmentsList = this;
    //	departmentsList.departments =  [{departmentName: 'Research'},{departmentName: 'Engineering'},{departmentName: 'Business'},
    //									{departmentName: 'Automotive'}];


    //}]);
    .controller('DepartmentsCtrl', ['$scope', 'DepartmentFactory', 'EmployeeService', 'TaskService', '$http', '$window', function($scope, DepartmentFactory, EmployeeService, TaskService, $http, $window) {

        $scope.GetDetails = function (index) {
            $http.get('http://i874156.iris.fhict.nl/WEB2/departments/' + $scope.departments[index].no)
                .then(function(response) {
                    $scope.selectedDepartment = response.data;
                    if (TaskService.tasks().length == 0) {
                        $http.get('http://i874156.iris.fhict.nl/WEB2/tasks/')
                            .then(function(response) {
                                TaskService.setTasks(response.data);
                                $scope.showDetails($scope.selectedDepartment);
                            });
                    } else {
                        $scope.showDetails($scope.selectedDepartment);
                    }

                });

        };

        $scope.showDetails = function (selectedDepartment) {
            var name = selectedDepartment.name;
            var deptNo = selectedDepartment.no;
            var foundTasks = [];
            var tasks = TaskService.tasks();

            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].deptNo == deptNo) {
                    foundTasks.push(tasks[i]);
                }
            }

            var concatTasks = TaskService.concatTasks(foundTasks);

            $window.alert("Name: " + name + "\nDepartment Number: " + deptNo + "\nTasks: " + concatTasks);

        };


        if (DepartmentFactory.departments.length == 0) {
            $http.get('http://i874156.iris.fhict.nl/WEB2/departments')
                .then(function (response) {
                    DepartmentFactory.departments = response.data;
                    $scope.departments = DepartmentFactory.departments;
                });
        } else {
            $scope.departments = DepartmentFactory.departments;
        }
        $scope.number;
        $scope.name;
        $scope.code;
        // Sort the table rows
        $scope.setOrderProperty = function(propertyName) {
            if ($scope.orderProperty === propertyName) {
                $scope.orderProperty = '-' + propertyName;
            } else if ($scope.orderProperty === '-' + propertyName) {
                $scope.orderProperty = propertyName;
            } else {
                $scope.orderProperty = propertyName;
            }
        };

        $scope.btnclk = function () {
            if (!$scope.number)
            {
                alert("Enter No");
            }
            else if (!$scope.name)
            {
                alert("Enter name");
            }
            else if (!$scope.code) {
                alert("Enter code");
            }

            else {
                $scope.departments.push({ 'number': $scope.number,
                    'name': $scope.name, 'code': $scope.code});
                $scope.number = '';
                $scope.name = '';
                $scope.code = '';

            }
        };

        var key;
        $scope.edit = function (e, indx) {
            key = indx;
            $scope.no = e.no;
            $scope.name = e.name;
            $scope.code = e.code;

        };

        $scope.Update = function () {
            $scope.departments[key].no = $scope.no;
            $scope.departments[key].name = $scope.name;
            $scope.departments[key].code = $scope.code;

            $scope.number = '';
            $scope.name = '';
            $scope.code = '';

        };

        $scope.del = function (no) {
            $scope.departments.splice(no, 1);
        };


        function getEmployeesByDepartmentNumber(number) {
            return EmployeeService.getEmployeesByDepartmentNumber(number);
        }

        function employeeConcatNames(employees) {
            var concatEmployees = " ";
            (employees.forEach(function(element, index) {
                var firstName = element.firstName;
                var surname = element.surname;
                var completeName;

                if (index == 0) {

                    completeName = firstName + " " + surname + "";

            } else {
                completeName = ", " + firstName + " " + surname;
            }

                concatEmployees += completeName;
            }))

            return concatEmployees;

        }

        function assignEmployeesToDepartment() {
            if (EmployeeService.employees() == null) {
                console.log('Henter data fra employee API');
                EmployeeService.setEmployeesByAPI();
            }
            (DepartmentFactory.departments.forEach(function(element) {
                var employees = getEmployeesByDepartmentNumber(element.no);
                element.employees = EmployeeService.employeeConcatNames(employees);
            }));
        }

        function assignTasksToDepartment() {

        }

        assignEmployeesToDepartment();

    }])
    .factory('DepartmentFactory', [function() {
        var obj = {
           // departments: [{number: 0, name: "Software", code: "001", employees: "hr",}, {number: 1, name: "Accounting", code: "002", employees: ""}, {number: 2, name: "Administration", code: "002", employees: ""}],
            departments: [],
        getDepartments : function () {
                return departments;
            },

        }
        return obj;
    }])


    .service('DepartmentService', ['DepartmentFactory', '$http', function (DepartmentFactory, $http) {

        this.getDepartmentsByAPI = function() {
            $http.get('http://i874156.iris.fhict.nl/WEB2/departments')
                .then(function(response) {
                    DepartmentFactory.departments = response.data;
                });
        };

        this.setDepartments = function(response) {
            DepartmentFactory.departments = response;
        };

            this.departments = function () {
                return DepartmentFactory.departments;
            };



        this.getDepartmentByNumber = function (no) {
            // The reason there's "no-1" here, is that the department number is the same as the index+1
            // So for example, marketing has index 0, but has dep. number 1.
            // We use minus 1, so that we'll get the correct department.
            var department = DepartmentFactory.departments[no-1];
            console.log(department);

            if (typeof(department) == 'undefined') {
                return {name: "no department"}
            } else {
                return department;
            }

        }
    }]);


