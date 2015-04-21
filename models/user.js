var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema   = new mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	userErrands: { type:[String], default: []},
	password: {type: String, required: true}
});

// Export the Mongoose model
UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Export the Mongoose model
// module.exports = mongoose.model('User', UserSchema);
// UserSchema.methods.generateHash = function(password) {
// 	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// UserSchema.methods.validPassword = function(password) {
// 	return bcrypt.compareSync(password, this.local.password);
// };



module.exports = mongoose.model('User', UserSchema, 'users');


// var ErrandSchema = new mongoose.Schema({
// 	description: {type: String, required: true},
// 	deadline: {type: Date, required: true},
// 	createdID:  {type: String, required: true},			
// 	createdName: {type: String, required: true}, 
// 	bids : [{bidAmount: Number, bidderID: String, bidderName: String}]
// });

// module.exports = mongoose.model('Errand', ErrandSchema, 'errands');
