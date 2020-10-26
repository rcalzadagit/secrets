//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
// const _ = require("lodash");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });
// User Schema using Mongoose-Encryption
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});
//Required to use NPM Mongoose-Encryption

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});


// User Model
const User = new mongoose.model("User", userSchema);


////////////////////////////////////////////////////
app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});
// Register Route /////////////////////////////
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
// Save new user to Database
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});
// From Login form if allready registered
app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

// Find user in usersDB
  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
        }
      }
      });
  });
///////////////////////////////////////////////////////


//Server connection
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started successfully.");
});
