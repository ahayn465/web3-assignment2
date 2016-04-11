var app = angular.module('app', ['ui.router', 'auth.services']);

app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    }]).run(function($rootScope, $location, $state, AuthenticationService) {

		$rootScope.$on('$stateChangeStart',
	        function(event, toState, toParams, fromState, fromParams){
	            if(toState.name !== 'app.login' &&  !AuthenticationService.isLogged) {
	            event.preventDefault();
	            $state.go('app.login');
	        }
	});
});


