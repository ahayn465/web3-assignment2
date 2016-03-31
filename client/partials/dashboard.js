'use strict';

angular.module('EmployeeApp.dashboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'partials/dashboard.html',
    controller: 'dashboardCtrl'
  });
}])

.controller('dashboardCtrl', [function() {

}]);