var mongoose = require('mongoose');


var todoSchema = new mongoose.Schema({
        id: Number,
        status: String,
        priority: String,
        date: String,
        description: String
    });

var messageSchema = new mongoose.Schema({
        id: Number,
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
    });

var booksSchema = new mongoose.Schema({
		id: Number,
		isbn10: String,
		isbn13: String,
		title: String,
		category: String
	});


var employeeSchema = new mongoose.Schema({
    id: Number,
	guid: String,
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    salt: String,
    todo: [todoSchema],
    messages: [messageSchema],
	books: [booksSchema]
});




module.exports = mongoose.model('employee', employeeSchema);

