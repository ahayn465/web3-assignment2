var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    id: Number,
	guid: String,
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    salt: String,
    todo: {
        id: Number,
        status: String,
        priority: String,
        date: String,
        description: String
    },
    messages: {
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
    },
	books: {
		id: Number,
		isbn10: String,
		isbn13: String,
		title: String,
		category: String
	}
});

module.exports = mongoose.model('employee', employeeSchema);

