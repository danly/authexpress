var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

var UserSchema = new Schema({
                  email: {type: String,
                          required: true},
                  passwordDigest: {type: String,
                                   required: true},
                  createAt: {type: Date, 
                             default: Date.now()}
                });

UserSchema.statics.createSecure = function (email, password, cb) {
  var _this = this;
  bcrypt.genSalt(function (err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      var user = {
        email: email,
        passwordDigest: hash,
        createdAt: Date.now()
      };
      _this.create(user, cb);
    });
  });
};

UserSchema.statics.authenticate = function (email, password, cb) {

  this.findOne({email: email}, function (err, user) {
    if (user === null) {
      cb("Can\'t find user with this email", null);
    } else if (user.checkPassword(password)) {
      cb(null, user);
    } else {
      cb("password incorrect", user)
    }
  });
};

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.passwordDigest);
};

var User = mongoose.model("User", UserSchema);
module.exports = User;

