'use strict';

angular.module('myApp.employees', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/employees', {
            templateUrl: 'employees/employees.html',
            controller: 'EmployeesCtrl'
        });
    }])


    .controller('EmployeesCtrl', ['$scope', 'EmployeeFactory', 'DepartmentService', '$window', '$http', function($scope, EmployeeFactory, DepartmentService, $window, $http) {



        $scope.employees = EmployeeFactory.employees;

        $scope.firstNameEditField = "";
        $scope.surnameEditField = "";
        $scope.birthDateEditField = "";
        $scope.editedEmployee = "";

        if (EmployeeFactory.employees.length == 0) {
            $http.get('http://i874156.iris.fhict.nl/WEB2/employees')
                .then(function (response) {
                    EmployeeFactory.employees = response.data;
                    $scope.employees = EmployeeFactory.employees;
                });
        } else {
            $scope.employees = EmployeeFactory.employees;
        }




        $scope.GetDetails = function (index) {
            $http.get('http://i874156.iris.fhict.nl/WEB2/employees/' + $scope.employees[index].no)
                .then(function(response) {
                    $scope.selectedEmployee = response.data;
                    if (DepartmentService.departments().length == 0) {
                        $http.get('http://i874156.iris.fhict.nl/WEB2/departments/')
                            .then(function(response) {
                                DepartmentService.setDepartments(response.data);
                            showDetails($scope.selectedEmployee);
                        });
                    } else {
                        showDetails($scope.selectedEmployee);
                    }

                });

        };

        var showDetails = function (selectedEmployee) {
            var firstName = selectedEmployee.firstName;
            var lastName = selectedEmployee.lastName;
            var departmentNumber = selectedEmployee.departments[0].no;
            var department = getDepartmentByNumber(departmentNumber).name;
            console.log(departmentNumber);

            $window.alert("Name: " + firstName + "\nLast Name: " + lastName + "\nDepartment: " + department );

        };


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

        $scope.getDepartmentForEmployees = function () {
           return EmployeeFactory.departments;
        };


        $scope.del = function($index) {
            $scope.employees.splice($index, 1);

        };

        $scope.edit = function(employee) {
            $scope.firstNameEditField = employee.firstName;
            $scope.lastNameEditField = employee.lastName;
            $scope.birthDateEditField = employee.birthDate;
            $scope.editedEmployee = employee;


        };

        $scope.update = function() {
            $scope.editedEmployee.firstName = $scope.firstNameEditField;
            $scope.editedEmployee.lastName = $scope.lastNameEditField;
            $scope.birthDateEmployee.email = $scope.birthDateEditField;
            $scope.clear();

        };

        $scope.add = function() {
            var employee = {firstName: $scope.firstNameEditField.valueOf(), lastName: $scope.lastNameEditField.valueOf(),
                birthDate: $scope.birthDateEditField.valueOf()};
            $scope.employees.push(employee);
            $scope.clear();

        };

        $scope.clear = function() {
            $scope.firstNameEditField = "";
            $scope.lastNameEditField = "";
            $scope.birthDateEditField = "";
            $scope.editedEmployee = "";
        };

         function getDepartmentByNumber(number) {
                return DepartmentService.getDepartmentByNumber(number);
            }

            function assignDepartmentsToEmployees(number) {
                (EmployeeFactory.employees.forEach(function(element) {
                    element.department = getDepartmentByNumber(element.departmentNumber).name;

                }));

            }

       // assignDepartmentsToEmployees();


    }])

    .factory("EmployeeFactory", [function(){
        var employeeObj = {
            employees: [],

            del: function($index) {
                employeeObj.employees.splice($index, 1)
            },

            getEmployees: function() {
                return employees;
            },

            edit: function(employee) {
                employeeObj.firstNameEditField = employee.firstName;
                employeeObj.lastNameEditField = employee.lastName;
                employeeObj.birthDateEditField = employee.birthDate;
                employeeObj.editedEmployee = employee;



            },

            update: function() {
                employeeObj.editedEmployee.firstName = $scope.firstNameEditField;
                employeeObj.editedEmployee.lastName = $scope.lastNameEditField;
                employeeObj.editedEmployee.birthDate = $scope.birthDateEditField;

                employeeObj.firstNameEditField = "";
                employeeObj.lastNameEditField = "";
                employeeObj.birthDateEditField = "";
            },

            add: function() {
                var employee = {firstName: employeeObj.firstNameEditField.valueOf(),
                    lastName: employeeObj.lastNameEditField.valueOf(),
                    birthDate: employeeObj.birthDateEditField.valueOf()};
                    employeeObj.employees.push(employee);
            },

            cancel: function() {
                employeeObj.firstNameEditField = "";
                employeeObj.lastNameEditField = "";
                employeeObj.birthDateEditField = "";
                employeeObj.editedEmployee = "";
                },



            }

            return employeeObj;
    }])

    .service('EmployeeService', ['EmployeeFactory', '$http', function (EmployeeFactory, $http) {

        this.setEmployeesByAPI = function() {
            $http.get('http://i874156.iris.fhict.nl/WEB2/employees')
                .then(function(response) {
                    EmployeeFactory.employees = response.data;
                    console.log("Har hentet data fra API'et");
                });

        };


        this.employees = function () {
            return EmployeeFactory.employees;
        };

        this.getEmployeesByDepartmentNumber = function(number) {
            var employees = [];

            (EmployeeFactory.employees.forEach(function(element){
                if (element.departmentNumber == number) {
                    employees.push(element);
                }
            }));

            return employees;
        };

         this.employeeConcatNames = function(employees) {
            var concatEmployees = " ";
            (employees.forEach(function(element, index) {
                var firstName = element.firstName;
                var lastName = element.lastName;
                var completeName;

                if (index == 0) {

                    completeName = firstName + " " + lastName + "";

                } else {
                    completeName = ", " + firstName + " " + lastName;
                }

                concatEmployees += completeName;
            }))

            return concatEmployees;

        }


    }]);