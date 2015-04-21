// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Llama = require('./models/llama');
var passport = require('passport');
var passportLocal = require('passport-local')
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var router = express.Router();
var User = require('./models/user');
var Errand = require('./models/errand'); 

// var beerController = require('./controllers/beer');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
//replace this with your Mongolab URL
// mongoose.connect('mongodb://localhost/mp3');
mongoose.connect('mongodb://biderrand:db1234@ds061631.mongolab.com:61631/mp3finalproject');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  next();
};
app.use(allowCrossDomain);

app.use(morgan('dev'));
app.use(cookieParser());


// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use(bodyParser.json());

// app.use(session({ secret: 'passport demo' }));
// app.use(expressSession({ 
// 	secret: process.env.SESSION_SECRET || 'secret',
// 	resave: false,
// 	saveUninitialized: false
// }));


app.use(passport.initialize());
app.use(passport.session());


// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  // res.json({ message: 'Hello World!' });
  res.render('index', {
  	isAuthenticated: false,
  	user: req.user
  }); 

});


//Add more routes here

//////////////////////////////////////////////Users Route
var usersRoute = router.route('/users');
usersRoute.get(userController.getUsers);
usersRoute.post(userController.postUsers);


var specificUsersRoute = router.route('/users/:user_id');
specificUsersRoute.get(userController.getSpecificUser);
specificUsersRoute.delete(userController.deleteUser);
specificUsersRoute.put(userController.editUser);


usersRoute.options(function(req, res){ res.status(200); res.end();});




//////////////////////////////////////////////////////////ErrandsRoute

var errandsRoute = router.route('/Errands');



////////////////////////////////////////////////////get
errandsRoute.get(function(req, res) {

		var where = eval("("+req.query.where+")");; //get all fields
		var sort = eval("("+req.query.sort+")");
		var select = eval("("+req.query.select+")");
		var skip = req.query.skip;
		var limit = req.query.limit;
		var count = req.query.count;

		

		if(count == 'true') { // if count is true query with count
			var query = Errand.count(where).limit(limit).skip(skip).select(select);
			count = query.count();
			query.exec(function(error, count) {
				if(error) {
					res.status(500);
					res.send({message: "Are you sure it is a valid query?, because could not get count.", data:[]});
				}
				else {

					res.status(200);
					res.json({message: 'Success', data:count});
				}
			});
		}
		else{ //if count not set to true then query without count

			var query = Errand.find(where).limit(limit).sort(sort).skip(skip).select(select);
			query.exec(function(error, Errands) {
				if(error) {
					res.status(404);
					res.json({message: "Query not found on server, are you sure it should be there?", data:[]});
				}
				else {
					res.status(200);
					res.json({message:"Success", data:Errands});
				}
			});


		}

});


////////////////////////////////////////////////////post
errandsRoute.post(function(req, res) {

		var errand = new Errand(); //create new task
		errand.name = req.body.name;
		errand.description = req.body.description;
		errand.deadline = req.body.deadline;
		errand.createdName = req.body.createdName; //set the fields in new errand
		errand.createdID = req.body.createdID;
		// errand.completed = req.body.completed;
		

		

		if(errand.name == null) { //server side validation for name and email
			res.status(500);
  			res.send({message: 'errand name is required, but was not provided', data:[]});
  		}
  		else if(errand.deadline == null) {
  		  	res.status(500);
  			res.send({message: 'errand deadline is required, but was not provided!', data:[]});
  		}
  		else if(errand.description == null) {
  		  	res.status(500);
  			res.send({message: 'errand description is required, but was not provided!', data:[]});
  		}
  		else if(errand.createdName == null) {
  		  	res.status(500);
  			res.send({message: 'Creator name is required, but was not provided!', data:[]});
  		}
  		else if(errand.createdID == null) {
  		  	res.status(500);
  			res.send({message: 'Creator id is required, but was not provided!', data:[]});
  		}
  		
  		else { //Query Mongoose and return appropriately
			errand.save(function(error) {
	  			if(error) {
	  				res.status(500); 
	  				res.send({message: 'Internal Server Error. Please make sure all of your fields valid and retry', data:[]});
	  			}

	  			else {
	  				res.status(200);
	  				res.json({message: 'Success! errand was created!', data:errand});

	  			}
  			});

		}

});

//////////////////////////////////////////////////////////ErrandsRoute

var specificErrandsRoute = router.route('/Errands/:errand_id');

///////////////////////////////////////////////////get
specificErrandsRoute.get(function(req, res) {
		
		Errand.findById(req.params.errand_id, function(error, errand) { //straight query and handle sucess and error
			if(error) {
				res.status(404);
				res.send({message:'Could not get requested errand. Are you sure it should be there? ', data:[]});
			}

			if(!errand) {
				res.status(404);
				res.json({message: "Not Found", data:[]});
			}
			else {
				res.status(200);
				res.json({message: "Success", data:errand});
			}
		});

});

specificErrandsRoute.delete(function(req, res) {
	Errand.findById(req.params.errand_id, function(error,errand){
		if(error){
			res.status(404);
			res.json({message:"Errand Not Found", data:[]});
		}
		else if(!errand) {
			res.status(404);
			res.json({message: "Errand Not Found"});
		}
		else {
			Errand.remove({_id: req.params.errand_id}, 
			function(error, errand) {
				if(error) {
					res.status(500);
					res.send({message: "Server Error", data:[]});
				}
				else {
					res.status(200);
					res.json({message: 'Errand was successfully deleted', data:[]});
				}
			});
		}
	});

});

specificErrandsRoute.put(function(req,res) {
	
	Errand.findById(req.params.errand_id, function(error, task) { // query and then check for errors
		if(error) {
			res.status(500); //not enough info for useful message as can't be not sound as got task
			res.send({message: "Error. Could not Update!", data:[]});
		}

		else {
			var errand = new Errand(); //create new task
			errand.name = req.body.name;
			errand.description = req.body.description;
			errand.deadline = req.body.deadline;
			errand.createdName = req.body.createdName; //set the fields in new errand
			errand.createdID = req.body.createdID;
			errand.bids = req.body.bids;
			console.log(errand.bids);
			// errand.completed = req.body.completed;
			
			// for(var i=0; i<req.body.bids.length; i++){

			// 	errand.bids = new 

			// }
			

			if(errand.name == null) { //server side validation for name and email
				res.status(500);
	  			res.send({message: 'errand name is required, but was not provided', data:[]});
	  		}
	  		else if(errand.deadline == null) {
	  		  	res.status(500);
	  			res.send({message: 'errand deadline is required, but was not provided!', data:[]});
	  		}
	  		else if(errand.description == null) {
	  		  	res.status(500);
	  			res.send({message: 'errand description is required, but was not provided!', data:[]});
	  		}
	  		else if(errand.createdName == null) {
	  		  	res.status(500);
	  			res.send({message: 'Creator name is required, but was not provided!', data:[]});
	  		}
	  		else if(errand.createdID == null) {
	  		  	res.status(500);
	  			res.send({message: 'Creator id is required, but was not provided!', data:[]});
	  		}
  		

  			else {
				errand.save(function(error) { //send update and then handle error or success
					if(error) {
						res.status(500); 
						res.json({message: "Are you sure it is a valid Update Request because update was Not sucessful.", data:[]});
					}

					else {
						res.status(200);
						res.json({message: 'Task sucessfully updated!', data:errand});
					}
				});
			}
		}	
	});
});



// Start the server
app.listen(port);
console.log('Server running on port ' + port); 