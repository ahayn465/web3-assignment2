SERVER_URL = "http://localhost:7000";

angular.module('data.services', ['ngResource'])
    .factory('UserService', function () {
    	u = {}
        return {
        	setUser: function(user){
        		u = user;
        	},
        	getUser: function(){
        		return u;
        	} 
        }
 })    .factory('TodoService', function ($http) {
            $http.defaults.headers.common['x-auth'] = localStorage.token;
            return {
                getTodoList: function(){
                    return $http.get(SERVER_URL + '/api/todo');
                },
                createNewTodoEntry: function(payload){
                    return $http.post(SERVER_URL + '/api/todo', {"payload":payload});
                },
                getSingleTodoEntry: function(id){
                    return $http.get(SERVER_URL + '/api/todo/' + id);
                },
                updateTodoEntry: function(payload){
                    return $http.put(SERVER_URL + '/api/todo/' + payload.id, {"payload":payload});
                }
            }
        
 })    .factory('BookService', function ($http) {
            $http.defaults.headers.common['x-auth'] = localStorage.token;
            return {
                getBookList: function(){
                    return $http.get(SERVER_URL + '/api/book');
                }
            }
        
 })    .factory('MessageService', function ($http) {
            $http.defaults.headers.common['x-auth'] = localStorage.token;
            return {
                getMessageList: function(){
                    return $http.get(SERVER_URL + '/api/message');
                }
            }
 })    .factory('EmployeeService', function ($http) {
            $http.defaults.headers.common['x-auth'] = localStorage.token;
            return {
                getCurrentAuthenticatedEmployee: function(){
                    return $http.post(SERVER_URL + '/api/employee');
                },
                getEmployeeByID: function(id){
                    return $http.get(SERVER_URL + '/api/employee/' + id);
                },
                getAllEmployees: function(){
                    return $http.get(SERVER_URL + '/api/employee');
                }
          }
 })