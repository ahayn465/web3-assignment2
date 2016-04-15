app.controller('DashCtrl', ['$scope', 'AuthenticationService', 'UserService', 'EmployeeService', 'TodoService', 'BookService', 'MessageService', 'uiGmapGoogleMapApi', function($scope, AuthenticationService, UserService, EmployeeService, TodoService, BookService, MessageService, uiGmapGoogleMapApi) {

	$scope.uname = UserService.getUser().user;

	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

	//Hey hey Amanda, I hope you have a good day today. I really wish I got to teach you this in person, nothing I love more, anyhow - Quicknote and reminder about these services, they return promises, and promises are singletons!!  This means they have some weird behavior you would not expect from JS !
	//You will notice there is a success method appended to the result of these services, this is called a singleton.
	//The results and contents of what is in 'data', will ONLY be avalibale within the callback it self! For example:
	//Lets say I call getEmployeeByID and I wanted to set its result to a variable named 'loggedUser' which we want to render out in the html file, it would look something like this!

        //VALID//
	// var user_id = '570d678761c32cb50eae5741'
	// EmployeeService.getEmployeeByID(user_id)
	//.success(function(data){
	// 	$scope.loggedUser = data.username; //Using two way binding, this would update the html regaurless of being in the promise!! you render out the $scope variable in the mark up as follows. <div>{{loggedUser}}</div>
	// }).error(function(data){
	 //	console.log(data);
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


	 EmployeeService.getCurrentAuthenticatedEmployee()
	.success(function(data){
		$scope.currentEmployee = data;
		console.log(data);
 	}).error(function(data){
	 	console.log(data);
	 });

	// var user_id = 1
	// EmployeeService.getEmployeeByID(user_id)
	// .success(function(data){
	// 	console.log(data);
	// }).error(function(data){
	// 	console.log(data);
	// });

	// EmployeeService.getAllEmployees()
	// .success(function(data){
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

$scope.createToDo = function (desc, priority, status) {
	var i = 0;
	
	//Set up ID of created to do item
	angular.forEach($scope.currentEmployee.todo, function(){
		i++;
	});
	
	//Set up correct Date format
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd < 10) {
		dd= '0' + dd
	} 
	if(mm < 10) {
		mm= '0' + mm
	}
	today = mm+'/'+dd+'/'+yyyy;
	
	//Pass data
	var new_todo = {"id": i,"status": status,"priority": priority,"date": today, "description" : desc};
	console.log(new_todo);
	 TodoService.createNewTodoEntry(new_todo)
	 .success(function(data){
	 	console.log(data);
	 }).error(function(data){
	 	console.log(data);
	 });
};

	// var new_todo = {"id": 6,"status": "tesfdsafdsafsdaft","priority": "dsfadf321","date": "8/28/2fdsaf015", "description" : "notfdsfas a test"};
	// TodoService.updateTodoEntry(new_todo)
	// .success(function(data){
	// 	console.log(data);
	// }).error(function(data){
	// 	console.log(data);
	// });

	// TodoService.getSingleTodoEntry(1)
	// .success(function(data){
	// 	console.log(data)
	// }).error(function(data){
	// 	console.log(data)
	// })

$scope.deleteToDo = function (id) {
	if (confirm('Are you sure you want to delete this item?')) {
			TodoService.deleteTodoEntry(id)
	 .success(function(data){
	 	console.log(data);
	 }).error(function(data){
	 	console.log(data);
	 })		
	}	
};
	
	// TodoService.deleteTodoEntry(1)
	// .success(function(data){
	// 	console.log(data)
	// }).error(function(data){
	// 	console.log(data)
	// })

	//Books

	// BookService.getBookList()
	// .success(function(data){
	// 	console.log(data)
	// }).error(function(data){
	// 	console.log(data)
	// })

	// BookService.getSingleBook(571)
	// .success(function(data){
	// 	console.log(data)
	// }).error(function(data){
	// 	console.log(data)
	// })

	//Messages 

	MessageService.getMessageList()
	.success(function(data){
		console.log(data)
		$scope.messages = data;
	}).error(function(data){
		console.log(data)
	})

  //    var message = {
  //       "id": 12,
  //       "contact": {
  //         "firstname": "Diana",
  //         "lastname": "Carr",
  //         "university": {
  //           "id": 161253,
  //           "name": "University of Maine",
  //           "address": "168 College Avenue",
  //           "city": "Orono",
  //           "state": "Maine",
  //           "zip": 4469,
  //           "website": "www.umaine.edu/",
  //           "latitude": 44.895966,
  //           "longitude": -68.673839
  //         }
  //       },
  //       "date": "7/11/2015",
  //       "category": "Query",
  //       "content": "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo."
  //     }
  //     MessageService.createNewMessage(message)
  //     .success(function(data){
		// console.log(data)
	 //  }).error(function(data){
		// console.log(data)
	 //  })

	// MessageService.getSingleMessage(12)
	// .success(function(data){
	// 	console.log(data)
	// }).error(function(data){
	// 	console.log(data)
	// })
	
	$scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };
  
	$scope.doLogout = function() {
		
	};


uiGmapGoogleMapApi.then(function(maps) {
                
   });

$scope.messageClicked = function(lat, long, id){

		console.log(lat, long, id);

       $scope.map = { center: { latitude: lat, longitude: long }, zoom: 8 };

}

  

}]);

