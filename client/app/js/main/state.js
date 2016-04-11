// Sub-application/main Level State
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
      .state('app.login', {
      url: '/',
      templateUrl: 'js/main/templates/login.tpl.html',
      controller: 'LoginCtrl'
    })
    .state('app.home', {
      url: '/home',
      templateUrl: 'js/main/templates/dash.tpl.html',
      controller: 'DashCtrl',
      access: {requiredLogin: true}
    })
    .state('app.book', {
      url: '/books',
      templateUrl: 'js/main/templates/book.tpl.html',
      controller: 'BookCtrl',
      access: {requiredLogin: true}
    })
    .state('app.msg', {
      url: '/messages',
      templateUrl: 'js/main/templates/msg.tpl.html',
      controller: 'MsgCtrl',
      access: {requiredLogin: true}
    })    
    .state('app.todo', {
      url: '/todo',
      templateUrl: 'js/main/templates/todo.tpl.html',
      controller: 'ToDoCtrl',
      access: {requiredLogin: true}
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function() {
        // if(typeof localStorage.jwttoken === 'undefined') {
        //     return 'app/login';
        // } else {
        //     return 'app/myBoard';
        // }
        return '/'

    });

}]);