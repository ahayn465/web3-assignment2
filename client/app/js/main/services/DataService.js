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
        };
 });