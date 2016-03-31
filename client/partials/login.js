'use strict';

angular.module('EmployeeApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', [function() {

}]);