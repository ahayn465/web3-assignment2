var app = angular.module('app', ['ui.router', 'auth.services', 'data.services', 
'uiGmapgoogle-maps', 'angularModalService']);


app.config(['$httpProvider', function ($httpProvider) {
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
	        			AuthenticationService.lastEvent = "Refreshing single page applications is not needed, as result we revoke your session as punishment!!";
	        		}
	        		
	        	}
	        }
	});
});

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBjP3nxt1Fc3PPXnbck6-kr3eNx3sEvn1w',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})





