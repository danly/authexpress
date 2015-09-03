var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/authexpress")
module.exports.User = require("./user")