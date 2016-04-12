var mongoose = require('mongoose');


// // var todoSchema = new mongoose.Schema({
// //         id: Number,
// //         status: String,
// //         priority: String,
// //         date: String,
// //         description: String
// //     });

// // var messageSchema = new mongoose.Schema({
// //         id: Number,
// //         contact: {
// // 			firstname: String,
// // 			lastname: String,
// // 			university: {
// // 				id: String,
// // 				name: String,
// // 				address: String,
// // 				city: String,
// // 				state: String,
// // 				zip: String,
// // 				website: String,
// // 				latitude: String,
// // 				longitude: String
// // 			}
// // 		},
// // 		date: String,
// // 		category: String,
// // 		content: String
// //     });

// // var booksSchema = new mongoose.Schema({
// // 		id: Number,
// // 		isbn10: String,
// // 		isbn13: String,
// // 		title: String,
// // 		category: String
// // 	});

var employeeSchema = new mongoose.Schema({
    id: Number,
	  guid: String,
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    salt: String,
    todo: [{
        id: Number,
        status: String,
        priority: String,
        date: String,
        description: String
    }],
    messages: [{
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
    }],
  	books: [{
      id: Number,
      isbn10: String,
      isbn13: String,
      title: String,
      category: String
  }]
});

// var mongoose = require('mongoose')
// var son = require('./employees.json')

// var typeMappings  = { "String":String, 
//  "Number":Number,
//  "Boolean":Boolean,
//  "ObjectId":mongoose.Schema.ObjectId }

// function makeSchema(){
//   jsonSchema = son
//   var outputSchemaDef = {}
//   for(fieldName in jsonSchema.data){
//     var fieldType = jsonSchema.data[fieldName]
//     if(typeMappings[fieldType]){
//       outputSchemaDef[fieldName] = typeMappings[fieldType]
//     }else{
//       console.error("invalid type specified:", fieldType)
//     }
//   }
//   return new mongoose.Schema(outputSchemaDef)
// }



module.exports = mongoose.model('employees', employeeSchema);

