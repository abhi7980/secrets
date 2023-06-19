//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_URI).then((data) => { console.log('Database connected'); });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    try{
        newUser.save();
        res.render("secrets");
    }
    catch(err){
        console.log(err);
    }
});

app.post("/login", async(req,res)=>{
    const username = req.body.username;
    const password = md5(req.body.password);

    try{
        const foundUser = await User.findOne({email: username});
        if(foundUser.password === password){
            res.render("secrets");
        }
    }
    catch(err){
        console.log(err);
    }
});

app.listen(8000, (err) => {
    (err) ? console.log("Error" + err) : console.log("Server listening on Port", 8000);
});
