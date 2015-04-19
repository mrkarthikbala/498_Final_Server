var mongoose = require('mongoose');

var bidSchema = new mongoose.Schema({
  bidAmount: {type: Number},
  bidderID: {type: String },
  bidderName: {type: String}  
});

module.exports = mongoose.model('Bid', bidSchema, 'bids');

var ErrandSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	deadline: {type: Date, required: true},
	createdID:  {type: String, required: true},			
	createdName: {type: String, required: true}, 
	bids : {  type: [bidSchema] , 
					 default: [] }
});

module.exports = mongoose.model('Errand', ErrandSchema, 'Errands');