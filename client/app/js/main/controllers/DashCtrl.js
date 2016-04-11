app.controller('DashCtrl', ['$scope', 'AuthenticationService', 'UserService', function($scope, AuthenticationService, UserService) {

	$scope.uname = UserService.getUser().user;
}]);