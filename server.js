// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
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
var errandController = require('./controllers/errands');
var authController = require('./controllers/auth');



//replace this with your Mongolab URL
// mongoose.connect('mongodb://localhost/mp3');
mongoose.connect('mongodb://biderrand:db1234@ds061631.mongolab.com:61631/mp3finalproject');

// Create our Express application
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile("testingPassport" + '/index.html');
});

io.on('connection', function(socket){
	console.log("New user connected");
  	
});


// server.listen(4000);


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

app.use(bodyParser.json());
// app.use(session({ secret: 'passport demo' }));
 app.use(expressSession({ 
	 secret: process.env.SESSION_SECRET || 'secret',
	 resave: false,
  	 saveUninitialized: false
 }));


app.use(passport.initialize());
app.use(passport.session());


// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');




//Add more routes here
// app.get('/', function(req, res){
  // res.sendFile('http://localhost:4000/testingPassport/index.html');
 //});

//   res.sendFile('http://localhost:4000/testingPassport/index.html');
// });
var loginRoute = router.route('/login');
loginRoute.post(userController.login);
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

var errandsRoute = router.route('/errands');
errandsRoute.get(errandController.getErrands);
errandsRoute.post(function(req,res){
	var errand = errandController.postErrands(req, res);
	io.emit("New Bid", {data:errand});
	//todo what if errand is bad??!
});



var specificErrandsRoute = router.route('/errands/:errand_id');
specificErrandsRoute.get(errandController.getSpecificErrand);
specificErrandsRoute.delete(errandController.deleteErrand);

specificErrandsRoute.put(function(req,res){
	var errand =errandController.editErrand(req, res);
	io.emit("New Bid", {data: errand});
	console.log("new bid");

});

errandsRoute.options(function(req, res){ res.status(200); res.end();});



// // Start the server
http.listen(4000, function(){
  console.log('listening on 4000');
});
// console.log('Server running on port ' + port); 