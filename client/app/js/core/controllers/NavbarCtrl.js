app.controller('NavbarCtrl', function($scope, AuthenticationService.isLogged) {
  $scope.items = ['Home', 'Book', 'ToDo', 'Msg'];
});
