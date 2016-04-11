app.controller('AppCtrl', function($scope, $rootScope, $location, AuthenticationService) {
  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
   alert(123);
   });

});
