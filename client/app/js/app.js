var app = angular.module('app', ['ui.router', 'auth.services']);

app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    }]);


app.run(function($rootScope, $location, AuthService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        if (nextRoute.access.requiredLogin && !AuthService.isLogged) {
            $location.path("/");
        }
    });
});
