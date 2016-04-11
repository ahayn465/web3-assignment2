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


//ERROR CODE BEING USED ARE 200, 401, 404, 422. Use cases below.


//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json(jmsg.welcome);
});

//IMPORTANT AS FUCK INFO: I SET UP THE CLIENT SO WE CAN CONTROL USER ACCESS TO THE APP VIA THE SERVER, IF YOU SEND A 401 
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
        Employee.findOne({'employee.username': req.body.username}) //Check if user exists and get user.
            .select('employee.password').select('employee.username')
            .exec(function (err, user) {
                if (err) {
                    console.log(err); //log this bad boy, we will want to know!
                    return next(err); //there is an error don't worry about it we got it it later!!
                }
                if (!user) {
                    console.log('No User found')
                    return res.status(401).send(jmsg.inv_login); //Send a 401 :O
                }
                //Here comes the good stuff, lets get hashy withit -_- ~~ 

                user = JSON.stringify(user);
                user = JSON.parse(user)

        
                bcrypt.compare(req.body.password,
                    user.employee.password, function (err, valid) {  //Compare password hash
                        if (err) {
                            console.log(err); 
                            return next(err);
                        }
                        if (!valid) { //Check to see, are VALID!?! 
                            
                            //Well implementing Bcrypt was a waste of time, the passwords are not real hashes. So we will pretend we are doing this correctly and do insecure string matching if invalid. 
                            if(req.body.password !== user.employee.password){
                                return res.status(401).send(jmsg.inv_login);
                            }
                        }
                        //If we are valid, lets salt this bad boy up, hash it as a JSON Web Token, and send it on its marry way!! God I love JSON WEB TOEKENS <3
                        var token = jwt.encode({
                            username: user.username, exp: new Date().getTime() + config.exp, id: user._id
                        }, config.secret);
                        //We will store this token in clients localStorage!!
                        res.json({jwt: token, user: user.employee.username, id:user._id});
                });
        });

});


router.route('/test') //Generic test repost route
    .post(function(req, res, next){
        console.log(req.body.data);
        res.status(200).json(req.body.data);
});


router.route('/employee')
/**
* Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
* Get current authenticated login user information.
* Decode JWT information to retrieve id to query for user info
*/
    .post(function (req, res, next) {
        console.log(123);
        if (!req.auth) {
            return res.status(401).send();
        }
        Employee.findOne({_id: {$in: [req.auth.id]}}).exec(function (err, user) {
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
        Employee.find(function (err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });



router.route('/employee/:user_id')
/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get a user from user id
 * Return just information about that user NO population.
 */
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(404).send();
        }
        Employee.findOne({_id: {$in: [req.params.user_id]}}, function (err, user) {
            if (err) {
                return next(err);
            }
            res.json(user);
        });
});

router.route('/todo')
/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get entire todo list based on login user
 */
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(404).send();
        }
        Employee.findOne({'_id': req.auth.id}) //Check if user exists and get user.
            .select('employee.todo').exec(function (err, todo) {
                res.json(todo);
        })
    })
    .post(function (req, res) {
        if (!req.auth) {
            return res.status(404).send();
        }
        


        Employee.findOne({_id:req.auth.id}).exec(function(user){
                user.employee.todo.push(req.body.payload)
                user.save()
    }
)
});






router.route('/todo/todo_id')
/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get entire todo list based on login user
 */
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(404).send();
        }
        Employee.findOne({_id: {$in: [req.params.user_id]}}, function (err, user) {
            if (err) {
                return next(err);
            }
            res.json(user);
        })
    .update(function (req, res) {
        if (!req.auth) {
            return res.status(404).send();
        }
        Employee.findOne({_id: {$in: [req.params.user_id]}}, function (err, user) {
            if (err) {
                return next(err);
            }
            res.json(user);
        });
})    .delete(function (req, res) {
        if (!req.auth) {
            return res.status(404).send();
        }
        Employee.findOne({_id: {$in: [req.params.user_id]}}, function (err, user) {
            if (err) {
                return next(err);
            }
            res.json(user);
        });
})
});










// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

module.exports = app;