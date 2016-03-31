'use strict';

// Declare app level module which depends on views, and components
angular.module('EmployeeApp', [
  'ngRoute',
  'EmployeeApp.login',
  'EmployeeApp.dashboard',
  'EmployeeApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
