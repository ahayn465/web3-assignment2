var exp = require('express');
var app = exp();

var Employee = require('../models/employee.js');

//Retrieve all employees
app.get('/employees', function(req, resp) {
    Employee.find({}, function(err, data) {
        if (err) {console.log('Error finding all employees.');
            resp.json({ message: 'Unable to find employees.'});
        }
        else {resp.json(data);}
	});
});

//Retrieve employee by employee ID
app.get('/employees/:id', function(req, resp) {
    Employee.find({ id: req.params.id }, function(err, data) {
        if (err) {console.log('Error finding employee.');
            resp.json({ message: 'Unable to find employee.'});
        }
        else {resp.json(data);}
	});
});

//Retrieve books by employee ID
app.get('/books/:id', function(req, resp) {
    Employee.find({ id: req.params.id }, 'books', function(err, data) {
        if (err) { console.log('Error finding books.');
            resp.json({ message: 'Unable to find books.'});
        }
        else {resp.json(data);}
	});
});

//Retrieve to do list by employee ID
app.get('/todo/:id', function(req, resp) {
    Employee.find({ id: req.params.id }, 'todo', function(err, data) {
        if (err) { console.log('Error finding to do list.');
            resp.json({ message: 'Unable to find to do list.'});
        }
        else {resp.json(data);}
	});
});

//Create to do item by employee ID
app.post('/todo/:id', function(req, resp) {
});

//Update to do item by employee ID
app.put('/todo/:id', function(req, resp) {
});

//Delete to do item by employee ID
app.delete('/todo/:id', function(req, resp) {
	Employee.find({ id: req.params.id }, function(err, data) {
		if (err) { console.log('Error deleting the to do item.');
			resp.json({ message: 'Unable to delete to do item.'});
		}
		else { resp.json({ message: 'Item successfully deleted.' }); }
  });
});

//Retrieve messages by employee ID
app.get('/messages/:id', function(req, resp) {
    Employee.find({ id: req.params.id }, 'messages', function(err, data) {
        if (err) { console.log('Error finding messages.');
            resp.json({ message: 'Unable to find messages.'});
        }
        else {resp.json(data);}
	});
});

//Login authentication?

module.exports = app;