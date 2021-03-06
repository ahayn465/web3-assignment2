// Sub-application/main Level State
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
      .state('app.login', {
      url: '/',
      templateUrl: 'js/main/templates/login.tpl.html',
      controller: 'LoginCtrl', 
      cache: false
    })
    .state('app.home', {
      url: '/home',
      templateUrl: 'js/main/templates/dash.tpl.html',
      controller: 'DashCtrl',
      cache: false,
      access: {requiredLogin: true}
    })
    .state('app.book', {
      url: '/books',
      templateUrl: 'js/main/templates/book.tpl.html',
      controller: 'BookCtrl',
      cache: false,
      access: {requiredLogin: true}
    })
    .state('app.msg', {
      url: '/messages',
      templateUrl: 'js/main/templates/msg.tpl.html',
      controller: 'MsgCtrl',
      cache: false,
      access: {requiredLogin: true}
    })   
    .state('app.about', {
      url: '/about',
      templateUrl: 'js/main/templates/about.tpl.html',
      controller: 'DashCtrl',
      cache: false
    })    
    .state('app.todo', {
      url: '/todo',
      templateUrl: 'js/main/templates/todo.tpl.html',
      controller: 'ToDoCtrl',
      access: {requiredLogin: true}, 
      cache: false
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