'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'myApp.dashboard',
  'myApp.calendar',
  'myApp.departments',
  'myApp.employees',
  'myApp.tasks',
  'myApp.version',
    'myApp.calendar',
    'ui.calendar'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/dashboard'});
}])


