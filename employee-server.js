var fs = require('fs');
var exp = require('express');
var mongoose = require('mongoose');

var app = exp();

mongoose.connect('mongodb://localhost:27017/employees');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("connected");
});

var employeeSchema = new mongoose.Schema({
    id: Number,
	guid: String,
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    salt: String,
    todo: {
        id: String,
        status: String,
        priority: String,
        date: String,
        description: String
    },
    messages: {
        id: String,
        contact: {
			firstname: String,
			lastname: String,
			university: {
				id: String,
				name: String,
				address: String,
				city: String,
				state: String,
				zip: String,
				website: String,
				latitude: String,
				longitude: String
			}
		},
		date: String,
		category: String,
		content: String
    },
	books: {
		id: String,
		isbn10: String,
		isbn13: String,
		title: String,
		category: String
	}
});

var Employee = mongoose.model('employee', employeeSchema);

//Get all employees route
app.get('/api/employees', function(req, resp) {
    Employee.find({}, function(err, data) {
        if (err) {console.log('Error finding all employees.');
            resp.json({ message: 'Unable to connect to employees.'});
        }
        else {resp.json(data);}
	});
});

//Get single employee by ID route 
app.get('/api/employees/:id', function(req, resp) {
    Employee.find({ id: req.params.id }, function(err, data) {
        if (err) {console.log('Error finding employee.');
            resp.json({ message: 'Unable to connect to employees.'});
        }
        else {resp.json(data);}
	});
});

//Get an employee's books by ID route
app.get('/api/books/:id', function(req, resp) {
    Employee.find({ id: req.params.id }, 'books', function(err, data) {
        if (err) { console.log('Error finding books.');
            resp.json({ message: 'Unable to connect to employees.'});
        }
        else {resp.json(data);}
	});
});

//Get an employee's to do list by ID route
app.get('/api/todo/:id', function(req, resp) {
    Employee.find({ id: req.params.id }, 'todo', function(err, data) {
        if (err) { console.log('Error finding to do list.');
            resp.json({ message: 'Unable to connect to employees.'});
        }
        else {resp.json(data);}
	});
});

//Get an employee's messages by ID route
app.get('/api/messages/:id', function(req, resp) {
    Employee.find({ id: req.params.id }, 'messages', function(err, data) {
        if (err) { console.log('Error finding messages.');
            resp.json({ message: 'Unable to connect to employees.'});
        }
        else {resp.json(data);}
	});
});


app.listen(8000);