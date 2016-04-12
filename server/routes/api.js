var exp = require('express')
var express = require('express')
var bodyParser = require('body-parser')
var bcrypt = require('bcrypt')
var jwt = require('jwt-simple')
var jmsg = require('../status-responses')
var config = require('../config/jwtconfig')
var Employee = require('../models/employee')
var app = exp()
var don = require('../models/employees.json')


app.use(bodyParser.json()) //populates req.body with (among other things) the value of the POST parameters. Here's the doc and examples: http://expressjs.com/api.html#req.body

app.use(require('../middleware/jwt-inspectos'))  //Set JWT middleware
app.use(require('../middleware/jwt-expire'))     //Set JWT-Token Expiration middleware
app.use(require('../middleware/cors'))           //Set CORS middleware

var router = express.Router()


//ERROR CODE BEING USED ARE 200, 401, 404, 422. Use cases below.

/* RUN THIS IF THIS IS YOUR FIRST TIME USING THE APPLICATION */
function seedDB(){
    for(var field in don){
        employee = new Employee()
        employee.id = don[field].id
        employee.guid = don[field].guid
        employee.firstname = don[field].firstname
        employee.lastname = don[field].lastname
        employee.username = don[field].username
        employee.password = don[field].password

        for (var i = 0 ; i < don[field].todo.length; i++){
            employee.todo.push(don[field].todo[i])
        }
        for (var i = 0 ; i < don[field].messages.length; i++){
            employee.messages.push(don[field].messages[i])
        }
        for (var i = 0 ; i < don[field].books.length; i++){
            employee.books.push(don[field].books[i])
        }
        employee.save()
    }
}


//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json(jmsg.welcome)
})

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
        Employee.findOne({'username': req.body.username}) //Check if user exists and get user.
            .select('password').select('username')
            .exec(function (err, user) {
                if (err) {
                    console.log(err) //log this bad boy, we will want to know!
                    return next(err) //there is an error don't worry about it we got it it later!!
                }
                if (!user) {
                    console.log('No User found')
                    return res.status(401).send(jmsg.inv_login) //Send a 401 :O
                }
                //Here comes the good stuff, lets get hashy withit -_- ~~~ ~~ ~

                user = JSON.stringify(user)
                user = JSON.parse(user)

        
                bcrypt.compare(req.body.password,
                    user.password, function (err, valid) {  //Compare password hash
                        if (err) {
                            console.log(err) 
                            return next(err)
                        }
                        if (!valid) { //Check to see, are VALID!?! 
                            
                            //Well implementing Bcrypt was a waste of time, the passwords are not real hashes. So we will pretend this is a real app and we are doing this correctly, lets do basic insecure string matching.
                            if(req.body.password !== user.password){
                                return res.status(401).send(jmsg.inv_login)
                            }
                        }
                        //If we are valid, lets salt this bad boy up, hash it as a JSON Web Token, and send it on its marry way!! God I love JSON WEB TOEKENS, here is some resources
                        //https://scotch.io/tutorials/the-anatomy-of-a-json-web-token
                        var token = jwt.encode({
                            username: user.username, exp: new Date().getTime() + config.exp, id: user._id
                        }, config.secret)
                        //We will store this token in clients localStorage!!
                        res.json({jwt: token, user: user.username, id:user._id})
                })
        })

})


router.route('/test') //Generic test repost route
    .post(function(req, res, next){
        console.log(req.body.data)
        res.status(200).json(req.body.data)
})


router.route('/employee')
/**
* Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
* Get current authenticated login user information.
* Decode JWT information to retrieve id to query for user info
*/
    .post(function (req, res, next) {
        console.log(123)
        if (!req.auth) {
            return res.status(401).send()
        }
        Employee.findOne({_id: {$in: [req.auth.id]}}).exec(function (err, user) {
            if (err) {
                return next(err)
            }
            res.json(user)
        })
    })

/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get all registered users objects
 */
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(404).send()
        }
        Employee.find(function (err, users) {
            if (err)
                res.send(err)
            res.json(users)
        })
    })



router.route('/employee/:user_id')
/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get a user from user id
 * Return just information about that user NO population.
 */
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(404).send()
        }
        Employee.findOne({id: req.params.user_id}, function (err, user) {
            if (err) {
                return next(err)
            }
            res.json(user)
        })
})

router.route('/todo')
/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get entire todo list based on login user
 */
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(404).send()
        }
        Employee.findOne({'_id': req.auth.id}) //Check if user exists and get user.
            .select('todo').exec(function (err, todo) {
                res.json(todo)
        })
    })
    .post(function (req, res) {
        if (!req.auth) {
            return res.status(404).send()
        }
        Employee.findOneAndUpdate(
            { "_id": req.auth.id },
            { "$push": { "todo": req.body.payload } },
            { "new": true },
            function(err,doc) {
                if(err){
                    console.log( JSON.stringify(doc))
                }else{
                    res.json(jmsg.created)
            } 
        })
})


  

