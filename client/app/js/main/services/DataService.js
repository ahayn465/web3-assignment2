angular.module('data.services', ['ngResource'])
    .factory('UserDataService', function () {
    	var user = {}
        return {
        	setUser: function(user){
        		user = user;
        	},
        	getUser: function(){
        		return user;
        	} 
        };
 });