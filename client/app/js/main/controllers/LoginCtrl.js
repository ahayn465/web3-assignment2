app.controller('LoginCtrl', ['$scope', function($scope) {

    $scope.doLogin = function (username, password) { //Login a user on click
                if (username !== undefined && password !== undefined) {
                    UserLoginService.logIn(username, password)
                        .success(function (data) { 
                            //if valid set user id, username, and json web token to localStorage
                            AuthenticationService.isLogged = true;
                            localStorage.username = data.username;//Then welcome the user
                            localStorage.userid = data.id;
                            localStorage.token = data.token; //JWT Token
                            $scope.fromServer = "Welcome, " + data.username;
                            if (AuthenticationService.isLogged) {
                                $location.path('/home');
                            }
                        })
                        .error(function (status, data) {
                            $scope.fromServer = data.message;
                        });
                }
            }
}]);