router.route('/book')
/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get entire book list based on login user
 */    
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(404).send()
        }
        Employee.findOne({'_id': req.auth.id}) //Check if user exists and get user.
            .select('books').exec(function (err, books) {
                res.json(books)
        })
    })

router.route('/book/:id')
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(401).send()
        }
        Employee.findOne({_id: req.auth.id}).select('books').exec( function (err, user) {
            if (err) {
                console.log(err)
            }
            bookItem = {}
            found = false
            for (var i = 0; i < user.books.length; i++){

                if(user.books[i]){
                    console.log(user.books[i].id)
                    if(parseInt(user.books[i].id) === parseInt(req.params.id)){
                        bookItem = user.books[i]
                        found = true
                        break
                    }
                }

            }  
            if (found){
                res.json(bookItem)       
            }else{
                return res.status(422).send()
            }
            
            
        })
    })

router.route('/todo/:id')
/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get entire todo list based on login user
 */
    .get(function (req, res) {

        if (!req.auth) {
            return res.status(401).send()
        }
        Employee.findOne({_id: req.auth.id}).select('todo').exec( function (err, user) {
            if (err) {
                console.log(err)
            }
            todoItem = {}
            found = false
            for (var i = 0; i < user.todo.length; i++){
                if(user.todo[i]){
                    if(parseInt(user.todo[i].id) === parseInt(req.params.id)){
                        todoItem = user.todo[i]
                        found = true
                        break
                    }
                }
            }  
            if (found){
                res.json(todoItem)       
            }else{
                return res.status(422).send()
            }
            
            
        })
    })  .put(function (req, res) {
            if (!req.auth) {
                return res.status(401).send()
            }
            Employee.findOne({_id: req.auth.id}).select('todo').exec( function (err, user){

                if (err){
                    console.log(err)
                }

                for (var i = 0;i < user.todo.length; i++){


                        if(parseInt(user.todo[i].id) === parseInt(req.params.id)){

                            req.body.payload.status ? user.todo[i].status = req.body.payload.status : false
                            req.body.payload.priority ? user.todo[i].priority = req.body.payload.priority : false
                            req.body.payload.date ? user.todo[i].date = req.body.payload.date : false
                            req.body.payload.description ? user.todo[i].description = req.body.payload.description : false
                            break
                        }   
                }


                user.save(function (err) {
                    if (err){
                        console.log(err)
                    }else{
                        res.json(jmsg.update)
                    }
                })
            })
    })  .delete(function (req, res) {
            Employee.findOne({_id: req.auth.id}).select('todo').exec( function (err, user){

                if (err){
                    console.log(err)
                }
                found = false
                for (var i = 0;i < user.todo.length; i++){


                        if(parseInt(user.todo[i].id) === parseInt(req.params.id)){
                            var index = i
                            if (index > -1) {
                                found = true
                                user.todo.splice(index, 1);
                            }
                        }
                }
                user.save(function (err) {
                    if (err){
                        console.log(err)
                    }else{
                        if (found){
                            res.json(jmsg.del)
                        }else{
                            res.status(422).send()
                        }
                        
                    }
                })
            })
})



router.route('/messages')
/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get entire todo list based on login user
 */
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(404).send()
        }
        Employee.findOne({'_id': req.auth.id}) //Check if user exists and get user.
            .select('messages').exec(function (err, msg) {
                res.json(msg)
        })
    })
    .post(function (req, res) {
        if (!req.auth) {
            return res.status(404).send()
        }

        Employee.findOneAndUpdate(
            { "_id": req.auth.id },
            { "$push": { "messages": req.body.payload } },
            { "new": true },
            function(err,doc) {
                if(err){
                    console.log( JSON.stringify(doc))
                }else{
                    return res.json(jmsg.create)
                } 
        })
})


router.route('/messages/:id')
/**
 * Requires a valid JWT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * Get entire todo list based on login user
 */
    .get(function (req, res) {
        if (!req.auth) {
            return res.status(401).send()
        }
        Employee.findOne({_id: req.auth.id}).select('messages').exec( function (err, user) {
            if (err) {
                console.log(err)
            }
            msgItem = {}
            found = false
            for (var i = 0; i < user.messages.length; i++){
                if(user.messages[i]){
                    if(parseInt(user.messages[i].id) === parseInt(req.params.id)){
                        msgItem = user.messages[i]
                        found = true
                        break
                    }
                }
            }  
            if (found){
                res.json(msgItem)       
            }else{
                return res.status(422).send()
            }
        })
    }) 







// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router)

module.exports = app