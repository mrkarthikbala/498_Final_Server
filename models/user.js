var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema   = new mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	userErrands: { type:[String], default: []},
	password: {type: String, required: true}
});

// Export the Mongoose model

UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};



module.exports = mongoose.model('User', UserSchema, 'users');


// var ErrandSchema = new mongoose.Schema({
// 	description: {type: String, required: true},
// 	deadline: {type: Date, required: true},
// 	createdID:  {type: String, required: true},			
// 	createdName: {type: String, required: true}, 
// 	bids : [{bidAmount: Number, bidderID: String, bidderName: String}]
// });

// module.exports = mongoose.model('Errand', ErrandSchema, 'errands');
