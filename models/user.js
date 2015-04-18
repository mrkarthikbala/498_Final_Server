var mongoose = require('mongoose');

var UserSchema   = new mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	userErrands: [String],
	password {type: String, required: true}
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema, 'users');


var ErrandSchema = new mongoose.Schema({
	description: {type: String, required: true},
	deadline: {type: Date, required: true},
	createdID:  {type: String, required: true},			
	createdName: {type: String, required: true}, 
	bids : [{bidAmount: Number, bidderID: String, bidderName: String}]
});

module.exports = mongoose.model('Errand', TaskSchema, 'errands');
