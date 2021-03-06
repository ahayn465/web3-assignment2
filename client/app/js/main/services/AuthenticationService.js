angular.module('auth.services', ['ngResource'])
    .factory('AuthenticationService', function () {
        var auth = {
            lastEvent: null,
            isLogged: false
        }
        return auth;
    })
    .factory('UserLoginService', function ($http) {
        var serverUrl = "http://localhost:7000/api";
        return {
            logIn: function (username, password) {
                return $http.post(serverUrl + '/login', {username: username, password: password});
            },
            logOut: function () {
                //TODO:Revoke JWT
            }
        }
    })
    .factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (localStorage.token) {
                    //config.headers.Authorization = 'x-auth ' + localStorage.token;
                }
                return config;
            },

            requestError: function (rejection) {
                return $q.reject(rejection);
            },

            /* Set Authentication.isAuthenticated to true if 200 received */
            response: function (response) {
                if (response != null && response.status == 200 && localStorage.token && !AuthenticationService.isLogged) {
                    AuthenticationService.isLogged = true;
                }
                return response || $q.when(response);
            },

            /* Revoke client authentication if 401 is received */
            responseError: function (rejection) {
                if (rejection != null && rejection.status === 400 && (localStorage.token || AuthenticationService.isLogged)) {
                    delete localStorage.token;
                    AuthenticationService.isLogged = false;
                    AuthenticationService.lastEvent = "Session Token Revoked";
                    $location.path("/");
                }

                return $q.reject(rejection);
            }
        };
    })