var mongoose = require('mongoose');


var bidSchema = new mongoose.Schema({
  bidAmount: Number,
  bidderID: String ,
  bidderName:  String  
}, { _id : false });

module.exports = mongoose.model('bid', bidSchema, 'bids');

var ErrandSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	deadline: {type: Date, required: true},
	createdID:  {type: String, required: true},			
	createdName: {type: String, required: true}, 
	bids : {  type: [bidSchema] }
});

module.exports = mongoose.model('Errand', ErrandSchema, 'Errands');