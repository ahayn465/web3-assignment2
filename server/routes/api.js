var exp = require('express');
var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var jmsg = require('./status-responses');
var config = require('../config/jwtconfig');
var Employee = require('../models/employee');

var app = exp();

app.use(bodyParser.json()); //populates req.body with (among other things) the value of the POST parameters. Here's the doc and examples: http://expressjs.com/api.html#req.body

app.use(require('../middleware/jwt-inspectos'));  //Set JWT middleware
app.use(require('../middleware/jwt-expire'));     //Set JWT-Token Expiration middleware
app.use(require('../middleware/cors'));           //Set CORS middleware

var router = express.Router();


console.log(jmsg.welcome);

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json(jmsg.welcome);
});

//IMPORTANT AS FUCK INFO: I SET UP THE CLIENT SO WE CAN CONTROL THERE ACCESS TO THE APP VIA THE SERVER, IF YOU SEND A 401 
//YOU WILL REVOKE THE TOKEN IN THE CLIENT!!

/**
 * Check to see if user name exists, if not, fail with a 401, invalid login msg
 * If the user name does exists, compare plain text password with hash from DB with bcrypt.compare
 * If valid generate a JWT for user. The JWT contains: expire time, username, and user id.
 * Return with 200, with user info and JWT
 */
router.route('/login')
    //login
    .post(function (req, res, next) {
        Employee.employee.findOne({username: {$in: [req.body.username]}}) //Check if user exists and get user.
            .select('password').select('username')
            .exec(function (err, user) {
                if (err) {
                    console.log(err); //log this bad boy, we will want to know!
                    return next(err); //there is an error don't worry about it we got it it later!!
                }
                if (!user) {
                    return res.status(401).send(jmsg.inv_login); //Send a 401 :O
                }
                //Here comes the good stuff, lets get hashy withit -_- ~~ 
                bcrypt.compare(req.body.password,
                    user.password, function (err, valid) {  //Compare password hash
                        if (err) {
                            console.log(err); 
                            return next(err);
                        }
                        if (!valid) { //Check to see, are VALID!?! 
                            return res.status(401).send(jmsg.inv_login);
                        }
                        //If we are valid, lets salt this bad boy up, package it in a JSON Web Token, and send it on its marry way!! God I love JSON WEB TOEKENS <3
                        var token = jwt.encode({
                            username: user.username, exp: new Date().getTime() + config.exp, id: user._id
                        }, config.secret);
                        //We will store this token in clients localStorage!!
                        res.json({jwt: token, user: user});
                    });
            });

    });


router.route('/test') //Generic test repost route
    .post(function(req, res, next){
        console.log(req.body.data);
        res.status(200).json(req.body.data);
});


router.route('/employees')
/**
* Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
* Get current login user information, as well as the friends associated with that account.
* Query users collections with <req.auth.id>
*/
    .post(function (req, res, next) {
        if (!req.auth) {
            return res.status(401).send();
        }
        Employee.employee.findOne({_id: {$in: [req.auth.id]}}).exec(function (err, user) {
            if (err) {
                return next(err);
            }
            res.json(user);
        });
    })

/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get all registered users objects
 */
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(404).send();
        }
        Employee.employee.find(function (err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });



router.route('/users/:user_id')
/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get a user from user id
 * Return just information about that user NO population.
 */
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(404).send();
        }
        Employee.employee.findOne({_id: {$in: [req.params.user_id]}}, function (err, user) {
            if (err) {
                return next(err);
            }
            res.json(user);
        });
});







// //Retrieve books by employee ID
// app.get('/books/:id', function(req, resp) {
//     Employee.find({ id: req.params.id }, 'books', function(err, data) {
//         if (err) { console.log('Error finding books.');
//             resp.json({ message: 'Unable to find books.'});
//         }
//         else {resp.json(data);}
// 	});
// });

// //Retrieve to do list by employee ID
// app.get('/todo/:id', function(req, resp) {
//     Employee.find({ id: req.params.id }, 'todo', function(err, data) {
//         if (err) { console.log('Error finding to do list.');
//             resp.json({ message: 'Unable to find to do list.'});
//         }
//         else {resp.json(data);}
// 	});
// });

// //Create to do item by employee ID
// app.post('/todo/:id', function(req, resp) {
// });

// //Update to do item by employee ID
// app.put('/todo/:id', function(req, resp) {
// });

// //Delete to do item by employee ID
// app.delete('/todo/:id', function(req, resp) {
// 	Employee.find({ id: req.params.id }, function(err, data) {
// 		if (err) { console.log('Error deleting the to do item.');
// 			resp.json({ message: 'Unable to delete to do item.'});
// 		}
// 		else { resp.json({ message: 'Item successfully deleted.' }); }
//   });
// });

// //Retrieve messages by employee ID
// app.get('/messages/:id', function(req, resp) {
//     Employee.find({ id: req.params.id }, 'messages', function(err, data) {
//         if (err) { console.log('Error finding messages.');
//             resp.json({ message: 'Unable to find messages.'});
//         }
//         else {resp.json(data);}
// 	});
// });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

module.exports = app;