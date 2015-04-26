var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');

// Create endpoint /api/users for POST

exports.login = function(req, res) {
  
   User.findOne( { email: req.body.email } , function(error, user) {
      console.log(user.password);
      if(error){
        res.status(404);
        res.json({message:"User Not Found", data:[]});
      }
      if(!user) {
        res.status(404);
        res.json({message: "User Not Found", data:[]});
      }

      else {
        bcrypt.compare( req.body.password, user.password,function(err, isMatch){
            if(err){
              res.status(500);
              res.send({message: "Error", data:{}});
            }else if(isMatch){
                res.status(200);
                res.send({message: "Success!", data:user});
            }else{
                res.status(401);
                res.send({message: "Password does not match!", data:{}});
            }

        });
      }
        
        
    });
};
exports.postUsers = function(req, res) {
    var user = new User();
    console.log(req.body);
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
      // user.userErrands = req.body.userErrands;

      if(user.name == null) {
        res.status(500);
        res.send({message: 'Name was not provided, but is required', data:[]});
      }

      else if (user.email == null) {
        res.status(500);
        res.send({message: 'Email was not provided, but is required', data:[]});

      }

      else if (user.password == null) {
        res.status(500);
        res.send({message: 'Password was not provided, but is required', data:[]});

      }

      else {

        user.save(function(error) {
          if(error) {
            if(error.code === 11000) {
              res.status(500);
              res.send({message: "Error! There is already an user with the same email! ", data:[]});
            }

            else {
              res.status(500);
              res.send({message: "Unsuccessful! Refer to Docs for help!", data:[]});
            }
          }

          else {
            res.status(201);
            res.json({message: "User sucessfully created!", data:user});
          }
        });

      }
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {

      var where = eval("("+req.query.where+")");; //get all fields
      var sort = eval("("+req.query.sort+")");
      var select = eval("("+req.query.select+")");
      var skip = req.query.skip;
      var limit = req.query.limit;
      var count = req.query.count;


      if(count == 'true') {
        var query = User.find(where).limit(limit).skip(skip).select(select);
        count = query.count();
        query.exec(function(error, count) {
          if(error) {
            res.status(404);
            res.send({message: "Query Not Found!", data:[]});
          }
          else {
            res.status(200);
            res.send({message: 'Success!', data:count});
          }
        });
      }else{

        var query = User.find(where).limit(limit).sort(sort).skip(skip).select(select);
        query.exec(function(error, users) {
          if(error) {
            res.status(404);
            res.send({message: 'Query Not Found!', data:[]});
          }
          else {
            res.status(200);
            res.send({message:"Success!", data:users});
          }
        });

      }
};

exports.getSpecificUser = function(req, res) {
  
   User.findById(req.params.user_id, function(error, user) {

      if(error){
        res.status(404);
        res.json({message:"User Not Found", data:[]});
      }
      if(!user) {
        res.status(404);
        res.json({message: "User Not Found", data:[]});
      }

      else {
        res.status(200);
        res.send({message: "Success!", data:user});
      }
    });
};


exports.deleteUser = function(req, res) {
  
   User.findById(req.params.user_id, function(error,user){

        if(error){
          res.status(404);
          res.json({message:"User Not Found", data:[]});
        }
        if(!user) {
          res.status(404);
          res.json({message: "User Not Found", data:[]});
        }

        else {
          User.remove({_id: req.params.user_id}, 
          function(error, user) {
            if(error) {
              res.status(500);
              res.send({message: "Server Error", data:[]});
            }
            else {
              res.status(200);
              res.json({message: 'User was successfully deleted', data:[]});
            }
          });
        }

    });
};

exports.editUser = function(req, res) {
  
   User.findById(req.params.user_id, function(error, user) {
        if(error) {
          res.status(500);
          res.send({message: "Error. User not updated!", data:[]});
        }
        else {
          user.name = req.body.name;
          user.email = req.body.email;
          user.password = req.body.password;
            user.userErrands = req.body.userErrands;
          }

          if(user.name == null) {
            res.status(500);
            res.send({message: 'Name was not provided, but is Required', data:[]});
          }

          else if (user.email == null) {
            res.status(500);
            res.send({message: 'Email was not provided, but is Required', data:[]});
          }

          else if (user.password == null) {
            res.status(500);
            res.send({message: 'Password was not provided, but is required', data:[]});

          }

          else {
          user.save(function(error) {
            if(error) {
              if(error.code === 11000) {
                res.status(500);
                res.send({message: "There is already an user with the same email!", data:[]});
              }

              else {
                res.status(500);
                res.send({message: "Erroror. Please refer to HELP section!", data:[]});
              }
            }

            else {
              res.status(200);
              res.json({message: 'User sucessfully updated!', data:[]});
              }
          });
        }
    });

};


// export