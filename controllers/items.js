const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');
const session = require('express-session');
const passport = require('passport');
const passportlocalMongoose = require('passport-local-mongoose');

const app = express();

const userSchema = new mongoose.Schema({
    email: String,
    password: String, 
    secret: String
});

userSchema.plugin(passportlocalMongoose);


const User = new mongoose.model('User', userSchema);
passport.use(User.createStrategy());

exports.getMainPage = (req, res) => {
    res.render('home');
};

exports.getSecrets = (req, res) => {
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, (error, usersFound) => {
            if(error){
                console.log(error);
            } else {
                console.log(req.user);
                res.render('secrets', {usersSecrets: usersFound});
            }
        });       
    } else {
        res.redirect('/login');
    }
};



exports.getRegister = (req, res) => {
    res.render('register');
};

exports.postRegister = (req, res) => {
    User.register({username: req.body.username}, req.body.password, (error, user) => {
        if(error){
            console.log(error);
            res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, () =>{
                res.redirect('/secrets');
            });
        }
    });

};

exports.getSubmit = (req, res) => {
    if(req.isAuthenticated()){
        res.render('submit');
    }else {
        res.redirect('/login');
    }
};
exports.postSubmit =  (req, res) => {
    const submittedSecret = req.body.secret;

    User.findById(req.user.id, (error, userFound)=>{
        if(error){
            console.log(error);
        } else {
            userFound.secret = submittedSecret;
            userFound.save(()=>{
                res.redirect('/secrets');
            });
        }
    })

};
exports.getLogin = (req, res) => {
    res.render('login');
};
exports.postLogin =(req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (error) => {
        if(error){
            console.log(error);
        } else {
            passport.authenticate("local")(req, res, ()=>{
                res.redirect('/secrets');
            });
        }
    });

};
exports.getLogout = (req, res) => {
    req.logout();
    res.redirect('/');
};