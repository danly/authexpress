var express = require('express'),
    bodyParser = require('body-parser'),
    db = require("./models"),
    session = require("express-session"),
    path = require('path'),
    app = express();



var views = path.join(process.cwd(), "views");

app.use(bodyParser.urlencoded({extended: true}))

app.use(
  session({
    secret: 'super-secret-private-keyyy',
    resave: false,
    saveUninitialized: true
  })
);

app.use(function (req, res, next) {
  // login a user
  req.login = function (user) {
    req.session.userId = user._id;
  };
  // find the current user
  req.currentUser = function (cb) {
    db.User.
      findOne({ _id: req.session.userId },
      function (err, user) {
        req.user = user;
        cb(null, user);
      })
  };
  // logout the current user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  }
  // call the next middleware in the stack
  next(); 
});

app.get("/pizza", function (req, res){
  res.sendFile(path.join(views, "something.html"))
})

app.get("/signup", function (req, res) {
  res.send("working on it");
});

app.post(['/users', '/signup'], function signup (req, res) {
  var user = req.body.user;
  var email = user.email;
  var password = user.password;
  db.User.createSecure(email, password, function () {
    res.send(email + " is registered!\n");
  });
});

app.post(["/sessions", "/login"], function login(req, res) {
  var user = req.body.user;
  var email = user.email;
  var password = user.password;
  db.User.authenticate(email, password, function (err, user) {
    // login the user
    req.login(user);
    // redirect to user profile
    res.redirect("/profile"); 
  });
});

app.get("/profile", function userShow(req, res) {
  req.currentUser(function (err, user) {
    res.send("Hello " + user.email);
  })
});

app.get("/login", function (req, res) {
  res.sendFile(path.join(views, "login.html"));
});












var listener = app.listen(3002, function (){
  console.log("Listening on port " + listener.address().port);
});

