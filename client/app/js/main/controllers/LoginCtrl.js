app.controller('LoginCtrl', ['$scope', '$location', 'UserLoginService', 'AuthenticationService', 'UserService', function($scope, $location, UserLoginService, AuthenticationService, UserService) {
    
    $scope.loginData = {}
    $scope.fromServer = AuthenticationService.lastEvent; //This will provide a string to indicate to the user what happened if they a routed to login page.

    $scope.doLogin = function (username, password) { //Login a user on click
                if (username !== undefined && password !== undefined) {
                    UserLoginService.logIn(username, password)
                        .success(function (data) { //if valid set user id, username, and json web token to localStorage
                            AuthenticationService.lastEvent = "Logged in";
                            AuthenticationService.isLogged = true;
                            localStorage.token = data.jwt; //JWT Token

                            UserService.setUser(data)

                            if (AuthenticationService.isLogged) {
                                $location.path('/home');
                            }
                        })
                        .error(function (status, data, msg) {
                            $scope.fromServer = status.message;
                        });
                }
            }
}]);