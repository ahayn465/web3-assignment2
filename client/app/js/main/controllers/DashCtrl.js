app.controller('DashCtrl', ['$scope', 'AuthenticationService', 'UserService', 'EmployeeService', 'TodoService', function($scope, AuthenticationService, UserService, EmployeeService, TodoService) {

	$scope.uname = UserService.getUser().user;

	//Hey hey Amanda, I hope you have a good day today. I really wish I got to teach you this in person, nothing I love more, anyhow - Quicknote and reminder about these services, they return promises, and promises are singletons!!  This means they have some weird behavior you would not expect from JS !
	//You will notice there is a success method appended to the result of these services, this is called a singleton.
	//The results and contents of what is in 'data', will ONLY be avalibale within the callback it self! For example:
	//Lets say I call getEmployeeByID and I wanted to set its result to a variable named 'loggedUser' which we want to render out in the html file, it would look something like this!

        //VALID//
	// var user_id = 'an ID'
	// EmployeeService.getEmployeeByID(user_id)
	//.success(function(data){
	// 	$scope.loggedUser = data.username; //Using two way binding, this would update in realtime in the html regaurless of being in the promise!!
	// }).error(function(data){
	// 	console.log(data);
	// });

		//INVALID :(
	// var result = null;
	// EmployeeService.getEmployeeByID(user_id)
	//.success(function(data){
	// 	result = data.username;
	// }).error(function(data){
	// 	console.log(data);
	// });
	// $scope.loggedUser = result
		//The above code won't work at all, current result is still set to null, however result within the singleton, is set to data. I hope this helps, this is really one of the only weird things. <3


	//Employee Examples below


	// EmployeeService.getCurrentAuthenticatedEmployee()
	//.success(function(data){
	// 	console.log(data);
	// }).error(function(data){
	// 	console.log(data);
	// });

	// var user_id = 1
	// EmployeeService.getEmployeeByID(user_id)
	// .success(function(data){
	// 	console.log(data);
	// }).error(function(data){
	// 	console.log(data);
	// });

	// EmployeeService.getAllEmployees()
	//.success(function(data){
	// 	console.log(data);
	// }).error(function(data){
	// 	console.log(data);
	// });

	//To Do Exmaples below

	// TodoService.getTodoList()
	// .success(function(data){
	// 	console.log(data);
	// }).error(function(data){
	// 	console.log(data);
	// })

	// var new_todo = {"id": 6,"status": "test","priority": "321","date": "8/28/2015", "description" : "test"};
	// TodoService.createNewTodoEntry(new_todo)
	// .success(function(data){
	// 	console.log(data);
	// }).error(function(data){
	// 	console.log(data);
	// });

	// var new_todo = {"id": 6,"status": "tesfdsafdsafsdaft","priority": "dsfadf321","date": "8/28/2fdsaf015", "description" : "notfdsfas a test"};
	// TodoService.updateTodoEntry(new_todo)
	// .success(function(data){
	// 	console.log(data);
	// }).error(function(data){
	// 	console.log(data);
	// });

	TodoService.getSingleTodoEntry(1)
	.success(function(data){
		console.log(data)
	}).error(function(data){
		console.log(data)
	})

	// TodoService.deleteTodoEntry(1)
	// .success(function(data){
	// 	console.log(data)
	// }).error(function(data){
	// 	console.log(data)
	// })






}]);

