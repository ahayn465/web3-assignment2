var app = angular.module('app', ['ui.router', 'auth.services', 'data.services', 
'uiGmapgoogle-maps', 'angularModalService', 'ngAnimate']).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    }]).run(function($rootScope, $location, $state, AuthenticationService, UserService) {

		$rootScope.$on('$stateChangeStart',
	        function(event, toState, toParams, fromState, fromParams){
	            if(toState.name !== 'app.login' &&  !AuthenticationService.isLogged) {
	            event.preventDefault();
	            $state.go('app.login');
	        }
	        else
	        {
	        	//If user refreshes pages get rid of them !! 
	        	if(toState.name === 'app.login'){
	        		delete localStorage.token;
	        		UserService.setUser({});
	        		if (AuthenticationService.isLogged){
	        			AuthenticationService.isLogged = false;
	        		}
	        		
	        	}
	        }
	});
});;





