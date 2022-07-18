require('dotenv').config() //Level 2 security
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption"); //Level 2 security
const md5 = require("md5"); //hash security

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userShema = new mongoose.Schema({
    email: String,
    password: String
});

// Level 2 security
// userShema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userShema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        // Level 2 security
        // password: req.body.password
        password: md5(req.body.password) //hash security
    });

    newUser.save(function(err){
        if (err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    User.findOne({email: req.body.username}, function(err, foundUser){
        if (err){
            console.log((err));
        }
        if (foundUser){
            // const password = req.body.password;
            const password = md5(req.body.password); //hash security
            // console.log(foundUser);
            if (password === foundUser.password){
                res.render('secrets');
            }
            else{
                console.log("Password is wrong!!");
            }
        }else{
            console.log("Please provide valid username");
        }
    });
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});


// Install md5 for hash security

// install dotenv for Level 2 security