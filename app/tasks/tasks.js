'use strict';

angular.module('myApp.tasks', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/tasks', {
            templateUrl: 'tasks/tasks.html',
            controller: 'TasksCtrl'
        });
    }])


    .controller('TasksCtrl', ['$scope', 'TaskFactory','EmployeeService' ,'DepartmentService', '$http', '$window', function($scope, TaskFactory, EmployeeService, DepartmentService, $http, $window) {


        if (TaskFactory.tasks.length == 0) {
            $http.get('http://i874156.iris.fhict.nl/WEB2/tasks').
            then(function(response) {

                TaskFactory.tasks = response.data;
                $scope.tasks = TaskFactory.tasks;

            });
        } else {
            $scope.tasks = TaskFactory.tasks;
        }

        $scope.GetDetails = function (index) {
            $http.get('http://i874156.iris.fhict.nl/WEB2/tasks/' + $scope.tasks[index].no)
                .then(function(response) {
                    $scope.selectedTask = response.data;

                    if (DepartmentService.departments().length == 0) {
                        $http.get('http://i874156.iris.fhict.nl/WEB2/departments/')
                            .then(function(response) {
                                DepartmentService.setDepartments(response.data);
                                $scope.showDetails($scope.selectedTask);
                            });
                    } else {
                        $scope.showDetails($scope.selectedTask);

                    }

                });
        };

        $scope.showDetails = function (selectedTask) {
            var title = selectedTask.title;
            var description = selectedTask.description;
            var status = selectedTask.status;
            var departmentNo = selectedTask.deptNo;
            console.log(departmentNo);

            $window.alert("Title: " + title +
                "\nDescription: " + description +
                "\nStatus: " + status +
                "\nDepartment: " + DepartmentService.getDepartmentByNumber(departmentNo).name);

        };



        $scope.setOrderProperty = function(propertyName) {
            if ($scope.orderProperty === propertyName) {
                $scope.orderProperty = '-' + propertyName;
            } else if ($scope.orderProperty === '-' + propertyName) {
                $scope.orderProperty = propertyName;
            } else {
                $scope.orderProperty = propertyName;
            }
        };


        // $scope.nameEditField = ""
        // $scope.editedTask = ""


        $scope.del = function($index) {
             TaskFactory.del($index);
        };


        $scope.edit = function(task) {
            $scope.editedTask = task;
            $scope.titleEditField = task.title;
            $scope.descEditField = task.description;
            $scope.statusEditField = task.status;
            $scope.startEditField = task.creatioDateField;
            $scope.endEditField = task.finishedDate;

        };

        $scope.update = function() {
            TaskFactory.update($scope.titleEditField, $scope.editedTask);

            $scope.clear();

        };

        $scope.add = function() {
            var task = {title: $scope.nameEditField.valueOf()};
            TaskFactory.tasks.push(task);

            $scope.clear()

        };

        $scope.clear = function() {
            $scope.nameEditField = "";
            $scope.editedTask = "";
        };

        function assignDepartmentToTask() {
            (TaskFactory.tasks.forEach(function(element) {
                element.department = DepartmentService.getDepartmentByNumber(element.deptNo).name;

            }));

        }

        function assignEmployeesToTasks() {
            var employees = EmployeeService.employees();

            var tempEmployeesToAdd = [];
            (TaskFactory.tasks.forEach(function(task) {
                // Iterates through the employee array, and finds the corresponding employee from their ID:
                // ie. If a task has [0, 2] then it will find the employees with those indexes
                (task.employeeNumbers.forEach(function(employeeNumber){
                    tempEmployeesToAdd.push(employees[employeeNumber])
                }))
                task.employees = EmployeeService.employeeConcatNames(tempEmployeesToAdd);
                tempEmployeesToAdd = [];
            }))
        }


          //  assignEmployeesToTasks();




    }])

    .factory("TaskFactory", [function(){
    var obj = {
        // tasks: [{title: "Develop new front-end", start: "2018-02-01", deadline: "29-03-2018", department: "", departmentNumber: 0, employees: [], employeeNumbers: [0, 1, 2]},
        //     {title: "Meeting with investors", start: "2018-03-08", end:"2018-03-10" ,deadline: "02-04-2018", department: "", departmentNumber: 2, employees: [], employeeNumbers: [3,4]},
        //     {title: "Calculate taxes for Q2", start: "2018-03-04", deadline: "01-04-2018", department: "", departmentNumber: 0, employees: [], employeeNumbers: [5,7]},
        //     {title: "Launder money", start: "2018-03-01", deadline: "06-05-2018", department: "", departmentNumber: 1, employees: [], employeeNumbers: [0, 1, 2]}],
        tasks: [],

        nameEditField : "",
        editedTask : "",
        department: "",



    del: function($index) {
        obj.tasks.splice($index, 1);
    },

        getTasks: function() {
            return tasks;
        },

    edit: function(task) {
        obj.nameEditField = task.text;
        obj.editedTask = task;

    },
        nameEdit: function (nameEdit) {
            obj.nameEditField = nameEdit;
            return obj.nameEditField;
            },

    update: function(nameEditField, task) {
        task.title = nameEditField;
        obj.nameEditField = "";

    },

    add: function() {
        tasks.push(task);

    },

    cancel: function() {
        obj.nameEditField = "";
        obj.editedTask = "";
    },
}
    return obj;
}])

.service('TaskService', ['TaskFactory', '$http', function(TaskFactory, $http) {
    this.tasks = function() {
         return TaskFactory.tasks;
    };

    this.getTasksByAPI = function() {
        $http.get('http://i874156.iris.fhict.nl/WEB2/tasks').then(function(response) {
            TaskFactory.tasks = response.data;
        });
    };

    this.setTasks = function(list) {
        TaskFactory.tasks = list;

    },

    this.addTask = function(task) {
        TaskFactory.tasks.push(task);
    }

    this.getTaskById = function(index) {
        return TaskFactory.tasks[index-1];
    }

    this.concatTasks = function(list) {
        var concatTasks = " ";
        (list.forEach(function(element, index) {
            var title = element.title;

            if (index > 0) {

                title = ", " + title;
            }

            concatTasks += title;
        }))

        return concatTasks;
    }

}])

.directive('addTask', ['TaskService', function(TaskService) {
    return {

        restrict: 'AE',

        link : function (scope, element, attrs) {
            scope.no = "";
            scope.deptNo = "";
            scope.title = "";
            scope.description = "";
            scope.status = "";
            scope.finishedDate = "";
            scope.creatioDate = "";


            scope.addTask = function() {
                var task = {no: scope.no, deptNo : scope.deptNo, title: scope.title,
                    description : scope.description, status : scope.status,
                    finishedDate : scope.finishedDate, creatioDate : scope.creatioDate};

                TaskService.addTask(task);

                scope.no = "";
                scope.deptNo = "";
                scope.title = "";
                scope.description = "";
                scope.status = "";
                scope.finishedDate = "";
                scope.creatioDate = "";

            }

        },

        templateUrl: 'tasks/add-task.html'


        }

    }

]);


