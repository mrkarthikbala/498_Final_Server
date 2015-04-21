var Errand = require('../models/errand');

// Create endpoint /api/beers for POST

var parseBid = function(j){
  console.log(j);
  var bid = {};
  bid.bidderID = j.substring(15, j.indexOf(',')-1);
  bid.bidderName = j.substring(j.indexOf('bidderName')+ 'bidderName'.length + 4, j.indexOf('}')-1);
  bid.bidAmount = j.substring(j.indexOf('bidAmount') + 'bidAmount'.length +3, j.indexOf('bidAmount') + 'bidAmount'.length +5);
    //what if less than 10?
  if (bid.bidAmount.indexOf(',') > -1) bid.bidAmount = bid.bidAmount.charAt(0);
  console.log(bid.bidAmount);
  return bid;
}


exports.postErrands = function(req, res) {
  // Create a new instance of the Beer model
    var errand = new Errand(); //create new task
    errand.name = req.body.name;
    errand.description = req.body.description;
    errand.deadline = req.body.deadline;
    errand.createdName = req.body.createdName; //set the fields in new errand
    errand.createdID = req.body.createdID;
    errand.bids = [];
    if (req.body.bids){
      if (req.body.bids[0] != '{'){
        for (var i = 0; i < req.body.bids.length; i++){
          var j = JSON.stringify(req.body.bids[i]);
          var bid = parseBid(j);
          errand.bids.push(bid);
        }
      }
      else{

        errand.bids.push(parseBid(JSON.stringify(req.body.bids)));
      }
    } 
    

    

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
};

// Create endpoint /api/beers for GET
exports.getErrands = function(req, res) {
  
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

};

// Create endpoint /api/beers/:beer_id for GET
exports.getSpecificErrand = function(req, res) {
  // Use the Beer model to find a specific beer
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

};

// Create endpoint /api/beers/:beer_id for PUT
exports.editErrand = function(req, res) {
  // Use the Beer model to find a specific beer
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

      if (req.body.bids){
        if (req.body.bids[0] != '{'){
          for (var i = 0; i < req.body.bids.length; i++){
            var j = JSON.stringify(req.body.bids[i]);
            var bid = parseBid(j);
            errand.bids.push(bid);
          }
        }
      else{
        errand.bids.push(parseBid(JSON.stringify(req.body.bids)));
      }
    } 
      

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

};

// Create endpoint /api/beers/:beer_id for DELETE
exports.deleteErrand = function(req, res) {
  // Use the Beer model to find a specific beer and remove it
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

};